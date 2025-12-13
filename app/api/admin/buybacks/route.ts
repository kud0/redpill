import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { recordBuyback } from '@/lib/profit-sharing';

// GET all buybacks
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('buybacks')
      .select('*')
      .order('executed_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching buybacks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch buybacks' },
      { status: 500 }
    );
  }
}

// POST record new buyback
export async function POST(request: NextRequest) {
  try {
    const { periodId, amountSol, tokensBought, tokensBurned, txSignature } = await request.json();

    if (!periodId || !amountSol || !tokensBought || !tokensBurned || !txSignature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const success = await recordBuyback(periodId, amountSol, tokensBought, tokensBurned, txSignature);

    if (!success) throw new Error('Failed to record buyback');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording buyback:', error);
    return NextResponse.json(
      { error: 'Failed to record buyback' },
      { status: 500 }
    );
  }
}
