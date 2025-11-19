import { NextRequest, NextResponse } from 'next/server';
import { hasAccess } from '@/lib/helius';
import { generateImage } from '@/lib/ai-providers';
import { checkRateLimit } from '@/lib/rate-limit';
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

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
}
