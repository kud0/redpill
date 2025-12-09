import { NextRequest, NextResponse } from 'next/server';
import { hasAccess } from '@/lib/helius';
import { writeThread } from '@/lib/ai-providers';
import { checkRateLimitDb, logActivity, saveGeneratedContent, isUserBanned, getOrCreateUser } from '@/lib/supabase';
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

    // Ensure user exists in database
    await getOrCreateUser(wallet);

    // Check if user is banned
    const banned = await isUserBanned(wallet);
    if (banned) {
      return NextResponse.json(
        { error: 'Your account has been suspended' },
        { status: 403 }
      );
    }

    // Check rate limit (using database)
    const rateLimit = await checkRateLimitDb(wallet);
    if (!rateLimit.allowed) {
      const resetIn = Math.ceil((rateLimit.resetAt - Date.now()) / 60000);
      return NextResponse.json(
        { error: `Rate limit exceeded. Try again in ${resetIn} minutes.`, remaining: 0, resetAt: rateLimit.resetAt },
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

    // Log activity and save content
    await Promise.all([
      logActivity({
        walletAddress: wallet,
        actionType: 'thread_writing',
        actionDetails: { topic, platform, tone, length, postCount: thread.length },
        success: true,
      }),
      saveGeneratedContent({
        walletAddress: wallet,
        contentType: 'thread',
        prompt: topic,
        resultData: { thread, platform },
        generationParams: { platform, tone, length },
      }),
    ]);

    return NextResponse.json({ thread, remaining: rateLimit.remaining });
  } catch (error: any) {
    console.error('Thread writing error:', error);

    // Log failed attempt
    const wallet = (await request.json().catch(() => ({})))?.wallet;
    if (wallet && isValidSolanaAddress(wallet)) {
      await logActivity({
        walletAddress: wallet,
        actionType: 'thread_writing',
        success: false,
        errorMessage: error.message,
      }).catch(() => {});
    }

    return NextResponse.json(
      { error: error.message || 'Failed to write thread' },
      { status: 500 }
    );
  }
}
