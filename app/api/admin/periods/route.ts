import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { createProfitPeriod, recordProfitData, calculateRewards } from '@/lib/profit-sharing';

// GET all profit periods
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('profit_periods')
      .select('*')
      .order('period_end', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching periods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch periods' },
      { status: 500 }
    );
  }
}

// POST create new period or update existing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'create': {
        const period = await createProfitPeriod(
          new Date(data.periodStart),
          new Date(data.periodEnd)
        );
        if (!period) throw new Error('Failed to create period');
        return NextResponse.json(period);
      }

      case 'record': {
        const period = await recordProfitData(
          data.periodId,
          data.revenue,
          data.costs
        );
        if (!period) throw new Error('Failed to record profit data');
        return NextResponse.json(period);
      }

      case 'calculate': {
        const claims = await calculateRewards(data.periodId);
        return NextResponse.json({ claims, count: claims.length });
      }

      case 'distribute': {
        const { error } = await supabaseAdmin
          .from('profit_periods')
          .update({
            status: 'distributed',
            distributed_at: new Date().toISOString(),
          })
          .eq('id', data.periodId);

        if (error) throw error;
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing period action:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
