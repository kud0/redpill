/**
 * Profit Sharing System
 *
 * Off-chain tracking for staking and profit distribution
 * - 50% Team & Dev
 * - 30% Buyback & Burn
 * - 20% Staker Rewards
 */

import { supabaseAdmin } from './supabase';

// Constants
const TIER_THRESHOLDS = {
  full: 2_000_000,  // 2M tokens for Full tier
  god: 10_000_000,  // 10M tokens for God tier
};

const TIER_LOCK_DAYS = {
  full: 30,  // 30 days lock
  god: 90,   // 90 days lock
};

const TIER_MULTIPLIER = {
  full: 1.0,
  god: 1.5,
};

const PROFIT_SPLIT = {
  team: 0.50,      // 50%
  buyback: 0.30,   // 30%
  stakers: 0.20,   // 20%
};

// Types
export interface Stake {
  id: string;
  wallet_address: string;
  amount: number;
  tier: 'full' | 'god';
  staked_at: string;
  eligible_at: string;
  is_eligible: boolean;
}

export interface ProfitPeriod {
  id: string;
  period_start: string;
  period_end: string;
  total_revenue: number;
  total_costs: number;
  net_profit: number;
  staker_pool: number;
  buyback_amount: number;
  team_amount: number;
  status: 'open' | 'calculating' | 'distributed';
}

export interface RewardClaim {
  id: string;
  wallet_address: string;
  profit_period_id: string;
  stake_amount: number;
  stake_days: number;
  tier_multiplier: number;
  share_percentage: number;
  reward_amount: number;
  status: 'pending' | 'claimed' | 'expired';
}

/**
 * Determine tier based on token balance
 */
export function getTierFromBalance(balance: number): 'full' | 'god' | null {
  if (balance >= TIER_THRESHOLDS.god) return 'god';
  if (balance >= TIER_THRESHOLDS.full) return 'full';
  return null;
}

/**
 * Register a new stake
 */
export async function registerStake(walletAddress: string, tokenBalance: number): Promise<Stake | null> {
  const tier = getTierFromBalance(tokenBalance);

  if (!tier) {
    console.log(`Balance ${tokenBalance} does not meet minimum threshold`);
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from('stakes')
    .upsert({
      wallet_address: walletAddress,
      amount: tokenBalance,
      tier,
      staked_at: new Date().toISOString(),
      last_verified_at: new Date().toISOString(),
      is_eligible: false,
    }, {
      onConflict: 'wallet_address',
    })
    .select()
    .single();

  if (error) {
    console.error('Error registering stake:', error);
    return null;
  }

  return data;
}

/**
 * Verify stake is still valid (daily snapshot)
 */
export async function verifyStake(walletAddress: string, currentBalance: number): Promise<boolean> {
  const tier = getTierFromBalance(currentBalance);

  // Record snapshot
  await supabaseAdmin.from('stake_snapshots').upsert({
    wallet_address: walletAddress,
    snapshot_date: new Date().toISOString().split('T')[0],
    balance: currentBalance,
    still_eligible: tier !== null,
  }, {
    onConflict: 'wallet_address,snapshot_date',
  });

  // If balance dropped below threshold, reset stake
  if (!tier) {
    await supabaseAdmin
      .from('stakes')
      .update({
        is_eligible: false,
        staked_at: new Date().toISOString(), // Reset timer
        last_verified_at: new Date().toISOString(),
      })
      .eq('wallet_address', walletAddress);

    return false;
  }

  // Update last verified and check eligibility
  const { data: stake } = await supabaseAdmin
    .from('stakes')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (stake) {
    const eligibleAt = new Date(stake.eligible_at);
    const isEligible = new Date() >= eligibleAt;

    await supabaseAdmin
      .from('stakes')
      .update({
        amount: currentBalance,
        tier,
        last_verified_at: new Date().toISOString(),
        is_eligible: isEligible,
      })
      .eq('wallet_address', walletAddress);

    return isEligible;
  }

  return false;
}

/**
 * Get stake info for a wallet
 */
export async function getStakeInfo(walletAddress: string): Promise<Stake | null> {
  const { data, error } = await supabaseAdmin
    .from('stakes')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (error) return null;
  return data;
}

/**
 * Get all eligible stakers
 */
export async function getEligibleStakers(): Promise<Stake[]> {
  const { data, error } = await supabaseAdmin
    .from('stakes')
    .select('*')
    .eq('is_eligible', true);

  if (error) return [];
  return data || [];
}

/**
 * Create a new profit period (monthly)
 */
export async function createProfitPeriod(
  periodStart: Date,
  periodEnd: Date
): Promise<ProfitPeriod | null> {
  const { data, error } = await supabaseAdmin
    .from('profit_periods')
    .insert({
      period_start: periodStart.toISOString().split('T')[0],
      period_end: periodEnd.toISOString().split('T')[0],
      status: 'open',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating profit period:', error);
    return null;
  }

  return data;
}

/**
 * Record revenue and costs for a period
 */
export async function recordProfitData(
  periodId: string,
  revenue: number,
  costs: number
): Promise<ProfitPeriod | null> {
  const netProfit = Math.max(0, revenue - costs);

  const { data, error } = await supabaseAdmin
    .from('profit_periods')
    .update({
      total_revenue: revenue,
      total_costs: costs,
      net_profit: netProfit,
      staker_pool: netProfit * PROFIT_SPLIT.stakers,
      buyback_amount: netProfit * PROFIT_SPLIT.buyback,
      team_amount: netProfit * PROFIT_SPLIT.team,
      status: 'calculating',
    })
    .eq('id', periodId)
    .select()
    .single();

  if (error) {
    console.error('Error recording profit data:', error);
    return null;
  }

  return data;
}

/**
 * Calculate rewards for all eligible stakers
 */
export async function calculateRewards(periodId: string): Promise<RewardClaim[]> {
  const { data: period } = await supabaseAdmin
    .from('profit_periods')
    .select('*')
    .eq('id', periodId)
    .single();

  if (!period || period.staker_pool <= 0) {
    return [];
  }

  const stakers = await getEligibleStakers();
  if (stakers.length === 0) return [];

  // Calculate weighted stakes
  const periodEnd = new Date(period.period_end);
  let totalWeightedStake = 0;

  const stakerWeights = stakers.map(stake => {
    const stakedAt = new Date(stake.staked_at);
    const daysStaked = Math.min(30, Math.max(0,
      Math.floor((periodEnd.getTime() - stakedAt.getTime()) / (1000 * 60 * 60 * 24))
    ));
    const multiplier = TIER_MULTIPLIER[stake.tier];
    const weightedStake = stake.amount * daysStaked * multiplier;
    totalWeightedStake += weightedStake;

    return {
      stake,
      daysStaked,
      multiplier,
      weightedStake,
    };
  });

  // Calculate individual rewards
  const claims: RewardClaim[] = [];

  for (const { stake, daysStaked, multiplier, weightedStake } of stakerWeights) {
    const sharePercentage = weightedStake / totalWeightedStake;
    const rewardAmount = period.staker_pool * sharePercentage;

    const { data: claim, error } = await supabaseAdmin
      .from('reward_claims')
      .insert({
        wallet_address: stake.wallet_address,
        profit_period_id: periodId,
        stake_amount: stake.amount,
        stake_days: daysStaked,
        tier_multiplier: multiplier,
        share_percentage: sharePercentage,
        reward_amount: rewardAmount,
        status: 'pending',
      })
      .select()
      .single();

    if (claim) {
      claims.push(claim);
    }
  }

  return claims;
}

/**
 * Mark a claim as claimed (after manual SOL transfer)
 */
export async function markClaimAsClaimed(
  claimId: string,
  txSignature: string
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('reward_claims')
    .update({
      status: 'claimed',
      claimed_at: new Date().toISOString(),
      tx_signature: txSignature,
    })
    .eq('id', claimId);

  return !error;
}

/**
 * Record a buyback transaction
 */
export async function recordBuyback(
  periodId: string,
  amountSol: number,
  tokensBought: number,
  tokensBurned: number,
  txSignature: string
): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('buybacks')
    .insert({
      profit_period_id: periodId,
      amount_sol: amountSol,
      tokens_bought: tokensBought,
      tokens_burned: tokensBurned,
      tx_signature: txSignature,
    });

  return !error;
}

/**
 * Get pending claims for a wallet
 */
export async function getPendingClaims(walletAddress: string): Promise<RewardClaim[]> {
  const { data, error } = await supabaseAdmin
    .from('reward_claims')
    .select('*')
    .eq('wallet_address', walletAddress)
    .eq('status', 'pending');

  if (error) return [];
  return data || [];
}

/**
 * Get profit period summary
 */
export async function getProfitPeriodSummary(periodId: string) {
  const { data: period } = await supabaseAdmin
    .from('profit_periods')
    .select('*')
    .eq('id', periodId)
    .single();

  const { data: claims } = await supabaseAdmin
    .from('reward_claims')
    .select('*')
    .eq('profit_period_id', periodId);

  const { data: buybacks } = await supabaseAdmin
    .from('buybacks')
    .select('*')
    .eq('profit_period_id', periodId);

  return {
    period,
    claims: claims || [],
    buybacks: buybacks || [],
    totalClaimed: claims?.filter((c: RewardClaim) => c.status === 'claimed').reduce((sum: number, c: RewardClaim) => sum + c.reward_amount, 0) || 0,
    totalPending: claims?.filter((c: RewardClaim) => c.status === 'pending').reduce((sum: number, c: RewardClaim) => sum + c.reward_amount, 0) || 0,
    totalBurned: buybacks?.reduce((sum: number, b: { tokens_burned: number }) => sum + b.tokens_burned, 0) || 0,
  };
}

/**
 * Dashboard stats
 */
export async function getDashboardStats() {
  const { data: stakes } = await supabaseAdmin
    .from('stakes')
    .select('*');

  const { data: periods } = await supabaseAdmin
    .from('profit_periods')
    .select('*')
    .order('period_end', { ascending: false })
    .limit(1);

  const { data: allBuybacks } = await supabaseAdmin
    .from('buybacks')
    .select('tokens_burned');

  const totalStaked = stakes?.reduce((sum: number, s: Stake) => sum + s.amount, 0) || 0;
  const eligibleStakers = stakes?.filter((s: Stake) => s.is_eligible).length || 0;
  const totalBurned = allBuybacks?.reduce((sum: number, b: { tokens_burned: number }) => sum + b.tokens_burned, 0) || 0;
  const currentPeriod = periods?.[0] || null;

  return {
    totalStaked,
    totalStakers: stakes?.length || 0,
    eligibleStakers,
    totalBurned,
    currentPeriod,
  };
}
