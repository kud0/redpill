import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { TierLevel } from './types';

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Rate limit configuration
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10');

// Create Supabase client (service role for backend operations)
let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      throw new Error('Supabase configuration missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    }
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabase;
}

// Create public client for client-side operations
export function getPublicSupabaseClient(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase public configuration missing');
  }
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// ============================================
// Database Types
// ============================================

export interface DbUser {
  id: string;
  wallet_address: string;
  telegram_user_id: number | null;
  telegram_username: string | null;
  created_at: string;
  updated_at: string;
  last_balance_check: string | null;
  cached_balance: number;
  cached_tier: TierLevel;
  is_banned: boolean;
  ban_reason: string | null;
}

export interface DbRateLimit {
  id: string;
  wallet_address: string;
  request_count: number;
  window_start: string;
  window_end: string;
  created_at: string;
  updated_at: string;
}

export interface DbActivityLog {
  id: string;
  wallet_address: string;
  action_type: ActionType;
  action_details: Record<string, unknown>;
  model_used: string | null;
  tokens_used: number | null;
  cost_usd: number | null;
  success: boolean;
  error_message: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface DbGeneratedContent {
  id: string;
  wallet_address: string;
  content_type: ContentType;
  prompt: string | null;
  result_url: string | null;
  result_data: Record<string, unknown> | null;
  model_used: string | null;
  generation_params: Record<string, unknown>;
  created_at: string;
}

export type ActionType =
  | 'image_generation'
  | 'meme_generation'
  | 'thread_writing'
  | 'voice_cloning'
  | 'vocal_removal'
  | 'balance_check'
  | 'wallet_link';

export type ContentType =
  | 'image'
  | 'meme'
  | 'thread'
  | 'voice_clone'
  | 'vocal_stems';

// ============================================
// User Operations
// ============================================

export async function getOrCreateUser(walletAddress: string): Promise<DbUser> {
  const client = getSupabaseClient();

  // Try to get existing user
  const { data: existing, error: selectError } = await client
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (existing && !selectError) {
    return existing as DbUser;
  }

  // Create new user
  const { data: newUser, error: insertError } = await client
    .from('users')
    .insert({ wallet_address: walletAddress })
    .select()
    .single();

  if (insertError) {
    throw new Error(`Failed to create user: ${insertError.message}`);
  }

  return newUser as DbUser;
}

export async function updateUserBalance(
  walletAddress: string,
  balance: number,
  tier: TierLevel
): Promise<void> {
  const client = getSupabaseClient();

  const { error } = await client
    .from('users')
    .update({
      cached_balance: balance,
      cached_tier: tier,
      last_balance_check: new Date().toISOString(),
    })
    .eq('wallet_address', walletAddress);

  if (error) {
    console.error('Failed to update user balance:', error);
  }
}

export async function linkTelegramUser(
  walletAddress: string,
  telegramUserId: number,
  telegramUsername?: string
): Promise<DbUser> {
  const client = getSupabaseClient();

  // First ensure user exists
  await getOrCreateUser(walletAddress);

  // Update with telegram info
  const { data, error } = await client
    .from('users')
    .update({
      telegram_user_id: telegramUserId,
      telegram_username: telegramUsername || null,
    })
    .eq('wallet_address', walletAddress)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to link telegram: ${error.message}`);
  }

  return data as DbUser;
}

export async function getUserByTelegramId(telegramUserId: number): Promise<DbUser | null> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('users')
    .select('*')
    .eq('telegram_user_id', telegramUserId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as DbUser;
}

export async function banUser(walletAddress: string, reason: string): Promise<void> {
  const client = getSupabaseClient();

  const { error } = await client
    .from('users')
    .update({
      is_banned: true,
      ban_reason: reason,
    })
    .eq('wallet_address', walletAddress);

  if (error) {
    throw new Error(`Failed to ban user: ${error.message}`);
  }
}

export async function isUserBanned(walletAddress: string): Promise<boolean> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('users')
    .select('is_banned')
    .eq('wallet_address', walletAddress)
    .single();

  if (error || !data) {
    return false;
  }

  return data.is_banned;
}

// ============================================
// Rate Limiting Operations
// ============================================

export async function checkRateLimitDb(wallet: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
}> {
  const client = getSupabaseClient();
  const now = new Date();
  const windowEnd = new Date(now.getTime() + WINDOW_MS);

  // Get current active rate limit window
  const { data: existing, error: selectError } = await client
    .from('rate_limits')
    .select('*')
    .eq('wallet_address', wallet)
    .gt('window_end', now.toISOString())
    .order('window_end', { ascending: false })
    .limit(1)
    .single();

  // No active window or window expired - create new one
  if (!existing || selectError) {
    const { error: insertError } = await client
      .from('rate_limits')
      .insert({
        wallet_address: wallet,
        request_count: 1,
        window_start: now.toISOString(),
        window_end: windowEnd.toISOString(),
      });

    if (insertError) {
      console.error('Failed to create rate limit:', insertError);
      // Fallback to allow (fail open)
      return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt: windowEnd.getTime() };
    }

    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetAt: windowEnd.getTime(),
    };
  }

  // Window exists - check limit
  const rateLimit = existing as DbRateLimit;

  if (rateLimit.request_count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(rateLimit.window_end).getTime(),
    };
  }

  // Increment counter
  const { error: updateError } = await client
    .from('rate_limits')
    .update({ request_count: rateLimit.request_count + 1 })
    .eq('id', rateLimit.id);

  if (updateError) {
    console.error('Failed to update rate limit:', updateError);
  }

  return {
    allowed: true,
    remaining: MAX_REQUESTS - rateLimit.request_count - 1,
    resetAt: new Date(rateLimit.window_end).getTime(),
  };
}

export async function clearRateLimitDb(wallet: string): Promise<void> {
  const client = getSupabaseClient();

  const { error } = await client
    .from('rate_limits')
    .delete()
    .eq('wallet_address', wallet);

  if (error) {
    console.error('Failed to clear rate limit:', error);
  }
}

export async function cleanupExpiredRateLimits(): Promise<number> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('rate_limits')
    .delete()
    .lt('window_end', new Date().toISOString())
    .select('id');

  if (error) {
    console.error('Failed to cleanup rate limits:', error);
    return 0;
  }

  return data?.length || 0;
}

// ============================================
// Activity Logging
// ============================================

export async function logActivity(params: {
  walletAddress: string;
  actionType: ActionType;
  actionDetails?: Record<string, unknown>;
  modelUsed?: string;
  tokensUsed?: number;
  costUsd?: number;
  success?: boolean;
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> {
  const client = getSupabaseClient();

  const { error } = await client.from('activity_log').insert({
    wallet_address: params.walletAddress,
    action_type: params.actionType,
    action_details: params.actionDetails || {},
    model_used: params.modelUsed || null,
    tokens_used: params.tokensUsed || null,
    cost_usd: params.costUsd || null,
    success: params.success ?? true,
    error_message: params.errorMessage || null,
    ip_address: params.ipAddress || null,
    user_agent: params.userAgent || null,
  });

  if (error) {
    console.error('Failed to log activity:', error);
  }
}

export async function getRecentActivity(
  walletAddress: string,
  limit = 10
): Promise<DbActivityLog[]> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('activity_log')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Failed to get activity:', error);
    return [];
  }

  return data as DbActivityLog[];
}

// ============================================
// Generated Content Storage
// ============================================

export async function saveGeneratedContent(params: {
  walletAddress: string;
  contentType: ContentType;
  prompt?: string;
  resultUrl?: string;
  resultData?: Record<string, unknown>;
  modelUsed?: string;
  generationParams?: Record<string, unknown>;
}): Promise<string> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .from('generated_content')
    .insert({
      wallet_address: params.walletAddress,
      content_type: params.contentType,
      prompt: params.prompt || null,
      result_url: params.resultUrl || null,
      result_data: params.resultData || null,
      model_used: params.modelUsed || null,
      generation_params: params.generationParams || {},
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to save content: ${error.message}`);
  }

  return data.id;
}

export async function getUserContent(
  walletAddress: string,
  contentType?: ContentType,
  limit = 20
): Promise<DbGeneratedContent[]> {
  const client = getSupabaseClient();

  let query = client
    .from('generated_content')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (contentType) {
    query = query.eq('content_type', contentType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to get content:', error);
    return [];
  }

  return data as DbGeneratedContent[];
}

// ============================================
// API Usage Tracking
// ============================================

export async function trackApiUsage(params: {
  provider: string;
  endpoint: string;
  tokens?: number;
  costUsd?: number;
}): Promise<void> {
  const client = getSupabaseClient();
  const today = new Date().toISOString().split('T')[0];

  // Try to update existing record
  const { data: existing } = await client
    .from('api_usage')
    .select('*')
    .eq('provider', params.provider)
    .eq('endpoint', params.endpoint)
    .eq('date', today)
    .single();

  if (existing) {
    const { error } = await client
      .from('api_usage')
      .update({
        request_count: existing.request_count + 1,
        total_tokens: existing.total_tokens + (params.tokens || 0),
        total_cost_usd: existing.total_cost_usd + (params.costUsd || 0),
      })
      .eq('id', existing.id);

    if (error) {
      console.error('Failed to update API usage:', error);
    }
  } else {
    // Insert new record
    const { error } = await client.from('api_usage').insert({
      provider: params.provider,
      endpoint: params.endpoint,
      request_count: 1,
      total_tokens: params.tokens || 0,
      total_cost_usd: params.costUsd || 0,
      date: today,
    });

    if (error) {
      console.error('Failed to insert API usage:', error);
    }
  }
}

export async function getApiUsageStats(
  startDate?: string,
  endDate?: string
): Promise<{
  provider: string;
  total_requests: number;
  total_tokens: number;
  total_cost: number;
}[]> {
  const client = getSupabaseClient();

  let query = client
    .from('api_usage')
    .select('provider, request_count, total_tokens, total_cost_usd');

  if (startDate) {
    query = query.gte('date', startDate);
  }
  if (endDate) {
    query = query.lte('date', endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to get API usage:', error);
    return [];
  }

  // Aggregate by provider
  const aggregated: Record<string, { requests: number; tokens: number; cost: number }> = {};

  for (const row of data) {
    if (!aggregated[row.provider]) {
      aggregated[row.provider] = { requests: 0, tokens: 0, cost: 0 };
    }
    aggregated[row.provider].requests += row.request_count;
    aggregated[row.provider].tokens += row.total_tokens;
    aggregated[row.provider].cost += parseFloat(row.total_cost_usd);
  }

  return Object.entries(aggregated).map(([provider, stats]) => ({
    provider,
    total_requests: stats.requests,
    total_tokens: stats.tokens,
    total_cost: stats.cost,
  }));
}

// ============================================
// User Statistics
// ============================================

export async function getUserStats(walletAddress: string): Promise<{
  totalGenerations: number;
  imagesGenerated: number;
  memesGenerated: number;
  threadsWritten: number;
  firstActivity: string | null;
  lastActivity: string | null;
}> {
  const client = getSupabaseClient();

  const { data, error } = await client
    .rpc('get_user_stats', { p_wallet: walletAddress })
    .single();

  if (error || !data) {
    return {
      totalGenerations: 0,
      imagesGenerated: 0,
      memesGenerated: 0,
      threadsWritten: 0,
      firstActivity: null,
      lastActivity: null,
    };
  }

  const statsData = data as {
    total_generations?: number;
    images_generated?: number;
    memes_generated?: number;
    threads_written?: number;
    first_activity?: string;
    last_activity?: string;
  };

  return {
    totalGenerations: statsData.total_generations || 0,
    imagesGenerated: statsData.images_generated || 0,
    memesGenerated: statsData.memes_generated || 0,
    threadsWritten: statsData.threads_written || 0,
    firstActivity: statsData.first_activity || null,
    lastActivity: statsData.last_activity || null,
  };
}

// ============================================
// Admin client export for profit sharing
// ============================================

// Export admin client directly for simpler usage
export const supabaseAdmin = (() => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    // Return a dummy object in development if not configured
    console.warn('Supabase not configured - profit sharing disabled');
    return null as any;
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
})();

// ============================================
// Health Check
// ============================================

export async function checkDatabaseHealth(): Promise<{
  connected: boolean;
  latencyMs: number;
  error?: string;
}> {
  const start = Date.now();

  try {
    const client = getSupabaseClient();
    const { error } = await client.from('users').select('id').limit(1);

    return {
      connected: !error,
      latencyMs: Date.now() - start,
      error: error?.message,
    };
  } catch (err) {
    return {
      connected: false,
      latencyMs: Date.now() - start,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
