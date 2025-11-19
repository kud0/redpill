# RedPill AI - Quickstart Guide

Get up and running in 5 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed ([nodejs.org](https://nodejs.org))
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] Solana wallet (Phantom or Solflare)

## Step 1: Clone and Install (2 min)

```bash
# Navigate to your projects folder
cd ~/projects

# Clone the repository
git clone <your-repo-url> redpill-ai
cd redpill-ai

# Install dependencies
npm install
```

## Step 2: Get API Keys (5-10 min)

### Quick Links

1. **Helius** (Required): [helius.dev](https://helius.dev) - Free tier available
2. **Together.ai** (Required): [together.ai](https://together.ai) - $25 free credit
3. **Anthropic** (Required): [console.anthropic.com](https://console.anthropic.com) - $5 free credit
4. **Groq** (Required): [console.groq.com](https://console.groq.com) - Free tier available
5. **Telegram** (Optional): [@BotFather](https://t.me/BotFather) - Free

### Quick API Key Setup

```bash
# Copy example environment file
cp .env.example .env

# Open in your editor
code .env  # or nano .env
```

Fill in your API keys:

```env
HELIUS_API_KEY=your_key_here
TOGETHER_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
REDPILL_TOKEN_ADDRESS=your_token_mint_here
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
```

## Step 3: Test Run (1 min)

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see the RedPill AI homepage!

## Step 4: Test Features

### Test Wallet Connection

1. Click "Connect Wallet" in the top right
2. Select your wallet (Phantom/Solflare)
3. Approve the connection
4. Your wallet address should appear

### Test Image Generation

1. Navigate to "Image Generator"
2. Enter a prompt: "A futuristic cyberpunk city at sunset"
3. Click "Generate Image"
4. Wait ~30 seconds
5. Image should appear!

### Test Thread Writer

1. Navigate to "Thread Writer"
2. Enter topic: "Why AI and crypto are the future"
3. Select platform: X/Twitter
4. Click "Write Thread"
5. Thread should generate in ~10 seconds

## Step 5: Deploy (Optional)

### Deploy to Vercel (5 min)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project: N
# - Project name: redpill-ai
# - Deploy: Y

# Add environment variables when prompted
# Or add them in Vercel dashboard later
```

## Common Issues

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### API Key Issues

**Error: "HELIUS_API_KEY is not configured"**

- Check `.env` file exists
- Verify no typos in variable names
- Restart dev server after adding keys

**Error: "Failed to generate image"**

- Verify Together.ai API key is valid
- Check you have credits remaining
- Check API key has correct permissions

### Wallet Connection Issues

**Wallet not connecting:**

- Refresh the page
- Try a different browser
- Update your wallet extension
- Clear browser cache

**Balance not showing:**

- Verify `REDPILL_TOKEN_ADDRESS` is correct
- Check Helius API key is valid
- Ensure wallet has $REDPILL tokens

## Testing with Test Tokens

For development, you can modify the tier check:

```typescript
// In lib/helius.ts, temporarily modify getUserTier:
export function getUserTier(balance: number): TierLevel {
  // Remove this in production!
  return 'god'; // Everyone gets god mode for testing

  // Original logic:
  // if (balance >= TIER_CONFIGS.god.minTokens) return 'god';
  // ...
}
```

Remember to revert this before deploying!

## Development Tips

### Hot Reload

Changes to code will auto-reload in browser.

### View Logs

```bash
# Development logs appear in terminal
# Check for errors or API responses
```

### Debugging

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Network tab shows API requests
4. React DevTools for component inspection

## Next Steps

- [ ] Customize the UI colors/branding
- [ ] Add your token contract address
- [ ] Test all features thoroughly
- [ ] Set up production environment variables
- [ ] Deploy to Vercel
- [ ] Set up custom domain
- [ ] Launch Telegram bot (optional)

## Running Telegram Bot

```bash
# In a separate terminal
npm run telegram-bot

# Test by messaging your bot on Telegram
```

## Production Checklist

Before going live:

- [ ] All API keys set in production environment
- [ ] Real token address configured
- [ ] Rate limiting tested
- [ ] All features tested with real wallets
- [ ] Mobile responsive verified
- [ ] SSL certificate active
- [ ] Analytics set up
- [ ] Error monitoring configured
- [ ] Backup strategy in place

## Support

### Documentation

- **README**: Project overview and setup
- **DEPLOYMENT**: Production deployment guide
- **CONTRIBUTING**: How to contribute

### Get Help

- **Issues**: Report bugs on GitHub
- **Discord**: [discord.gg/redpillai](https://discord.gg/redpillai)
- **Twitter**: [@RedPillAI](https://twitter.com/RedPillAI)
- **Email**: dev@redpill.ai

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run linter
npm run telegram-bot    # Start Telegram bot

# Deployment
vercel                  # Deploy to Vercel
vercel --prod          # Deploy to production
```

## Quick Reference

### File Locations

- **Pages**: `/app/[feature]/page.tsx`
- **API**: `/app/api/[endpoint]/route.ts`
- **Components**: `/components/`
- **Utils**: `/lib/`
- **Telegram**: `/telegram-bot/bot.ts`
- **Styles**: `/app/globals.css`

### Key Files to Modify

- **Branding**: `/app/page.tsx`, `/components/navigation.tsx`
- **Tiers**: `/lib/types.ts` (TIER_CONFIGS)
- **Rate Limits**: `/lib/rate-limit.ts`
- **Wallet Config**: `/components/providers.tsx`

---

Happy building! 🔴 Welcome to RedPill AI
