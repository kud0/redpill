import { NextRequest, NextResponse } from 'next/server';
import { hasAccess } from '@/lib/helius';
import { generateImage } from '@/lib/ai-providers';
import { checkRateLimitDb, logActivity, saveGeneratedContent, isUserBanned, getOrCreateUser } from '@/lib/supabase';
import { isValidSolanaAddress } from '@/lib/solana';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, prompt, model = 'flux-pro' } = body;

    if (!wallet || !isValidSolanaAddress(wallet)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
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
    const requiredTier = model === 'flux-pro' ? 'full' : 'basic';
    const access = await hasAccess(wallet, requiredTier);

    if (!access) {
      return NextResponse.json(
        {
          error: `Insufficient balance. ${
            model === 'flux-pro'
              ? 'Flux.1 Pro requires Full tier (2M $REDPILL)'
              : 'This feature requires Basic tier (500K $REDPILL)'
          }`,
        },
        { status: 403 }
      );
    }

    // Generate image
    const imageUrl = await generateImage(prompt, model);

    // Log activity and save content
    await Promise.all([
      logActivity({
        walletAddress: wallet,
        actionType: 'image_generation',
        actionDetails: { prompt, model },
        modelUsed: model,
        success: true,
      }),
      saveGeneratedContent({
        walletAddress: wallet,
        contentType: 'image',
        prompt,
        resultUrl: imageUrl,
        modelUsed: model,
        generationParams: { model },
      }),
    ]);

    return NextResponse.json({ imageUrl, remaining: rateLimit.remaining });
  } catch (error: any) {
    console.error('Image generation error:', error);

    // Log failed attempt
    const wallet = (await request.json().catch(() => ({})))?.wallet;
    if (wallet && isValidSolanaAddress(wallet)) {
      await logActivity({
        walletAddress: wallet,
        actionType: 'image_generation',
        success: false,
        errorMessage: error.message,
      }).catch(() => {});
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
