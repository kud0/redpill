# Deployment Guide

Complete guide to deploying RedPill AI to production.

## Pre-Deployment Checklist

- [ ] All API keys obtained and tested
- [ ] Token mint address configured
- [ ] Environment variables validated
- [ ] Build completes without errors
- [ ] Test deployment on staging environment
- [ ] Rate limiting configured
- [ ] Analytics/monitoring set up

## Vercel Deployment (Web App)

### Step 1: Prepare Repository

```bash
# Ensure everything is committed
git add .
git commit -m "Production ready"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Import Project"
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 3: Add Environment Variables

In Vercel dashboard, add these environment variables:

```env
HELIUS_API_KEY=your_helius_api_key
TOGETHER_API_KEY=your_together_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GROQ_API_KEY=your_groq_api_key
REDPILL_TOKEN_ADDRESS=your_token_mint_address
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
```

### Step 4: Deploy

Click "Deploy" and wait for build to complete.

### Step 5: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown
4. Wait for SSL certificate

## Telegram Bot Deployment

### Option 1: Railway.app

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Create railway.json
cat > railway.json << EOF
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run telegram-bot",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF

# Deploy
railway up
```

Add environment variables in Railway dashboard.

### Option 2: Digital Ocean Droplet

```bash
# SSH into droplet
ssh root@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Clone repository
git clone <your-repo-url>
cd redpill-ai

# Install dependencies
npm install

# Create .env file
nano .env
# Paste your environment variables

# Start bot with PM2
pm2 start npm --name "redpill-bot" -- run telegram-bot

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
# Run the command it outputs

# Monitor logs
pm2 logs redpill-bot
```

### Option 3: Docker

```dockerfile
# Create Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "telegram-bot"]
```

```bash
# Build and run
docker build -t redpill-bot .
docker run -d --env-file .env --name redpill-bot redpill-bot

# Or use docker-compose
cat > docker-compose.yml << EOF
version: '3.8'
services:
  bot:
    build: .
    env_file: .env
    restart: unless-stopped
    container_name: redpill-bot
EOF

docker-compose up -d
```

## Production Optimization

### 1. Enable Caching

Add to `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  // ... existing config
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600, s-maxage=3600',
        },
      ],
    },
  ],
};
```

### 2. Image Optimization

Already configured in `next.config.ts` with remote patterns.

### 3. Rate Limiting Enhancement

For production, use Redis instead of in-memory storage:

```bash
npm install ioredis
```

Update `lib/rate-limit.ts` to use Redis.

### 4. Monitoring

Add Sentry for error tracking:

```bash
npm install @sentry/nextjs
```

### 5. Analytics

Add Vercel Analytics:

```bash
npm install @vercel/analytics
```

Add to `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## Security Hardening

### 1. API Route Protection

All routes already validate:
- Wallet address format
- Token balance
- Rate limits

### 2. CORS Configuration

Add to API routes if needed:

```typescript
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://your-domain.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

### 3. Environment Variables

Never expose server-side keys:
- Only `NEXT_PUBLIC_*` variables are client-accessible
- Keep API keys server-side only

## Database Setup (Optional)

For persistent storage of:
- User wallets (Telegram bot)
- Request history
- Analytics

### Option 1: Supabase

```bash
npm install @supabase/supabase-js
```

### Option 2: MongoDB Atlas

```bash
npm install mongodb
```

### Option 3: PostgreSQL (Vercel)

Use Vercel Postgres for serverless SQL.

## CDN & Static Assets

Vercel automatically serves static assets via CDN. For additional optimization:

1. Use `next/image` for all images (already implemented)
2. Optimize fonts with `next/font` (already using Inter)
3. Enable Brotli compression (automatic on Vercel)

## Monitoring & Alerts

### 1. Vercel Monitoring

Built-in metrics for:
- Response times
- Error rates
- Build duration

### 2. Custom Logging

Add structured logging:

```bash
npm install pino pino-pretty
```

### 3. Health Checks

Create `app/api/health/route.ts`:

```typescript
export async function GET() {
  return Response.json({ status: 'ok', timestamp: Date.now() });
}
```

## Performance Optimization

### 1. Edge Functions

Deploy API routes to edge for lower latency:

```typescript
export const runtime = 'edge';
```

### 2. ISR (Incremental Static Regeneration)

For static content:

```typescript
export const revalidate = 3600; // Revalidate every hour
```

### 3. Bundle Analysis

```bash
npm install @next/bundle-analyzer

# Add to next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

## Scaling Considerations

### When to Scale

- Response times > 1s
- Error rate > 1%
- Rate limit exceeded frequently

### Scaling Options

1. **Vercel Pro**: Increased limits and features
2. **Edge Functions**: Lower latency globally
3. **Dedicated Database**: PostgreSQL/MongoDB
4. **Redis Cache**: For rate limiting and sessions
5. **CDN**: CloudFlare for additional caching

## Backup Strategy

### 1. Code

- GitHub for version control
- Regular backups of `.env` (encrypted)

### 2. Database (if applicable)

- Daily automated backups
- Point-in-time recovery

### 3. User Data

- GDPR compliance
- Data export functionality

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf .next
npm run build
```

### API Errors

Check:
1. Environment variables set correctly
2. API keys valid and not rate limited
3. Token address correct
4. Helius API quota not exceeded

### Telegram Bot Not Responding

```bash
# Check logs
pm2 logs redpill-bot

# Restart
pm2 restart redpill-bot

# Check webhook status
curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo
```

## Post-Deployment

- [ ] Test all features in production
- [ ] Monitor error logs for 24 hours
- [ ] Set up alerts for downtime
- [ ] Document known issues
- [ ] Create incident response plan

## Maintenance

### Weekly

- Review error logs
- Check API usage/costs
- Monitor performance metrics

### Monthly

- Update dependencies
- Security audit
- Performance optimization
- Backup verification

### Quarterly

- Major version updates
- Feature roadmap review
- User feedback analysis

---

For support, contact: dev@redpill.ai
