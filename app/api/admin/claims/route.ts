import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { markClaimAsClaimed } from '@/lib/profit-sharing';

// GET all claims
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodId = searchParams.get('periodId');
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('reward_claims')
      .select('*')
      .order('created_at', { ascending: false });

    if (periodId) query = query.eq('profit_period_id', periodId);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json(
      { error: 'Failed to fetch claims' },
      { status: 500 }
    );
  }
}

// POST mark claim as claimed
export async function POST(request: NextRequest) {
  try {
    const { claimId, txSignature } = await request.json();

    if (!claimId || !txSignature) {
      return NextResponse.json(
        { error: 'Missing claimId or txSignature' },
        { status: 400 }
      );
    }

    const success = await markClaimAsClaimed(claimId, txSignature);

    if (!success) throw new Error('Failed to mark claim as claimed');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking claim:', error);
    return NextResponse.json(
      { error: 'Failed to mark claim' },
      { status: 500 }
    );
  }
}
