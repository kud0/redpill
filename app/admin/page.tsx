'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  StatCard,
  Panel,
  Table,
  Button,
  Badge,
  Tabs,
  Modal,
  Input,
  formatNumber,
  formatDate,
  formatWallet,
  formatSOL,
} from '@/components/admin';

// ============================================
// TYPES
// ============================================
interface DashboardStats {
  totalStaked: number;
  totalStakers: number;
  eligibleStakers: number;
  totalBurned: number;
  currentPeriod: ProfitPeriod | null;
}

interface Stake {
  id: string;
  wallet_address: string;
  amount: number;
  tier: 'full' | 'god';
  staked_at: string;
  eligible_at: string;
  is_eligible: boolean;
}

interface ProfitPeriod {
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

interface RewardClaim {
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

interface Buyback {
  id: string;
  profit_period_id: string;
  amount_sol: number;
  tokens_bought: number;
  tokens_burned: number;
  tx_signature: string;
  executed_at: string;
}

// ============================================
// CUSTOM HOOKS (DRY)
// ============================================
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  return { data, loading, error, refetch };
}

// ============================================
// SUB-COMPONENTS
// ============================================

// Stats Overview Section
function StatsOverview({ stats, loading }: { stats: DashboardStats | null; loading: boolean }) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-white/5 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Staked"
        value={formatNumber(stats.totalStaked)}
        variant="default"
        icon={<TokenIcon />}
      />
      <StatCard
        label="Active Stakers"
        value={`${stats.eligibleStakers}/${stats.totalStakers}`}
        variant="success"
        icon={<UsersIcon />}
      />
      <StatCard
        label="Total Burned"
        value={formatNumber(stats.totalBurned)}
        variant="danger"
        icon={<FireIcon />}
      />
      <StatCard
        label="Current Period"
        value={stats.currentPeriod?.status?.toUpperCase() || 'NONE'}
        variant={stats.currentPeriod ? 'warning' : 'default'}
        icon={<CalendarIcon />}
      />
    </div>
  );
}

// Stakers Table Section
function StakersSection({ data, loading }: { data: Stake[] | null; loading: boolean }) {
  const columns = [
    {
      key: 'wallet_address',
      header: 'Wallet',
      render: (item: Stake) => formatWallet(item.wallet_address, 6),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (item: Stake) => formatNumber(item.amount),
    },
    {
      key: 'tier',
      header: 'Tier',
      render: (item: Stake) => (
        <Badge variant={item.tier === 'god' ? 'warning' : 'info'}>
          {item.tier}
        </Badge>
      ),
    },
    {
      key: 'is_eligible',
      header: 'Status',
      render: (item: Stake) => (
        <Badge variant={item.is_eligible ? 'success' : 'default'}>
          {item.is_eligible ? 'Eligible' : 'Pending'}
        </Badge>
      ),
    },
    {
      key: 'eligible_at',
      header: 'Eligible Date',
      render: (item: Stake) => formatDate(item.eligible_at),
    },
  ];

  return (
    <Panel title="Stakers" subtitle="All registered stakers">
      <Table
        columns={columns}
        data={data || []}
        keyExtractor={(item) => item.id}
        loading={loading}
        emptyMessage="No stakers registered yet"
      />
    </Panel>
  );
}

// Profit Periods Section
function PeriodsSection({
  data,
  loading,
  onCreatePeriod,
  onRecordProfit,
  onCalculate,
  onDistribute,
}: {
  data: ProfitPeriod[] | null;
  loading: boolean;
  onCreatePeriod: () => void;
  onRecordProfit: (period: ProfitPeriod) => void;
  onCalculate: (periodId: string) => void;
  onDistribute: (periodId: string) => void;
}) {
  const columns = [
    {
      key: 'period',
      header: 'Period',
      render: (item: ProfitPeriod) => `${formatDate(item.period_start)} - ${formatDate(item.period_end)}`,
    },
    {
      key: 'net_profit',
      header: 'Net Profit',
      render: (item: ProfitPeriod) => formatSOL(item.net_profit),
    },
    {
      key: 'staker_pool',
      header: 'Staker Pool (20%)',
      render: (item: ProfitPeriod) => formatSOL(item.staker_pool),
    },
    {
      key: 'buyback_amount',
      header: 'Buyback (30%)',
      render: (item: ProfitPeriod) => formatSOL(item.buyback_amount),
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: ProfitPeriod) => {
        const variants: Record<string, 'default' | 'warning' | 'success'> = {
          open: 'default',
          calculating: 'warning',
          distributed: 'success',
        };
        return <Badge variant={variants[item.status]}>{item.status}</Badge>;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: ProfitPeriod) => (
        <div className="flex gap-2">
          {item.status === 'open' && (
            <Button size="sm" variant="secondary" onClick={() => onRecordProfit(item)}>
              Record
            </Button>
          )}
          {item.status === 'calculating' && (
            <>
              <Button size="sm" variant="secondary" onClick={() => onCalculate(item.id)}>
                Calculate
              </Button>
              <Button size="sm" variant="primary" onClick={() => onDistribute(item.id)}>
                Distribute
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <Panel
      title="Profit Periods"
      subtitle="Monthly profit distribution periods"
      actions={<Button size="sm" onClick={onCreatePeriod}>New Period</Button>}
    >
      <Table
        columns={columns}
        data={data || []}
        keyExtractor={(item) => item.id}
        loading={loading}
        emptyMessage="No profit periods created yet"
      />
    </Panel>
  );
}

// Claims Section
function ClaimsSection({
  data,
  loading,
  onMarkClaimed,
}: {
  data: RewardClaim[] | null;
  loading: boolean;
  onMarkClaimed: (claim: RewardClaim) => void;
}) {
  const columns = [
    {
      key: 'wallet_address',
      header: 'Wallet',
      render: (item: RewardClaim) => formatWallet(item.wallet_address, 6),
    },
    {
      key: 'reward_amount',
      header: 'Reward',
      render: (item: RewardClaim) => formatSOL(item.reward_amount),
    },
    {
      key: 'share_percentage',
      header: 'Share %',
      render: (item: RewardClaim) => `${(item.share_percentage * 100).toFixed(2)}%`,
    },
    {
      key: 'tier_multiplier',
      header: 'Multiplier',
      render: (item: RewardClaim) => `${item.tier_multiplier}x`,
    },
    {
      key: 'stake_days',
      header: 'Days',
      render: (item: RewardClaim) => item.stake_days,
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: RewardClaim) => {
        const variants: Record<string, 'default' | 'success' | 'danger'> = {
          pending: 'default',
          claimed: 'success',
          expired: 'danger',
        };
        return <Badge variant={variants[item.status]}>{item.status}</Badge>;
      },
    },
    {
      key: 'actions',
      header: '',
      render: (item: RewardClaim) =>
        item.status === 'pending' && (
          <Button size="sm" variant="ghost" onClick={() => onMarkClaimed(item)}>
            Mark Paid
          </Button>
        ),
    },
  ];

  return (
    <Panel title="Reward Claims" subtitle="Individual staker rewards">
      <Table
        columns={columns}
        data={data || []}
        keyExtractor={(item) => item.id}
        loading={loading}
        emptyMessage="No claims found"
      />
    </Panel>
  );
}

// Buybacks Section
function BuybacksSection({
  data,
  loading,
  onAddBuyback,
}: {
  data: Buyback[] | null;
  loading: boolean;
  onAddBuyback: () => void;
}) {
  const columns = [
    {
      key: 'executed_at',
      header: 'Date',
      render: (item: Buyback) => formatDate(item.executed_at),
    },
    {
      key: 'amount_sol',
      header: 'SOL Spent',
      render: (item: Buyback) => formatSOL(item.amount_sol),
    },
    {
      key: 'tokens_bought',
      header: 'Tokens Bought',
      render: (item: Buyback) => formatNumber(item.tokens_bought),
    },
    {
      key: 'tokens_burned',
      header: 'Tokens Burned',
      render: (item: Buyback) => formatNumber(item.tokens_burned),
    },
    {
      key: 'tx_signature',
      header: 'TX',
      render: (item: Buyback) => (
        <a
          href={`https://solscan.io/tx/${item.tx_signature}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neon-blue hover:underline"
        >
          {formatWallet(item.tx_signature, 8)}
        </a>
      ),
    },
  ];

  return (
    <Panel
      title="Buyback & Burn"
      subtitle="Token buyback records"
      actions={<Button size="sm" onClick={onAddBuyback}>Record Buyback</Button>}
    >
      <Table
        columns={columns}
        data={data || []}
        keyExtractor={(item) => item.id}
        loading={loading}
        emptyMessage="No buybacks recorded yet"
      />
    </Panel>
  );
}

// ============================================
// ICONS (DRY - reusable)
// ============================================
const TokenIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const FireIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Data fetching
  const { data: stats, loading: statsLoading, refetch: refetchStats } = useFetch<DashboardStats>('/api/admin/stats');
  const { data: stakes, loading: stakesLoading } = useFetch<Stake[]>('/api/admin/stakes');
  const { data: periods, loading: periodsLoading, refetch: refetchPeriods } = useFetch<ProfitPeriod[]>('/api/admin/periods');
  const { data: claims, loading: claimsLoading, refetch: refetchClaims } = useFetch<RewardClaim[]>('/api/admin/claims');
  const { data: buybacks, loading: buybacksLoading, refetch: refetchBuybacks } = useFetch<Buyback[]>('/api/admin/buybacks');

  // Modal states
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showBuybackModal, setShowBuybackModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<ProfitPeriod | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<RewardClaim | null>(null);

  // Form states
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [revenue, setRevenue] = useState('');
  const [costs, setCosts] = useState('');
  const [txSignature, setTxSignature] = useState('');
  const [buybackSol, setBuybackSol] = useState('');
  const [tokensBought, setTokensBought] = useState('');
  const [tokensBurned, setTokensBurned] = useState('');

  // Handlers
  const handleCreatePeriod = async () => {
    try {
      await fetch('/api/admin/periods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', periodStart, periodEnd }),
      });
      setShowPeriodModal(false);
      setPeriodStart('');
      setPeriodEnd('');
      refetchPeriods();
    } catch (err) {
      console.error('Failed to create period:', err);
    }
  };

  const handleRecordProfit = async () => {
    if (!selectedPeriod) return;
    try {
      await fetch('/api/admin/periods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'record',
          periodId: selectedPeriod.id,
          revenue: parseFloat(revenue),
          costs: parseFloat(costs),
        }),
      });
      setShowProfitModal(false);
      setRevenue('');
      setCosts('');
      refetchPeriods();
      refetchStats();
    } catch (err) {
      console.error('Failed to record profit:', err);
    }
  };

  const handleCalculate = async (periodId: string) => {
    try {
      await fetch('/api/admin/periods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'calculate', periodId }),
      });
      refetchClaims();
    } catch (err) {
      console.error('Failed to calculate rewards:', err);
    }
  };

  const handleDistribute = async (periodId: string) => {
    try {
      await fetch('/api/admin/periods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'distribute', periodId }),
      });
      refetchPeriods();
      refetchStats();
    } catch (err) {
      console.error('Failed to distribute:', err);
    }
  };

  const handleMarkClaimed = async () => {
    if (!selectedClaim) return;
    try {
      await fetch('/api/admin/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimId: selectedClaim.id, txSignature }),
      });
      setShowClaimModal(false);
      setTxSignature('');
      refetchClaims();
    } catch (err) {
      console.error('Failed to mark claim:', err);
    }
  };

  const handleAddBuyback = async () => {
    const activePeriod = periods?.find(p => p.status !== 'distributed');
    if (!activePeriod) return;
    try {
      await fetch('/api/admin/buybacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodId: activePeriod.id,
          amountSol: parseFloat(buybackSol),
          tokensBought: parseInt(tokensBought),
          tokensBurned: parseInt(tokensBurned),
          txSignature,
        }),
      });
      setShowBuybackModal(false);
      setBuybackSol('');
      setTokensBought('');
      setTokensBurned('');
      setTxSignature('');
      refetchBuybacks();
      refetchStats();
    } catch (err) {
      console.error('Failed to record buyback:', err);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'stakers', label: 'Stakers', count: stakes?.length },
    { id: 'periods', label: 'Periods', count: periods?.length },
    { id: 'claims', label: 'Claims', count: claims?.filter(c => c.status === 'pending').length },
    { id: 'buybacks', label: 'Buybacks', count: buybacks?.length },
  ];

  return (
    <div className="min-h-screen bg-matrix-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Profit Sharing Management</p>
            </div>
            <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
              ← Back to App
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats */}
        <StatsOverview stats={stats} loading={statsLoading} />

        {/* Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PeriodsSection
                data={periods?.slice(0, 5) || null}
                loading={periodsLoading}
                onCreatePeriod={() => setShowPeriodModal(true)}
                onRecordProfit={(p) => { setSelectedPeriod(p); setShowProfitModal(true); }}
                onCalculate={handleCalculate}
                onDistribute={handleDistribute}
              />
              <ClaimsSection
                data={claims?.filter(c => c.status === 'pending').slice(0, 5) || null}
                loading={claimsLoading}
                onMarkClaimed={(c) => { setSelectedClaim(c); setShowClaimModal(true); }}
              />
            </div>
          )}

          {activeTab === 'stakers' && (
            <StakersSection data={stakes} loading={stakesLoading} />
          )}

          {activeTab === 'periods' && (
            <PeriodsSection
              data={periods}
              loading={periodsLoading}
              onCreatePeriod={() => setShowPeriodModal(true)}
              onRecordProfit={(p) => { setSelectedPeriod(p); setShowProfitModal(true); }}
              onCalculate={handleCalculate}
              onDistribute={handleDistribute}
            />
          )}

          {activeTab === 'claims' && (
            <ClaimsSection
              data={claims}
              loading={claimsLoading}
              onMarkClaimed={(c) => { setSelectedClaim(c); setShowClaimModal(true); }}
            />
          )}

          {activeTab === 'buybacks' && (
            <BuybacksSection
              data={buybacks}
              loading={buybacksLoading}
              onAddBuyback={() => setShowBuybackModal(true)}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={showPeriodModal} onClose={() => setShowPeriodModal(false)} title="Create Profit Period">
        <div className="space-y-4">
          <Input
            label="Period Start"
            type="date"
            value={periodStart}
            onChange={setPeriodStart}
          />
          <Input
            label="Period End"
            type="date"
            value={periodEnd}
            onChange={setPeriodEnd}
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowPeriodModal(false)}>Cancel</Button>
            <Button onClick={handleCreatePeriod}>Create</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showProfitModal} onClose={() => setShowProfitModal(false)} title="Record Profit Data">
        <div className="space-y-4">
          <Input
            label="Total Revenue (SOL)"
            type="number"
            value={revenue}
            onChange={setRevenue}
            placeholder="0.00"
          />
          <Input
            label="Total Costs (SOL)"
            type="number"
            value={costs}
            onChange={setCosts}
            placeholder="0.00"
          />
          {revenue && costs && (
            <div className="p-4 bg-white/5 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Net Profit:</span>
                <span className="text-white">{formatSOL(Math.max(0, parseFloat(revenue || '0') - parseFloat(costs || '0')))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Staker Pool (20%):</span>
                <span className="text-neon-green">{formatSOL(Math.max(0, (parseFloat(revenue || '0') - parseFloat(costs || '0')) * 0.2))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Buyback (30%):</span>
                <span className="text-neon-red">{formatSOL(Math.max(0, (parseFloat(revenue || '0') - parseFloat(costs || '0')) * 0.3))}</span>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowProfitModal(false)}>Cancel</Button>
            <Button onClick={handleRecordProfit}>Record</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showClaimModal} onClose={() => setShowClaimModal(false)} title="Mark Claim as Paid">
        <div className="space-y-4">
          {selectedClaim && (
            <div className="p-4 bg-white/5 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Wallet:</span>
                <span className="text-white font-mono">{formatWallet(selectedClaim.wallet_address, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Reward Amount:</span>
                <span className="text-neon-green">{formatSOL(selectedClaim.reward_amount)}</span>
              </div>
            </div>
          )}
          <Input
            label="Transaction Signature"
            type="text"
            value={txSignature}
            onChange={setTxSignature}
            placeholder="Enter Solana TX signature"
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowClaimModal(false)}>Cancel</Button>
            <Button onClick={handleMarkClaimed}>Mark Paid</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showBuybackModal} onClose={() => setShowBuybackModal(false)} title="Record Buyback & Burn">
        <div className="space-y-4">
          <Input
            label="SOL Spent"
            type="number"
            value={buybackSol}
            onChange={setBuybackSol}
            placeholder="0.00"
          />
          <Input
            label="Tokens Bought"
            type="number"
            value={tokensBought}
            onChange={setTokensBought}
            placeholder="0"
          />
          <Input
            label="Tokens Burned"
            type="number"
            value={tokensBurned}
            onChange={setTokensBurned}
            placeholder="0"
          />
          <Input
            label="Transaction Signature"
            type="text"
            value={txSignature}
            onChange={setTxSignature}
            placeholder="Enter Solana TX signature"
          />
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setShowBuybackModal(false)}>Cancel</Button>
            <Button onClick={handleAddBuyback}>Record</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
