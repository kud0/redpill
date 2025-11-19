import { NextRequest, NextResponse } from 'next/server';
import { hasAccess } from '@/lib/helius';
import { checkRateLimit } from '@/lib/rate-limit';
import { isValidSolanaAddress } from '@/lib/solana';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const wallet = formData.get('wallet') as string;
    const audioFile = formData.get('audio') as File;
    const format = (formData.get('format') as 'wav' | 'mp3') || 'wav';

    if (!wallet || !isValidSolanaAddress(wallet)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
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
    const access = await hasAccess(wallet, 'full');
    if (!access) {
      return NextResponse.json(
        { error: 'Insufficient balance. This feature requires Full tier (2M $REDPILL)' },
        { status: 403 }
      );
    }

    // Convert audio file to base64
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(arrayBuffer).toString('base64');

    // This would integrate with services like Spleeter, Demucs, etc.
    // For now, return a placeholder response
    return NextResponse.json(
      {
        message: 'Vocal removal feature coming soon',
        stems: {
          vocals: null,
          instrumental: null,
          drums: null,
          bass: null,
        },
      },
      { status: 501 }
    );
  } catch (error: any) {
    console.error('Stem splitting error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to split stems' },
      { status: 500 }
    );
  }
}
