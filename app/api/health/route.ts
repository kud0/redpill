import { NextResponse } from 'next/server';
import { checkDatabaseHealth, getApiUsageStats } from '@/lib/supabase';

export async function GET() {
  const startTime = Date.now();

  try {
    // Check database connectivity
    const dbHealth = await checkDatabaseHealth();

    // Get today's API usage stats
    const today = new Date().toISOString().split('T')[0];
    const apiStats = await getApiUsageStats(today, today);

    const health = {
      status: dbHealth.connected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      checks: {
        database: {
          status: dbHealth.connected ? 'ok' : 'error',
          latencyMs: dbHealth.latencyMs,
          error: dbHealth.error,
        },
        environment: {
          nodeEnv: process.env.NODE_ENV || 'development',
          supabaseConfigured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
          heliusConfigured: !!process.env.HELIUS_API_KEY,
        },
      },
      stats: {
        todayApiCalls: apiStats.reduce((sum, s) => sum + s.total_requests, 0),
        todayCostUsd: apiStats.reduce((sum, s) => sum + s.total_cost, 0).toFixed(4),
      },
      responseTimeMs: Date.now() - startTime,
    };

    return NextResponse.json(health, {
      status: dbHealth.connected ? 200 : 503,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        responseTimeMs: Date.now() - startTime,
      },
      { status: 503 }
    );
  }
}
