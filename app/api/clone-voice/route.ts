import { NextRequest, NextResponse } from 'next/server';
import { hasAccess } from '@/lib/helius';
import { cloneVoice } from '@/lib/ai-providers';
import { checkRateLimitDb, logActivity, saveGeneratedContent, isUserBanned, getOrCreateUser } from '@/lib/supabase';
import { isValidSolanaAddress } from '@/lib/solana';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const wallet = formData.get('wallet') as string;
    const audioFile = formData.get('audio') as File;
    const text = formData.get('text') as string;

    if (!wallet || !isValidSolanaAddress(wallet)) {
      return NextResponse.json(
        { error: 'Invalid wallet address' },
        { status: 400 }
      );
    }

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required (MP3 or WAV, max 10MB)' },
        { status: 400 }
      );
    }

    if (!text?.trim()) {
      return NextResponse.json(
        { error: 'Text to speak is required' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (audioFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Audio file too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Validate text length (max 5000 characters for cost control)
    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Text too long. Maximum 5000 characters.' },
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
        { error: 'Insufficient balance. Voice cloning requires Full tier (2M $REDPILL)' },
        { status: 403 }
      );
    }

    // Convert audio file to base64
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(arrayBuffer).toString('base64');

    // Clone voice and generate speech
    const generatedAudioUrl = await cloneVoice(audioBase64, text);

    // Log activity and save content
    await Promise.all([
      logActivity({
        walletAddress: wallet,
        actionType: 'voice_cloning',
        actionDetails: { textLength: text.length, audioFileSize: audioFile.size },
        modelUsed: 'elevenlabs-v2',
        success: true,
      }),
      saveGeneratedContent({
        walletAddress: wallet,
        contentType: 'voice_clone',
        prompt: text.substring(0, 500), // Store first 500 chars
        resultUrl: generatedAudioUrl.substring(0, 100) + '...', // Don't store full base64
        modelUsed: 'elevenlabs-v2',
        generationParams: { textLength: text.length },
      }),
    ]);

    return NextResponse.json({
      audioUrl: generatedAudioUrl,
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
          actionType: 'voice_cloning',
          success: false,
          errorMessage: error.message,
        });
      }
    } catch {}

    return NextResponse.json(
      { error: error.message || 'Failed to clone voice' },
      { status: 500 }
    );
  }
}
