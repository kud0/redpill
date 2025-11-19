import { NextRequest, NextResponse } from 'next/server';
import { hasAccess } from '@/lib/helius';
import { writeThread } from '@/lib/ai-providers';
import { checkRateLimit } from '@/lib/rate-limit';
import { isValidSolanaAddress } from '@/lib/solana';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, topic, platform, tone, length } = body;

    if (!wallet || !isValidSolanaAddress(wallet)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    if (!topic?.trim()) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Check rate limit
    const rateLimit = checkRateLimit(wallet);
    if (!rateLimit.allowed) {
      const resetIn = Math.ceil((rateLimit.resetAt - Date.now()) / 60000);
      return NextResponse.json(
        { error: `Rate limit exceeded. Try again in ${resetIn} minutes.` },
        { status: 429 }
      );
    }

    // Check tier access
    const access = await hasAccess(wallet, 'basic');
    if (!access) {
      return NextResponse.json(
        { error: 'Insufficient balance. This feature requires Basic tier (500K $REDPILL)' },
        { status: 403 }
      );
    }

    // Write thread
    const thread = await writeThread(topic, platform, { tone, length });

    return NextResponse.json({ thread });
  } catch (error: any) {
    console.error('Thread writing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to write thread' },
      { status: 500 }
    );
  }
}
