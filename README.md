# RedPill AI ($REDPILL)

> Hold $REDPILL tokens to unlock unlimited access to premium AI tools. No subscriptions. No limits. Just pure utility.

## Features

- **Image Generation**: Flux.1 Pro & Stable Diffusion 3 Medium
- **Meme Generator**: Auto-templates with trending formats
- **Thread Writer**: AI-powered threads for X, Warpcast, and Lens Protocol
- **Voice Cloner**: Clone any voice with 10 seconds of audio (Coming Soon)
- **Vocal Remover**: Split audio into stems (Coming Soon)
- **Telegram Bot**: Access all features via Telegram

## Tier System

| Tier | Balance Required | Features |
|------|-----------------|----------|
| **Basic** | 500K $REDPILL | Image Gen (SD3), Thread Writer, Meme Generator |
| **Full** | 2M $REDPILL | All Basic + Flux.1 Pro, Voice Cloner, Vocal Remover |
| **God Mode** | 10M $REDPILL | All Features + Priority Processing + Early Access |

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Blockchain**: Solana (wallet-adapter)
- **Balance Checking**: Helius API
- **AI Providers**:
  - Together.ai (Image Generation)
  - Anthropic Claude (Thread Writing)
  - Groq (Fast Text Generation)
- **Telegram**: Grammy.js

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Solana wallet (Phantom, Solflare, etc.)
- API keys for Helius, Together.ai, Anthropic, Groq

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd redpill-ai

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your API keys
nano .env
```

### Environment Variables

Create a `.env` file with the following:

```env
# Helius API for Solana balance checking
HELIUS_API_KEY=your_helius_api_key_here

# AI Provider API Keys
TOGETHER_API_KEY=your_together_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GROQ_API_KEY=your_groq_api_key_here

# Solana Configuration
REDPILL_TOKEN_ADDRESS=your_token_mint_address_here
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com

# Telegram Bot (optional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
```

### Development

```bash
# Run the web app
npm run dev

# Run the Telegram bot (in separate terminal)
npm run telegram-bot
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Getting API Keys

### 1. Helius API Key

1. Go to [Helius.dev](https://helius.dev)
2. Sign up for a free account
3. Create a new project
4. Copy your API key from the dashboard
5. Add to `.env` as `HELIUS_API_KEY`

**Why Helius?** Fast, reliable Solana RPC with enhanced APIs for token balance checking.

### 2. Together.ai API Key

1. Visit [Together.ai](https://together.ai)
2. Sign up and navigate to API settings
3. Generate a new API key
4. Add to `.env` as `TOGETHER_API_KEY`

**Models Used:**
- `black-forest-labs/FLUX.1-pro` (God-tier image quality)
- `stabilityai/stable-diffusion-3-medium` (Fast, versatile)

### 3. Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account and verify
3. Navigate to API Keys section
4. Generate a new key
5. Add to `.env` as `ANTHROPIC_API_KEY`

**Model Used:** `claude-3-5-sonnet-20241022` for thread writing

### 4. Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up for free
3. Generate an API key
4. Add to `.env` as `GROQ_API_KEY`

**Model Used:** `llama-3.3-70b-versatile` for ultra-fast text generation

### 5. Telegram Bot Token (Optional)

1. Open Telegram and message [@BotFather](https://t.me/BotFather)
2. Send `/newbot` and follow instructions
3. Copy the bot token
4. Add to `.env` as `TELEGRAM_BOT_TOKEN`

## Deployment

### Vercel (Recommended for Web App)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

```bash
# Or use Vercel CLI
npm i -g vercel
vercel --prod
```

### Telegram Bot Deployment

For the Telegram bot, you'll need a long-running server:

**Option 1: Railway**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Option 2: Digital Ocean / AWS / GCP**
```bash
# SSH into your server
ssh user@your-server

# Clone repo and install
git clone <your-repo>
cd redpill-ai
npm install

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name "redpill-bot" -- run telegram-bot
pm2 save
pm2 startup
```

## Project Structure

```
redpill-ai/
├── app/
│   ├── layout.tsx              # Root layout with wallet provider
│   ├── page.tsx                # Homepage
│   ├── meme-generator/         # Meme generator page
│   ├── image-generator/        # Image generator page
│   ├── thread-writer/          # Thread writer page
│   ├── voice-cloner/           # Voice cloner page
│   ├── vocal-remover/          # Vocal remover page
│   └── api/                    # API routes
│       ├── check-balance/      # Balance checking
│       ├── generate-image/     # Image generation
│       ├── generate-meme/      # Meme generation
│       ├── write-thread/       # Thread writing
│       ├── clone-voice/        # Voice cloning
│       └── split-stems/        # Stem splitting
├── components/
│   ├── wallet-connect.tsx      # Wallet connection button
│   ├── balance-checker.tsx     # Balance display
│   ├── tier-badge.tsx          # Tier indicator
│   ├── navigation.tsx          # Main navigation
│   └── providers.tsx           # App providers
├── lib/
│   ├── types.ts                # TypeScript types
│   ├── solana.ts               # Solana utilities
│   ├── helius.ts               # Helius API integration
│   ├── ai-providers.ts         # AI provider integrations
│   └── rate-limit.ts           # Rate limiting logic
├── telegram-bot/
│   └── bot.ts                  # Telegram bot
├── package.json
├── .env.example
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Features Roadmap

### ✅ Completed
- [x] Wallet integration (Phantom, Solflare, etc.)
- [x] Balance checking via Helius
- [x] Tier system
- [x] Image generation (Flux.1 Pro & SD3)
- [x] Meme generator
- [x] Thread writer (X, Warpcast, Lens)
- [x] Telegram bot
- [x] Rate limiting

### 🚧 In Progress
- [ ] Voice cloning integration
- [ ] Vocal remover integration
- [ ] Advanced meme templates
- [ ] Image editing tools

### 📋 Planned
- [ ] NFT generation
- [ ] AI video generation
- [ ] Custom model training
- [ ] API access for developers
- [ ] Staking rewards
- [ ] Referral system

## Security

- **Never commit `.env` files**
- API keys are server-side only
- Rate limiting prevents abuse
- Wallet signatures for sensitive operations
- No private keys stored

## Rate Limiting

Default rate limits (configurable via `.env`):
- **Window**: 15 minutes
- **Max Requests**: 10 per wallet

God Mode tier holders get priority processing.

## Support

- **Website**: [redpill.ai](https://redpill.ai)
- **Twitter**: [@RedPillAI](https://twitter.com/RedPillAI)
- **Telegram**: [t.me/redpillai](https://t.me/redpillai)
- **Discord**: [discord.gg/redpillai](https://discord.gg/redpillai)

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Disclaimer

This is a utility token project. $REDPILL tokens provide access to AI tools and services. Not financial advice. DYOR.

---

Built with ❤️ by the RedPill AI team
