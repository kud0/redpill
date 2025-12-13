import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('stakes')
      .select('*')
      .order('amount', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching stakes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stakes' },
      { status: 500 }
    );
  }
}
