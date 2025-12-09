# RedPill AI - API Keys Setup Guide

Complete guide to obtaining all API keys needed for RedPill AI platform.

---

## 🚀 Quick Start Priority

### Phase 1: MVP Launch (0-100 users) - FREE/CHEAP
Start with these to test the platform:
- ✅ **Groq** (FREE LLM)
- ✅ **Replicate** (free credits for images)
- ✅ **Public Solana RPC** (FREE)
- ✅ **Telegram Bot** (FREE)

**Total Cost**: ~$0-50/month

### Phase 2: Early Growth (100-500 users)
Add paid tiers as you scale:
- **Fal.ai** ($15-75/month for images)
- **Play.ht** ($29/month unlimited voice)
- **Pika Labs** ($8-40/month for video)

**Total Cost**: ~$200-600/month

### Phase 3: Scale (500-5,000 users)
Premium providers for quality:
- **Gemini/Claude** for LLMs
- **Runway** for video
- **Self-hosted Demucs** for vocal removal
- **Helius** for Solana

**Total Cost**: ~$2,000-9,000/month

---

## 📋 Complete API Keys Checklist

### ☑️ Priority 1: Essential (MVP Launch)

#### 1. Groq (LLM - FREE!)
- [ ] Signup at https://console.groq.com
- [ ] Navigate to API Keys section
- [ ] Create new API key
- [ ] Copy key to `.env.local` as `GROQ_API_KEY`
- **Cost**: FREE tier (generous limits)
- **Models**: Llama 3.1 70B (249 tokens/sec), Llama 3 8B (1,300 tokens/sec)

#### 2. Replicate (Image Gen)
- [ ] Signup at https://replicate.com
- [ ] Go to Account → API Tokens
- [ ] Create new token
- [ ] Copy to `.env.local` as `REPLICATE_API_TOKEN`
- **Cost**: Free credits on signup, then ~$0.012/prediction
- **Models**: Flux.1, SDXL, and more

#### 3. Telegram Bot Token
- [ ] Open Telegram and message @BotFather
- [ ] Send command `/newbot`
- [ ] Follow prompts to name your bot
- [ ] Copy bot token to `.env.local` as `TELEGRAM_BOT_TOKEN`
- **Cost**: FREE
- **Docs**: https://core.telegram.org/bots

#### 4. Solana RPC
- [ ] Start with public RPC: `https://api.mainnet-beta.solana.com`
- [ ] Add to `.env.local` as `NEXT_PUBLIC_SOLANA_RPC`
- **Cost**: FREE (rate limited)
- **Upgrade later**: Helius or QuickNode for better performance

---

### ☑️ Priority 2: Growth Phase (100+ users)

#### 5. Fal.ai (Image Gen - PRIMARY)
- [ ] Signup at https://fal.ai
- [ ] Dashboard → API Keys
- [ ] Create new key
- [ ] Copy to `.env.local` as `FAL_KEY`
- **Cost**: $0.003/megapixel (Flux Schnell)
- **Why**: 93% cheaper than competitors, sub-second generation
- **Expected**: $15/month (100 users) → $750/month (5K users)

#### 6. Play.ht (Voice Cloning - UNLIMITED!)
- [ ] Signup at https://play.ht
- [ ] Choose "Unlimited" plan ($29/month)
- [ ] Settings → API Access
- [ ] Copy API Key and User ID
- [ ] Add to `.env.local`:
  - `PLAYHT_API_KEY`
  - `PLAYHT_USER_ID`
- **Cost**: $29/month flat (UNLIMITED generations!)
- **Why**: At 5K users, competitors cost $4,125/month vs $29
- **ROI**: Pays for itself at just 1,000 chars/month

#### 7. Pika Labs (Video Gen - Low Volume)
- [ ] Signup at https://pika.art
- [ ] Join Discord server
- [ ] Subscribe to Standard ($8/month, 700 credits)
- [ ] Get API access (Discord-based or unofficial wrapper)
- [ ] Add to `.env.local` as `PIKA_API_KEY`
- **Cost**: $8/month per account
- **Scaling**: Add more accounts as needed (10 accounts = $80/month for 100+ users)

---

### ☑️ Priority 3: Scale Phase (500+ users)

#### 8. Google Gemini (LLM - When Groq hits limits)
- [ ] Go to https://ai.google.dev
- [ ] Click "Get API Key" button
- [ ] Create new project or select existing
- [ ] Generate API key
- [ ] Copy to `.env.local` as `GOOGLE_AI_API_KEY`
- **Cost**: $1.25-2.50 per 1M input tokens, $10-15 per 1M output
- **Why**: 2M token context window, excellent quality
- **Expected**: $206/month (1K users) → $1,031/month (5K users)

#### 9. Anthropic Claude (LLM - Premium Quality)
- [ ] Signup at https://console.anthropic.com
- [ ] Account → API Keys
- [ ] Create new key
- [ ] Copy to `.env.local` as `ANTHROPIC_API_KEY`
- **Cost**: $0.80 per 1M input, $4 per 1M output (Haiku 3.5)
- **Why**: Best creative writing, 90% savings with prompt caching
- **Use**: Premium tier or when quality is critical

#### 10. Runway Gen-3 (Video - High Volume)
- [ ] Signup at https://runwayml.com
- [ ] Choose "Unlimited" plan ($95/month)
- [ ] Settings → API Access
- [ ] Generate API key
- [ ] Copy to `.env.local` as `RUNWAY_API_KEY`
- **Cost**: $95/month (unlimited slow mode + 225 sec fast)
- **Why**: 4K quality, better value at 1,000+ users
- **Break-even**: ~1,200 seconds/month vs Pika Labs

#### 11. Helius (Solana - Enhanced APIs)
- [ ] Signup at https://helius.dev
- [ ] Dashboard → API Keys
- [ ] Create new key (start with free tier)
- [ ] Copy to `.env.local` as `HELIUS_API_KEY`
- [ ] Update RPC: `https://mainnet.helius-rpc.com/?api-key=YOUR_KEY`
- **Cost**: Free tier → $49/month (Hobby) → $249/month (Growth)
- **Why**: Enhanced APIs for token balance checks, webhooks, faster
- **Upgrade**: When public RPC becomes too slow (200+ users)

---

### ☑️ Priority 4: Optional/Advanced

#### 12. Deepgram Aura-2 (Voice - Backup)
- [ ] Signup at https://console.deepgram.com
- [ ] API Keys section
- [ ] Create new key
- [ ] Copy to `.env.local` as `DEEPGRAM_API_KEY`
- **Cost**: $0.03 per 1K characters (pay-as-you-go)
- **Why**: Highest quality in enterprise tests, sub-200ms latency
- **Use**: Premium tier or real-time voice features

#### 13. ElevenLabs (Voice - Premium Tier)
- [ ] Signup at https://elevenlabs.io
- [ ] Choose Pro plan ($82.50/month, 100K chars)
- [ ] Profile → API Key
- [ ] Copy to `.env.local` as `ELEVENLABS_API_KEY`
- **Cost**: $82.50/month
- **Why**: Best-in-class quality (4.14 MOS), 29+ languages
- **Use**: Premium "God Mode" tier for users wanting best voice quality

#### 14. Together.ai (Image - Batch Processing)
- [ ] Signup at https://together.ai
- [ ] Get API key
- [ ] Copy to `.env.local` as `TOGETHER_API_KEY`
- **Cost**: Variable, batch API 50% discount
- **Why**: Good for large batch image generation
- **Use**: Background processing, non-urgent requests

#### 15. Luma AI (Video - Alternative)
- [ ] Signup at https://lumalabs.ai
- [ ] Choose Unlimited plan ($94.99/month)
- [ ] Get API access
- [ ] Copy to `.env.local` as `LUMA_API_KEY`
- **Cost**: $95/month (similar to Runway)
- **Why**: Alternative to Runway, 1080p quality
- **Use**: Backup for Runway or if users prefer Luma style

#### 16. LALAL.AI (Vocal Remover - Backup)
- [ ] Go to https://www.lalal.ai
- [ ] For enterprise API, email: enterprise@lalal.ai
- [ ] Negotiate custom pricing
- [ ] Get API key
- [ ] Copy to `.env.local` as `LALAL_API_KEY`
- **Cost**: ~$0.08-0.12 per minute (enterprise)
- **Why**: Excellent quality, 10-stem separation
- **Use**: Backup for self-hosted Demucs or if self-hosting not feasible

#### 17. Supabase (Database)
- [ ] Signup at https://supabase.com
- [ ] Create new project
- [ ] Project Settings → API
- [ ] Copy three values to `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- **Cost**: Free tier → $25/month (Pro)
- **Why**: User data, usage tracking, admin dashboard
- **Use**: Production app (not just testing)

#### 18. Sentry (Error Tracking)
- [ ] Signup at https://sentry.io
- [ ] Create new project (Next.js)
- [ ] Project Settings → Client Keys (DSN)
- [ ] Copy DSN to `.env.local` as `SENTRY_DSN`
- **Cost**: Free tier available
- **Why**: Real-time error tracking, performance monitoring
- **Use**: Production monitoring

---

## 🔐 Self-Hosted Services

### Demucs (Vocal Remover)
**Cost**: $100-800/month for GPU server
**ROI**: Breaks even at ~50 users vs LALAL.AI

#### Option 1: RunPod (Recommended)
- [ ] Signup at https://runpod.io
- [ ] Deploy GPU instance (RTX 3090/4090)
- [ ] Install Demucs: https://github.com/facebookresearch/demucs
- [ ] Set up REST API wrapper
- [ ] Configure `.env.local`:
  - `DEMUCS_SERVER_URL=https://your-server.com`
  - `DEMUCS_SERVER_TOKEN=your_secret_token`
- **Cost**: ~$0.30-1.00/hour = $200-700/month
- **Guide**: See `/docs/setup/DEMUCS_SETUP_GUIDE.md` (TODO)

#### Option 2: Vast.ai (Cheaper)
- [ ] Signup at https://vast.ai
- [ ] Rent GPU instance
- [ ] Same setup as RunPod
- **Cost**: ~$0.15-0.50/hour = $100-350/month
- **Trade-off**: Less reliable, may need to switch instances

#### Option 3: Own GPU Server
- [ ] Purchase/rent dedicated server with GPU
- [ ] Install Ubuntu + CUDA
- [ ] Install Demucs
- **Cost**: $50-300/month (if you already have GPU)
- **Trade-off**: More control, but requires DevOps

---

## 💰 Cost Breakdown by Phase

### Phase 1: MVP (0-100 users)
| Service | Cost/Month |
|---------|-----------|
| Groq LLM | FREE |
| Replicate | $5-10 (credits) |
| Telegram | FREE |
| Solana RPC | FREE |
| **Total** | **$5-10/month** |

### Phase 2: Growth (100-500 users)
| Service | Cost/Month |
|---------|-----------|
| Groq LLM | FREE |
| Fal.ai Images | $15-75 |
| Play.ht Voice | $29 |
| Pika Video | $8-40 |
| Solana RPC | FREE |
| **Total** | **$52-144/month** |

### Phase 3: Scale (500-5,000 users)
| Service | Cost/Month |
|---------|-----------|
| Gemini LLM | $206-1,031 |
| Fal.ai Images | $150-750 |
| Play.ht Voice | $29 |
| Demucs GPU | $200-800 |
| Runway Video | $475-4,750 |
| Helius Solana | $49-249 |
| Supabase | $25 |
| **Total** | **$1,134-7,634/month** |

### Phase 4: Enterprise (5,000+ users)
| Service | Cost/Month |
|---------|-----------|
| Gemini + Claude | $1,031-1,500 |
| Fal.ai Images | $750+ |
| Play.ht Voice | $29 |
| Demucs GPU | $800 |
| Runway Video | $4,750+ |
| Helius Solana | $249 |
| Infrastructure | $2,500 |
| Supabase | $25-100 |
| **Total** | **$10,134+/month** |

**With 40% Enterprise Discounts**: ~$6,000-7,000/month

---

## 🎯 Setup Priority Order

### Week 1: MVP
1. ✅ Groq (FREE LLM)
2. ✅ Replicate (free credits)
3. ✅ Telegram Bot (FREE)
4. ✅ Public Solana RPC
5. ✅ Copy `.env.example` to `.env.local`
6. ✅ Test all basic features

### Week 2-3: Pre-Launch
1. ✅ Fal.ai (images)
2. ✅ Play.ht Unlimited (voice)
3. ✅ Pika Labs (video)
4. ✅ Helius (better Solana RPC)
5. ✅ Supabase (database)
6. ✅ Set up monitoring

### Week 4: Launch
1. ✅ Go live with 100 beta users
2. ✅ Monitor API usage
3. ✅ Set up billing alerts
4. ✅ Test all features end-to-end

### Month 2-3: Growth
1. ✅ Add Gemini when Groq hits limits
2. ✅ Scale Pika Labs accounts
3. ✅ Set up self-hosted Demucs
4. ✅ Negotiate enterprise discounts

### Month 6+: Scale
1. ✅ Switch to Runway for video
2. ✅ Add Claude for premium quality
3. ✅ Optimize costs (caching, prompt optimization)
4. ✅ Sign annual contracts (25-37% discount)

---

## 🔒 Security Best Practices

### API Key Management
- ✅ **NEVER commit `.env.local` to git**
- ✅ Add `.env.local` to `.gitignore` (already done)
- ✅ Use Vercel secrets in production
- ✅ Rotate keys every 90 days
- ✅ Use service-specific keys (not admin keys)
- ✅ Monitor API usage daily via provider dashboards

### Billing Alerts
- ✅ Set spending limits on all providers
- ✅ Enable billing alerts at 50%, 75%, 90%
- ✅ Add backup payment method
- ✅ Review bills weekly during growth phase

### Rate Limiting
- ✅ Implement per-user rate limits
- ✅ Monitor for abuse patterns
- ✅ Add CAPTCHA for high-volume endpoints
- ✅ Cache responses when possible

### Environment Separation
```bash
# Development
.env.local (gitignored, local keys)

# Staging
.env.staging (Vercel secrets)

# Production
.env.production (Vercel secrets, different keys)
```

---

## 📚 Quick Reference Links

### Image Generation
- Fal.ai: https://fal.ai
- Replicate: https://replicate.com
- Together.ai: https://together.ai

### LLM APIs
- Groq: https://console.groq.com
- Gemini: https://ai.google.dev
- Claude: https://console.anthropic.com

### Voice Cloning
- Play.ht: https://play.ht
- Deepgram: https://console.deepgram.com
- ElevenLabs: https://elevenlabs.io

### Video Generation
- Pika Labs: https://pika.art
- Runway: https://runwayml.com
- Luma AI: https://lumalabs.ai

### Blockchain
- Helius: https://helius.dev
- QuickNode: https://quicknode.com
- Solana Docs: https://docs.solana.com

### Infrastructure
- Supabase: https://supabase.com
- Vercel: https://vercel.com
- Sentry: https://sentry.io
- RunPod: https://runpod.io

---

## 🆘 Troubleshooting

### "API Key Invalid" Error
1. Check key was copied correctly (no extra spaces)
2. Verify key is active in provider dashboard
3. Check if free trial expired
4. Ensure billing is set up

### "Rate Limit Exceeded"
1. Check provider dashboard for current usage
2. Upgrade to paid tier if on free
3. Implement caching to reduce requests
4. Add rate limiting per user
5. Consider adding backup provider

### "Insufficient Credits"
1. Add payment method to provider
2. Top up credits/increase limit
3. Set up auto-recharge
4. Enable billing alerts

### Slow Response Times
1. Check provider status page
2. Verify server location (use closest region)
3. Implement caching
4. Add backup provider with auto-failover
5. Consider upgrading tier for faster processing

---

## 📝 Next Steps

After setting up API keys:

1. **Test Each Integration**
   - Run example requests for each provider
   - Verify responses are correct
   - Check latency and performance

2. **Set Up Monitoring**
   - Enable Sentry error tracking
   - Set up API usage dashboards
   - Configure billing alerts

3. **Build Multi-Provider Fallback**
   - Implement automatic failover
   - Add retry logic with exponential backoff
   - Monitor failover events

4. **Optimize Costs**
   - Implement prompt caching (90% savings)
   - Reduce token usage (shorter prompts)
   - Use cheaper models for simple tasks
   - Batch requests when possible

5. **Plan for Scale**
   - Contact enterprise sales at 500 users
   - Negotiate volume discounts
   - Lock in annual contracts (25-37% off)
   - Build self-hosted services

---

**Last Updated**: January 2025
**Maintained By**: RedPill AI Team
**Questions?**: Check `/docs/financial/` for full cost analysis
