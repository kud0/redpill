import Together from 'together-ai';
import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';

// Initialize AI clients
const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generate an image using Together AI (Flux.1 Pro or SD3 Medium)
 */
export async function generateImage(
  prompt: string,
  model: 'flux-pro' | 'sd3-medium' = 'flux-pro',
  options: {
    width?: number;
    height?: number;
    steps?: number;
  } = {}
): Promise<string> {
  try {
    const modelName = model === 'flux-pro'
      ? 'black-forest-labs/FLUX.1-pro'
      : 'stabilityai/stable-diffusion-3-medium';

    const response = await together.images.create({
      model: modelName,
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
  } catch (error) {
    console.error('Error generating image:', error);
    throw new Error('Failed to generate image');
  }
}

/**
 * Generate a meme using Together AI image generation
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

  return generateImage(memePrompt, 'sd3-medium', { width: 800, height: 800 });
}

/**
 * Write a social media thread using Anthropic Claude
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

  const prompt = `Write a ${length}-post thread about: ${topic}

Platform: ${platform} (${platformGuidelines[platform]})
Tone: ${tone}

Requirements:
- Each post should be engaging and standalone
- Include relevant hashtags
- Natural flow between posts
- Hook in the first post
- Call-to-action in the last post

Return ONLY the thread posts, one per line, numbered.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    // Parse the numbered thread posts
    const posts = content.text
      .split('\n')
      .filter((line) => /^\d+\./.test(line.trim()))
      .map((line) => line.replace(/^\d+\.\s*/, '').trim());

    return posts;
  } catch (error) {
    console.error('Error writing thread:', error);
    throw new Error('Failed to write thread');
  }
}

/**
 * Generate text using Groq (ultra-fast inference)
 */
export async function generateText(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  try {
    const messages: Array<{ role: string; content: string }> = [];

    if (systemPrompt) {
      messages.push({
        role: 'system' as const,
        content: systemPrompt,
      });
    }

    messages.push({
      role: 'user' as const,
      content: prompt,
    });

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages as any,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating text:', error);
    throw new Error('Failed to generate text');
  }
}

/**
 * Clone voice (placeholder - integrate with actual TTS service)
 */
export async function cloneVoice(
  audioBase64: string,
  text: string
): Promise<string> {
  // This would integrate with services like ElevenLabs, PlayHT, etc.
  // For now, return a placeholder
  throw new Error('Voice cloning feature coming soon');
}

/**
 * Split audio stems (placeholder - integrate with actual audio separation service)
 */
export async function splitStems(
  audioBase64: string,
  format: 'wav' | 'mp3' = 'wav'
): Promise<{ vocals: string; instrumental: string; drums?: string; bass?: string }> {
  // This would integrate with services like Spleeter, Demucs, etc.
  // For now, return a placeholder
  throw new Error('Vocal removal feature coming soon');
}
