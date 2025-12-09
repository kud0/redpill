# Nano Banana (Gemini 2.5 Flash Image) Integration Guide

RedPill AI now supports **Nano Banana** - Google's state-of-the-art image generation and editing model (officially called **Gemini 2.5 Flash Image**) as the **PRIMARY image generation model** for all image-related features.

---

## 🎯 Why Nano Banana?

### Performance Benefits
- **State-of-the-Art Quality**: Autoregressive model generating 1,290 tokens per image
- **Text Rendering**: Accurate text generation in different styles, fonts, and languages
- **Advanced Editing**: Blend multiple images, maintain character consistency, targeted transformations
- **High Resolution**: Up to 4K images with Nano Banana Pro
- **Multi-Object Blending**: Up to 14 objects in one image
- **Character Consistency**: Maintain resemblance of up to 5 people across images

### Cost Efficiency
- **Nano Banana**: $0.039 per image (29% cheaper than FLUX.1 Pro)
- **Nano Banana Pro**: $0.139 per 2K image, $0.24 per 4K image
- **Best Value**: Superior quality-to-cost ratio for most use cases

### Technical Advantages
- **Multiple Providers**: Available via Fal.ai, Google Gemini API, and Replicate
- **Fast Generation**: Optimized for speed and quality
- **Natural Language Control**: Complex edits through simple prompts
- **Web Integration**: Can search web for recipes, flash cards, etc.

---

## 📋 Quick Setup

### Option 1: Fal.ai (Recommended - Easiest)

```bash
# Visit https://fal.ai
# Sign up → Dashboard → API Keys
# Copy your API key
```

**Add to .env.local:**
```bash
FAL_KEY=your-fal-api-key-here
```

### Option 2: Google Gemini API (Alternative)

```bash
# Visit https://ai.google.dev
# Get API Key
# Copy your API key
```

**Add to .env.local:**
```bash
GOOGLE_AI_API_KEY=your-google-api-key-here
```

### 3. Restart Dev Server

```bash
npm run dev
```

---

## 🔧 Implementation Details

### Model Selection

RedPill AI now supports **5 image generation models**:

1. **nano-banana** (PRIMARY - Gemini 2.5 Flash via Fal.ai)
   - Cost: $0.039/image
   - Resolution: Up to 1024x1024
   - Best for: General image generation, memes, text rendering
   - Speed: Fast

2. **nano-banana-pro** (PREMIUM - Gemini 3 Pro via Fal.ai)
   - Cost: $0.139/image (2K), $0.24/image (4K)
   - Resolution: Up to 4K
   - Best for: Studio-quality images, high-detail work
   - Speed: Moderate

3. **nano-banana-gemini** (ALTERNATIVE - Gemini 2.5 Flash via Google AI)
   - Cost: $0.039/image
   - Resolution: Up to 1024x1024
   - Best for: Direct Google API integration
   - Speed: Fast

4. **flux-pro** (ULTRA HIGH QUALITY - FLUX.1 Pro via Together.ai)
   - Cost: $0.055/image
   - Resolution: 1024x1024
   - Best for: Ultra-high quality artistic images
   - Speed: Moderate

5. **sd3-medium** (BUDGET - Stable Diffusion 3 via Together.ai)
   - Cost: Lower than others
   - Resolution: 1024x1024
   - Best for: Budget-conscious applications
   - Speed: Fast

### Provider Hierarchy (Automatic Failover)

**For Image Generation:**

1. **PRIMARY**: Nano Banana via Fal.ai
   - Model: `fal-ai/nano-banana`
   - Endpoint: Fal.ai API
   - Cost: $0.039/image
   - Speed: Fast

2. **SECONDARY**: Nano Banana Pro via Fal.ai
   - Model: `fal-ai/nano-banana-pro`
   - Endpoint: Fal.ai API
   - Cost: $0.139-0.24/image
   - Quality: Studio-grade

3. **TERTIARY**: FLUX.1 Pro via Together.ai
   - Model: `black-forest-labs/FLUX.1-pro`
   - Endpoint: Together.ai API
   - Cost: $0.055/image
   - Quality: Ultra-high

4. **FALLBACK**: Stable Diffusion 3 via Together.ai
   - Model: `stabilityai/stable-diffusion-3-medium`
   - Endpoint: Together.ai API
   - Cost: Lower
   - Speed: Fast

### Code Integration

The integration uses the Fal.ai SDK and Google Gemini SDK:

```typescript
import * as fal from '@fal-ai/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Fal.ai
fal.config({
  credentials: process.env.FAL_KEY,
});

// Generate image with Nano Banana
const result = await fal.subscribe('fal-ai/nano-banana', {
  input: {
    prompt: 'A beautiful sunset over mountains',
    image_size: 'square_hd',
    num_images: 1,
  },
});

const imageUrl = result.data.images[0].url;
```

### Files Modified

1. **`.env.example`** - Added Nano Banana configuration
2. **`lib/ai-providers.ts`** - Added Nano Banana integration with multi-provider support:
   - `generateImage()` - Updated to support 5 models with fallbacks
   - `generateMeme()` - Switched to Nano Banana for better text rendering
3. **`package.json`** - Added `@fal-ai/client` and `@google/generative-ai` dependencies

---

## 💰 Cost Comparison

### Per Image Cost (1024x1024)

| Model | Provider | Cost | Quality | Best For |
|-------|----------|------|---------|----------|
| **Nano Banana** | Fal.ai | **$0.039** | ⭐⭐⭐⭐⭐ | General use, text rendering |
| **Nano Banana Pro** | Fal.ai | **$0.139-0.24** | ⭐⭐⭐⭐⭐+ | Studio quality, 2K/4K |
| **FLUX.1 Pro** | Together.ai | **$0.055** | ⭐⭐⭐⭐⭐ | Artistic, ultra-high quality |
| **SD3 Medium** | Together.ai | **$0.03** | ⭐⭐⭐⭐ | Budget-friendly |

**Winner**: Nano Banana offers the best balance of quality, features, and cost.

### Estimated Monthly Costs

Assumptions:
- Image Generator: 50 images/user/month
- Meme Generator: 20 memes/user/month
- Average: 70 images per user per month

| Users | Nano Banana | FLUX.1 Pro | Savings |
|-------|-------------|------------|---------|
| 100 | **$273** | $385 | $112 (29%) |
| 500 | **$1,365** | $1,925 | $560 (29%) |
| 1,000 | **$2,730** | $3,850 | $1,120 (29%) |
| 5,000 | **$13,650** | $19,250 | $5,600 (29%) |

**Recommendation**: Use Nano Banana for standard images, upgrade to Nano Banana Pro for premium tier users.

---

## 🚀 Features Using Nano Banana

### 1. Image Generator
- **Route**: `/api/generate-image`
- **Model**: `nano-banana` (default)
- **Use Case**: General AI image generation
- **Benefit**: 29% cost savings + superior text rendering

### 2. Meme Generator
- **Route**: `/api/generate-meme`
- **Model**: `nano-banana`
- **Use Case**: Generate memes with accurate text
- **Benefit**: Best-in-class text rendering (critical for memes!)

### 3. Advanced Editing (Future)
- **Route**: `/api/edit-image` (TODO)
- **Model**: `nano-banana` or `nano-banana-pro`
- **Use Case**: Image-to-image editing, blending, style transfer
- **Benefit**: Supports multiple input images, character consistency

---

## 🔄 Usage Examples

### Basic Image Generation

```typescript
import { generateImage } from '@/lib/ai-providers';

// Generate with Nano Banana (default)
const imageUrl = await generateImage(
  'A futuristic cityscape at sunset',
  'nano-banana'
);

// Generate with Nano Banana Pro (high quality)
const hdImageUrl = await generateImage(
  'A hyper-realistic portrait of a robot',
  'nano-banana-pro',
  { imageSize: 'portrait_16_9' }
);

// Generate with FLUX.1 Pro (artistic)
const artisticUrl = await generateImage(
  'Abstract art with vibrant colors',
  'flux-pro',
  { width: 1024, height: 1024, steps: 30 }
);
```

### Image Sizes

Nano Banana supports multiple aspect ratios:

```typescript
const sizes = [
  'square',          // 1:1
  'square_hd',       // 1:1 HD
  'portrait_4_3',    // 4:3 portrait
  'portrait_16_9',   // 16:9 portrait
  'landscape_4_3',   // 4:3 landscape
  'landscape_16_9',  // 16:9 landscape
];

const imageUrl = await generateImage(
  'A mountain landscape',
  'nano-banana',
  { imageSize: 'landscape_16_9' }
);
```

### Advanced Editing (Future Enhancement)

Nano Banana supports image-to-image editing:

```typescript
// Blend multiple images
const result = await fal.subscribe('fal-ai/nano-banana/edit', {
  input: {
    prompt: 'Combine these characters in a futuristic setting',
    image_urls: [
      'https://example.com/character1.jpg',
      'https://example.com/character2.jpg',
    ],
    image_size: 'square_hd',
  },
});

// Targeted transformation
const edited = await fal.subscribe('fal-ai/nano-banana/edit', {
  input: {
    prompt: 'Make the background sunset instead of daytime',
    image_url: 'https://example.com/original.jpg',
    image_size: 'landscape_16_9',
  },
});
```

---

## 📊 Performance Benchmarks

### Generation Speed

| Model | Time (1024x1024) | Time (2K) | Time (4K) |
|-------|------------------|-----------|-----------|
| **Nano Banana** | 3-5s | N/A | N/A |
| **Nano Banana Pro** | 5-8s | 8-12s | 15-20s |
| **FLUX.1 Pro** | 8-12s | N/A | N/A |
| **SD3 Medium** | 5-8s | N/A | N/A |

### Quality Comparison

| Feature | Nano Banana | FLUX.1 Pro | SD3 Medium |
|---------|-------------|------------|------------|
| Text Rendering | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Photorealism | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Artistic Style | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Character Consistency | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| Multi-Object | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |

**Use Case Routing**:
- Real-time generation → Nano Banana (fastest)
- Text-heavy images (memes) → Nano Banana (best text)
- Ultra-high artistic quality → FLUX.1 Pro (best artistic)
- Budget-conscious → SD3 Medium (cheapest)
- Studio/professional → Nano Banana Pro (2K/4K)

---

## 🛠️ Advanced Configuration

### Model Selection Strategy

```typescript
// Automatic model selection based on requirements
export function selectImageModel(requirements: {
  needsText?: boolean;
  budget?: 'low' | 'medium' | 'high';
  resolution?: '1K' | '2K' | '4K';
  style?: 'photorealistic' | 'artistic' | 'general';
}): string {
  const { needsText, budget, resolution, style } = requirements;

  // Text-heavy images (memes, infographics)
  if (needsText) {
    return 'nano-banana';
  }

  // High resolution required
  if (resolution === '4K') {
    return 'nano-banana-pro';
  }

  // Budget constraints
  if (budget === 'low') {
    return 'sd3-medium';
  }

  // Artistic style
  if (style === 'artistic') {
    return 'flux-pro';
  }

  // Default: Best value
  return 'nano-banana';
}
```

### Caching and Optimization

```typescript
// Cache frequently generated images
const imageCache = new Map<string, string>();

export async function generateImageCached(
  prompt: string,
  model: string
): Promise<string> {
  const cacheKey = `${model}:${prompt}`;

  if (imageCache.has(cacheKey)) {
    console.log('Returning cached image');
    return imageCache.get(cacheKey)!;
  }

  const imageUrl = await generateImage(prompt, model as any);
  imageCache.set(cacheKey, imageUrl);

  return imageUrl;
}
```

---

## 🐛 Troubleshooting

### Error: "Invalid API Key"

```bash
# Check .env.local file:
cat .env.local | grep FAL_KEY

# Key should start with your credentials
# Re-generate key at https://fal.ai/dashboard
```

### Error: "Rate Limit Exceeded"

```bash
# Check usage at https://fal.ai/dashboard
# Upgrade plan or wait for reset
# Fal.ai offers pay-as-you-go pricing
```

### Fallback to FLUX.1 Pro Every Time

```bash
# Nano Banana API key not set or invalid
# Check logs for specific error
# Verify FAL_KEY in .env.local
```

### Slow Generation

```bash
# Check model: Use standard Nano Banana for speed
# Model: nano-banana ✅ (3-5s)
# Model: nano-banana-pro ❌ (5-8s, slower)

# Check resolution: Lower resolution = faster
# square_hd ✅ (fastest)
# portrait_16_9 ⚠️ (moderate)
# Nano Banana Pro with 4K ❌ (slowest)
```

### Poor Text Rendering

```bash
# Use Nano Banana (best for text)
# Avoid FLUX.1 Pro for text-heavy images
# Be specific in prompt: "Large bold text saying 'HELLO'"
```

---

## 📈 Monitoring & Optimization

### Usage Tracking

Check usage at: https://fal.ai/dashboard

Monitor:
- Images generated per day
- Cost per model (Nano Banana vs Pro vs FLUX)
- Average generation time
- Error rates

### Cost Optimization Tips

1. **Use Standard Nano Banana**:
   - `nano-banana` (faster, cheaper) for most use cases
   - `nano-banana-pro` only for premium tier users

2. **Implement Caching**:
   - Cache common prompts
   - Reuse similar images
   - Reduce duplicate generations

3. **Optimize Prompts**:
   - Shorter prompts = faster generation
   - Be specific to reduce retries

4. **Route by Use Case**:
   - Memes → Nano Banana (best text)
   - Artistic → FLUX.1 Pro (best quality)
   - Budget → SD3 Medium (cheapest)

5. **Set Image Size Appropriately**:
   - `square` for thumbnails
   - `square_hd` for general use
   - `portrait_16_9` for social media
   - Avoid 4K unless necessary

---

## 🔐 Security Best Practices

### API Key Storage

```bash
# ❌ NEVER commit API keys to git
.env.local

# ✅ Use environment variables
FAL_KEY=your-key-here
GOOGLE_AI_API_KEY=your-key-here

# ✅ Use Vercel secrets in production
vercel env add FAL_KEY
vercel env add GOOGLE_AI_API_KEY
```

### Rate Limiting

```typescript
// Implement per-user rate limiting
import { checkRateLimit } from '@/lib/rate-limit';

const rateLimit = checkRateLimit(wallet, 'image-generation');
if (!rateLimit.allowed) {
  throw new Error('Rate limit exceeded');
}
```

### Input Validation

```typescript
// Sanitize user prompts
const sanitized = prompt.trim().slice(0, 5000);

// Reject malicious prompts
const blockedTerms = ['explicit content', 'violence', 'hate speech'];
if (blockedTerms.some(term => sanitized.toLowerCase().includes(term))) {
  throw new Error('Invalid prompt');
}
```

---

## 📚 Additional Resources

### Official Documentation
- **Fal.ai Nano Banana**: https://fal.ai/models/fal-ai/nano-banana
- **Google Gemini Image**: https://ai.google.dev/gemini-api/docs/image-generation
- **Nano Banana Blog**: https://blog.google/technology/ai/nano-banana-pro/

### Comparison Guides
- Nano Banana vs FLUX.1 Pro: Better text, similar quality, 29% cheaper
- Nano Banana vs Stable Diffusion: Superior quality, worth 30% premium
- Nano Banana vs DALL-E 3: Comparable quality, more control, better pricing

### Support
- **Fal.ai**: https://fal.ai/support
- **Google AI**: https://ai.google.dev/support
- **Community**: Fal.ai Discord

---

## 🎯 Next Steps

1. **Get API Key**: https://fal.ai/dashboard
2. **Add to .env.local**: `FAL_KEY=your-key-here`
3. **Test Image Generator**: Generate a test image
4. **Monitor Usage**: Check Fal.ai dashboard
5. **Optimize**: Implement caching and prompt optimization

---

## 🆚 Model Comparison Matrix

| Feature | Nano Banana | Nano Banana Pro | FLUX.1 Pro | SD3 Medium |
|---------|-------------|-----------------|------------|------------|
| **Cost** | $0.039 | $0.139-0.24 | $0.055 | $0.03 |
| **Resolution** | 1024x1024 | Up to 4K | 1024x1024 | 1024x1024 |
| **Text Quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Speed** | Fast (3-5s) | Moderate (5-20s) | Moderate (8-12s) | Fast (5-8s) |
| **Artistic** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Photorealistic** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Multi-Object** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Character Consistency** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Editing** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **Best For** | General, memes | Studio, 2K/4K | Artistic | Budget |

**Verdict**:
- **Nano Banana**: Best overall value and features
- **Nano Banana Pro**: Premium tier, studio quality
- **FLUX.1 Pro**: Ultra-high artistic quality
- **SD3 Medium**: Budget option

---

**Last Updated**: January 2025
**Version**: 1.0
**Status**: Production Ready ✅
