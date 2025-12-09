import Together from 'together-ai';
import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';
import OpenAI from 'openai';
import { fal } from '@fal-ai/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy initialization of AI clients
let together: Together | null = null;
let anthropic: Anthropic | null = null;
let groq: Groq | null = null;
let grok: OpenAI | null = null;
let gemini: GoogleGenerativeAI | null = null;

function getTogether() {
  if (!together) {
    together = new Together({
      apiKey: process.env.TOGETHER_API_KEY,
    });
  }
  return together;
}

function getAnthropic() {
  if (!anthropic) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropic;
}

function getGroq() {
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
}

function getGrok() {
  if (!grok) {
    grok = new OpenAI({
      apiKey: process.env.XAI_API_KEY,
      baseURL: 'https://api.x.ai/v1',
    });
  }
  return grok;
}

function getGemini() {
  if (!gemini) {
    gemini = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
  }
  return gemini;
}

function initFal() {
  if (process.env.FAL_KEY) {
    fal.config({
      credentials: process.env.FAL_KEY,
    });
  }
}

/**
 * Generate an image using multiple providers
 *
 * Models:
 * - flux-pro: FLUX.1 Pro via Together.ai ($0.055/image, ultra-high quality)
 * - nano-banana: Gemini 2.5 Flash via Fal.ai ($0.039/image, state-of-the-art editing)
 * - nano-banana-pro: Gemini 3 Pro via Fal.ai ($0.139/image 2K, $0.24/image 4K, studio quality)
 * - nano-banana-gemini: Gemini 2.5 Flash via Google AI ($0.039/image, native API)
 * - sd3-medium: Stable Diffusion 3 Medium via Together.ai (lower cost alternative)
 */
export async function generateImage(
  prompt: string,
  model: 'flux-pro' | 'nano-banana' | 'nano-banana-pro' | 'nano-banana-gemini' | 'sd3-medium' = 'nano-banana',
  options: {
    width?: number;
    height?: number;
    steps?: number;
    imageSize?: 'square' | 'square_hd' | 'portrait_4_3' | 'portrait_16_9' | 'landscape_4_3' | 'landscape_16_9';
  } = {}
): Promise<string> {
  try {
    // Nano Banana via Fal.ai (PRIMARY - Best value and quality)
    if (model === 'nano-banana' && process.env.FAL_KEY) {
      initFal();
      const result = await fal.subscribe('fal-ai/nano-banana', {
        input: {
          prompt,
        } as any,
      });
      return (result.data as any).images[0].url;
    }

    // Nano Banana Pro via Fal.ai (HIGH QUALITY - 2K/4K)
    if (model === 'nano-banana-pro' && process.env.FAL_KEY) {
      initFal();
      const result = await fal.subscribe('fal-ai/nano-banana-pro', {
        input: {
          prompt,
        } as any,
      });
      return (result.data as any).images[0].url;
    }

    // Nano Banana via Google Gemini API (ALTERNATIVE)
    if (model === 'nano-banana-gemini' && process.env.GOOGLE_AI_API_KEY) {
      const genAI = getGemini();
      const imageModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image' });

      const result = await imageModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'image/png',
        },
      });

      const response = result.response;
      const imageData = response.candidates?.[0]?.content?.parts?.[0];
      if (!imageData) {
        throw new Error('No image data in Gemini response');
      }

      // Return base64 data URL (Gemini returns inline data)
      return `data:image/png;base64,${(imageData as any).inlineData?.data || ''}`;
    }

    // FLUX.1 Pro via Together.ai (ULTRA HIGH QUALITY)
    if (model === 'flux-pro' && process.env.TOGETHER_API_KEY) {
      const response = await getTogether().images.create({
        model: 'black-forest-labs/FLUX.1-pro',
        prompt,
        width: options.width || 1024,
        height: options.height || 1024,
        steps: options.steps || 20,
        n: 1,
      });

      if (!response.data?.[0]) {
        throw new Error('No image URL in response');
      }

      return (response.data[0] as any).url || (response.data[0] as any).b64_json;
    }

    // Stable Diffusion 3 Medium via Together.ai (BUDGET OPTION)
    if (model === 'sd3-medium' && process.env.TOGETHER_API_KEY) {
      const response = await getTogether().images.create({
        model: 'stabilityai/stable-diffusion-3-medium',
        prompt,
        width: options.width || 1024,
        height: options.height || 1024,
        steps: options.steps || 20,
        n: 1,
      });

      if (!response.data?.[0]) {
        throw new Error('No image URL in response');
      }

      return (response.data[0] as any).url || (response.data[0] as any).b64_json;
    }

    // Fallback: Try Nano Banana on Fal.ai if no specific model API key is available
    if (process.env.FAL_KEY) {
      initFal();
      const result = await fal.subscribe('fal-ai/nano-banana', {
        input: {
          prompt,
        } as any,
      });
      return (result.data as any).images[0].url;
    }

    throw new Error('No image generation API keys configured. Add FAL_KEY, GOOGLE_AI_API_KEY, or TOGETHER_API_KEY to .env.local');
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image');
  }
}

/**
 * Generate a meme using Nano Banana (best for text rendering)
 */
export async function generateMeme(
  template: string,
  topText?: string,
  bottomText?: string
): Promise<string> {
  const memePrompt = `Create a meme image with the following:
Template style: ${template}
${topText ? `Top text: "${topText}"` : ''}
${bottomText ? `Bottom text: "${bottomText}"` : ''}
Make it funny and relevant. High quality, clear text, classic meme format.`;

  // Nano Banana excels at text rendering compared to other models
  return generateImage(memePrompt, 'nano-banana', { imageSize: 'square' });
}

/**
 * Write a social media thread using X.ai Grok (PRIMARY)
 * Falls back to Groq then Claude if Grok fails
 */
export async function writeThread(
  topic: string,
  platform: 'x' | 'warpcast' | 'lens',
  options: {
    length?: number;
    tone?: 'professional' | 'casual' | 'humorous';
  } = {}
): Promise<string[]> {
  const length = options.length || 5;
  const tone = options.tone || 'casual';

  const platformGuidelines = {
    x: 'Twitter/X format (280 chars per tweet)',
    warpcast: 'Farcaster/Warpcast format (320 chars per cast)',
    lens: 'Lens Protocol format (500 chars per post)',
  };

  const systemPrompt = `You are an expert social media thread writer. Create engaging, viral-worthy threads that hook readers and drive engagement.`;

  const userPrompt = `Write a ${length}-post thread about: ${topic}

Platform: ${platform} (${platformGuidelines[platform]})
Tone: ${tone}

Requirements:
- Each post should be engaging and standalone
- Include relevant hashtags
- Natural flow between posts
- Hook in the first post
- Call-to-action in the last post

Return ONLY the thread posts, one per line, numbered.`;

  // Try Grok first (PRIMARY)
  if (process.env.XAI_API_KEY) {
    try {
      console.log('🤖 Attempting Grok API call...');
      const completion = await getGrok().chat.completions.create({
        model: 'grok-4-1-fast-non-reasoning',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const text = completion.choices[0]?.message?.content;
      console.log('✅ Grok response received:', text ? 'Success' : 'Empty');
      console.log('📝 Grok response preview:', text?.substring(0, 200));

      if (text) {
        // Handle both "1." and "1/5" formats
        const posts = text
          .split('\n')
          .filter((line) => /^\d+[\.\/]/.test(line.trim()))
          .map((line) => line.replace(/^\d+[\.\/]\d*\s*/, '').trim());

        console.log(`📊 Parsed ${posts.length} posts from Grok response`);
        if (posts.length > 0) {
          console.log(`✅ Grok generated ${posts.length} posts`);
          return posts;
        } else {
          console.warn('⚠️ Grok returned text but no numbered posts found');
        }
      }
    } catch (error: any) {
      console.error('❌ Grok API error details:', {
        message: error.message,
        status: error.status,
        code: error.code,
        type: error.type,
        response: error.response?.data
      });
      console.warn('⚠️ Grok failed, falling back to Groq');
    }
  }

  // Fallback to Groq (SECONDARY)
  if (process.env.GROQ_API_KEY) {
    try {
      console.log('🤖 Attempting Groq API call...');
      const response = await getGroq().chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const text = response.choices[0]?.message?.content;
      console.log('✅ Groq response received:', text ? 'Success' : 'Empty');

      if (text) {
        // Handle both "1." and "1/5" formats
        const posts = text
          .split('\n')
          .filter((line) => /^\d+[\.\/]/.test(line.trim()))
          .map((line) => line.replace(/^\d+[\.\/]\d*\s*/, '').trim());

        if (posts.length > 0) {
          console.log(`✅ Groq generated ${posts.length} posts`);
          return posts;
        }
      }
    } catch (error: any) {
      console.error('❌ Groq API error details:', {
        message: error.message,
        status: error.status,
        code: error.code
      });
      console.warn('⚠️ Groq failed, falling back to Gemini');
    }
  }

  // Fallback to Google Gemini (TERTIARY)
  if (process.env.GOOGLE_AI_API_KEY) {
    try {
      console.log('🤖 Attempting Gemini API call...');
      const genAI = getGemini();
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      });

      const text = result.response.text();
      console.log('✅ Gemini response received:', text ? 'Success' : 'Empty');

      if (text) {
        // Handle both "1." and "1/5" formats
        const posts = text
          .split('\n')
          .filter((line) => /^\d+[\.\/]/.test(line.trim()))
          .map((line) => line.replace(/^\d+[\.\/]\d*\s*/, '').trim());

        if (posts.length > 0) {
          console.log(`✅ Gemini generated ${posts.length} posts`);
          return posts;
        }
      }
    } catch (error: any) {
      console.error('❌ Gemini API error details:', {
        message: error.message,
        status: error.status,
        code: error.code
      });
      console.warn('⚠️ Gemini failed, falling back to Claude');
    }
  }

  // Final fallback to Claude (QUATERNARY)
  try {
    const message = await getAnthropic().messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `${systemPrompt}\n\n${userPrompt}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Parse the numbered thread posts - handle both "1." and "1/5" formats
    const posts = content.text
      .split('\n')
      .filter((line) => /^\d+[\.\/]/.test(line.trim()))
      .map((line) => line.replace(/^\d+[\.\/]\d*\s*/, '').trim());

    return posts;
  } catch (error) {
    console.error('All LLM providers failed:', error);
    throw new Error('Failed to write thread');
  }
}

/**
 * Generate text using X.ai Grok (PRIMARY)
 * Falls back to Groq if Grok fails
 */
export async function generateText(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const messages: Array<{ role: 'system' | 'user'; content: string }> = [];

  if (systemPrompt) {
    messages.push({
      role: 'system',
      content: systemPrompt,
    });
  }

  messages.push({
    role: 'user',
    content: prompt,
  });

  // Try Grok first (PRIMARY)
  if (process.env.XAI_API_KEY) {
    try {
      console.log('🤖 Attempting Grok API call for text generation...');
      const completion = await getGrok().chat.completions.create({
        model: 'grok-4-1-fast-non-reasoning',
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        console.log('✅ Grok text generation success');
        return content;
      }
    } catch (error: any) {
      console.error('❌ Grok API error:', {
        message: error.message,
        status: error.status,
        code: error.code
      });
      console.warn('⚠️ Grok failed, falling back to Groq');
    }
  }

  // Fallback to Groq (SECONDARY)
  try {
    const response = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('All text generation providers failed:', error);
    throw new Error('Failed to generate text');
  }
}

/**
 * Clone voice using ElevenLabs Instant Voice Cloning
 *
 * Creates a cloned voice from audio sample and generates speech
 * Cost: ~$0.30 per 1000 characters (Creator tier)
 */
export async function cloneVoice(
  audioBase64: string,
  text: string
): Promise<string> {
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key not configured');
  }

  try {
    // Step 1: Create instant voice clone from audio sample
    const audioBuffer = Buffer.from(audioBase64, 'base64');
    const formData = new FormData();
    formData.append('name', `clone_${Date.now()}`);
    formData.append('files', new Blob([audioBuffer], { type: 'audio/mpeg' }), 'sample.mp3');
    formData.append('description', 'Voice cloned via RedPill AI');

    const addVoiceResponse = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: formData,
    });

    if (!addVoiceResponse.ok) {
      const errorText = await addVoiceResponse.text();
      throw new Error(`Failed to create voice clone: ${errorText}`);
    }

    const voiceData = await addVoiceResponse.json();
    const voiceId = voiceData.voice_id;

    // Step 2: Generate speech with cloned voice
    const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    });

    if (!ttsResponse.ok) {
      // Clean up: delete the cloned voice
      await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, {
        method: 'DELETE',
        headers: { 'xi-api-key': ELEVENLABS_API_KEY },
      }).catch(() => {});

      const errorText = await ttsResponse.text();
      throw new Error(`Failed to generate speech: ${errorText}`);
    }

    // Get audio as base64
    const audioArrayBuffer = await ttsResponse.arrayBuffer();
    const generatedAudioBase64 = Buffer.from(audioArrayBuffer).toString('base64');

    // Step 3: Clean up - delete the cloned voice to avoid storage costs
    await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, {
      method: 'DELETE',
      headers: { 'xi-api-key': ELEVENLABS_API_KEY },
    }).catch(() => {}); // Ignore cleanup errors

    return `data:audio/mpeg;base64,${generatedAudioBase64}`;
  } catch (error) {
    console.error('ElevenLabs voice cloning error:', error);
    throw error;
  }
}

/**
 * Split audio into stems using Replicate's Demucs model
 *
 * Separates audio into: vocals, drums, bass, other (instrumental)
 * Cost: ~$0.0023/sec on Replicate
 */
export async function splitStems(
  audioBase64: string,
  _format: 'wav' | 'mp3' = 'wav'
): Promise<{ vocals: string; instrumental: string; drums?: string; bass?: string }> {
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

  if (!REPLICATE_API_TOKEN) {
    throw new Error('Replicate API token not configured');
  }

  try {
    // Use Replicate's Demucs model for audio separation
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'cdfec2d54cdcc53a5664f9fe0f4ae1d8e1bc65b9e63ee3ecb11a5e56f97c3f61', // Demucs v4
        input: {
          audio: `data:audio/mpeg;base64,${audioBase64}`,
          stems: 'all', // Get all stems: vocals, drums, bass, other
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to start stem separation: ${errorText}`);
    }

    const prediction = await response.json();
    const predictionId = prediction.id;

    // Poll for completion (max 5 minutes for long audio files)
    const maxAttempts = 60;
    let attempts = 0;
    let result: any = null;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds

      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          'Authorization': `Token ${REPLICATE_API_TOKEN}`,
        },
      });

      if (!statusResponse.ok) {
        throw new Error('Failed to check prediction status');
      }

      result = await statusResponse.json();

      if (result.status === 'succeeded') {
        break;
      } else if (result.status === 'failed') {
        throw new Error(result.error || 'Stem separation failed');
      }

      attempts++;
    }

    if (!result || result.status !== 'succeeded') {
      throw new Error('Stem separation timed out');
    }

    // Return the stem URLs
    return {
      vocals: result.output?.vocals || null,
      instrumental: result.output?.other || null, // "other" contains non-vocal elements
      drums: result.output?.drums || null,
      bass: result.output?.bass || null,
    };
  } catch (error) {
    console.error('Replicate Demucs error:', error);
    throw error;
  }
}
