import { NextRequest, NextResponse } from 'next/server';
import { checkTokenBalance, getTierInfo } from '@/lib/helius';
import { isValidSolanaAddress } from '@/lib/solana';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet } = body;

    if (!wallet || !isValidSolanaAddress(wallet)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    const balance = await checkTokenBalance(wallet);
    const tierInfo = getTierInfo(balance);

    return NextResponse.json(tierInfo);
  } catch (error: any) {
    console.error('Balance check error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check balance' },
      { status: 500 }
    );
  }
}
