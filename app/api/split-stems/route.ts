import { NextRequest, NextResponse } from 'next/server';
import { hasAccess } from '@/lib/helius';
import { splitStems } from '@/lib/ai-providers';
import { checkRateLimitDb, logActivity, saveGeneratedContent, isUserBanned, getOrCreateUser } from '@/lib/supabase';
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
        { error: 'Audio file is required (MP3 or WAV)' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB for audio files)
    if (audioFile.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Audio file too large. Maximum size is 50MB.' },
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

    // Check tier access (requires Full tier)
    const access = await hasAccess(wallet, 'full');
    if (!access) {
      return NextResponse.json(
        { error: 'Insufficient balance. Vocal removal requires Full tier (2M $REDPILL)' },
        { status: 403 }
      );
    }

    // Convert audio file to base64
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(arrayBuffer).toString('base64');

    // Split stems using Demucs
    const stems = await splitStems(audioBase64, format);

    // Log activity and save content
    await Promise.all([
      logActivity({
        walletAddress: wallet,
        actionType: 'vocal_removal',
        actionDetails: { audioFileSize: audioFile.size, format },
        modelUsed: 'demucs-v4',
        success: true,
      }),
      saveGeneratedContent({
        walletAddress: wallet,
        contentType: 'vocal_stems',
        prompt: `Stem separation: ${audioFile.name}`,
        resultData: {
          hasVocals: !!stems.vocals,
          hasInstrumental: !!stems.instrumental,
          hasDrums: !!stems.drums,
          hasBass: !!stems.bass,
        },
        modelUsed: 'demucs-v4',
        generationParams: { format, originalSize: audioFile.size },
      }),
    ]);

    return NextResponse.json({
      stems: {
        vocals: stems.vocals,
        instrumental: stems.instrumental,
        drums: stems.drums,
        bass: stems.bass,
      },
      remaining: rateLimit.remaining,
    });
  } catch (error: any) {
    // Log failed attempt
    try {
      const formData = await request.formData().catch(() => null);
      const wallet = formData?.get('wallet') as string;
      if (wallet && isValidSolanaAddress(wallet)) {
        await logActivity({
          walletAddress: wallet,
          actionType: 'vocal_removal',
          success: false,
          errorMessage: error.message,
        });
      }
    } catch {}

    return NextResponse.json(
      { error: error.message || 'Failed to split stems' },
      { status: 500 }
    );
  }
}
