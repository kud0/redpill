# ElevenLabs API Pricing & Billing Research (January 2025)

**Research Date:** 2025-01-21
**Source:** Official ElevenLabs documentation and verified third-party sources

---

## 1. PRICING MODEL

### Hybrid Model: Subscription + Usage-Based Billing

ElevenLabs uses a **hybrid pricing model** that combines:
- **Fixed monthly subscription fees** (tier-based)
- **Optional usage-based billing** (overage charges on Creator plan and above)

**Key Characteristics:**
- Usage measured in **credits** (not dollars)
- 1 credit = 1 character for V1/V2 Multilingual models
- 0.5-1 credit per character for V2 Flash/Turbo models
- Character count includes spaces and punctuation
- As of August 2025, credits unified across all models (simplified from January 2025's model-specific credit system)

---

## 2. PRICING TIERS BREAKDOWN (January 2025)

### Free Plan - $0/month
**Monthly Quota:**
- 10,000-20,000 credits/month (sources vary, likely 10,000)
- ~10-20 minutes of audio generation
- 2.5 hours of speech-to-text

**Per-Generation Limits:**
- 2,500 characters per request (web interface)
- 10,000 characters per request (non-Turbo models via API)
- 30,000 characters per request (Turbo v2 model via API)

**API Access:** YES - Full API access included
**Commercial Use:** NO - Personal/non-commercial only
**Attribution Required:** YES
**Custom Voices:** Limited
**No Credit Card Required:** YES

---

### Starter Plan - $5/month
**Monthly Quota:**
- 30,000 characters/month
- ~30 minutes of audio

**Features:**
- 10 custom voices
- Commercial license (no attribution required)
- API access included
- Voice cloning available

**Per-Generation Limits:**
- 5,000 characters per request (web)
- 10,000 characters (non-Turbo API)
- 30,000 characters (Turbo v2 API)

**Annual Billing:** $4.17/month (~16% savings)
**Overage:** Not available (hard limit)

---

### Creator Plan - $22/month
**Monthly Quota:**
- 100,000 characters/month
- ~100 minutes of audio

**Features:**
- 30 custom voices
- Commercial license
- API access included
- Voice cloning
- **Usage-based billing available**

**Per-Generation Limits:**
- 5,000 characters per request (web)
- 10,000 characters (non-Turbo API)
- 30,000 characters (Turbo v2 API)

**Annual Billing:** Available with discount
**First Month Promo:** Often $11 (50% off)
**Overage Rate:** $0.30 per 1,000 characters

---

### Pro Plan - $99/month
**Monthly Quota:**
- 500,000 characters/month
- ~500 minutes of audio (8.3 hours)

**Features:**
- 160 custom voices
- Commercial license
- API access included
- Voice cloning
- **Usage-based billing available**
- Professional features

**Per-Generation Limits:**
- 5,000 characters per request (web)
- 10,000 characters (non-Turbo API)
- 30,000 characters (Turbo v2 API)

**Annual Billing:** Available with discount
**Overage Rate:** $0.24 per 1,000 characters

---

### Scale Plan - $330/month
**Monthly Quota:**
- 2 million credits/month = 4 million characters
- ~2,000 minutes of audio (33.3 hours)

**Features:**
- Custom voices (high limit)
- Commercial license
- API access included
- Reduced per-character pricing
- For startups and publishers
- **Usage-based billing available**

**Per-Generation Limits:**
- Same as Pro plan

**Overage Rate:** $0.18 per 1,000 characters

---

### Business Plan - $1,320/month
**Monthly Quota:**
- 11 million credits/month = 22 million characters
- ~11,000 minutes of audio (183 hours)

**Features:**
- Highest character quota
- Commercial license
- API access included
- Lowest overage rates
- **Usage-based billing available**
- Enterprise features

**Overage Rate:** $0.12 per 1,000 characters

---

### Enterprise Plan - Custom Pricing
**Features:**
- Custom character quotas
- Dedicated support
- SLA agreements
- Custom integrations
- Contact sales for pricing

---

## 3. API KEY LOCATION - EXACT STEPS

### Method 1: Via Profile Menu (Recommended)
1. Log in to https://elevenlabs.io
2. Look at the **bottom-left corner** of the screen
3. Find "My Workspace" or your profile picture
4. Click on **"Profile + API Key"**
5. Your API key will be displayed

### Method 2: Via Developers Section
1. Log in to https://elevenlabs.io
2. Click **"Developers"** in the left sidebar
3. Select the **"API Keys"** tab
4. View existing keys or create new ones

### Method 3: Direct URL
Navigate directly to: https://elevenlabs.io/app/settings/api-keys

### Creating a New API Key
1. Press the **"Create API Key"** button
2. Enter the key **Name**
3. Click **"Create"**
4. **IMPORTANT:** Copy the key immediately - it won't be shown again
5. Store securely (treat as secret, never expose in client-side code)

### API Key Requirements
- **Free Plan:** YES - API access included
- **No Credit Card Required:** For free tier access
- **Paid Plans:** All include full API access

---

## 4. CHARACTER COUNTING

### How Characters Are Counted
- **Input Text:** Every character in the input text, including:
  - Letters (a-z, A-Z)
  - Numbers (0-9)
  - Spaces
  - Punctuation (. , ! ? ; : etc.)
  - Special characters (@, #, $, etc.)

### Credit Conversion Rates (August 2025 Unified)
- **V1 English:** 1 character = 1 credit
- **V1 Multilingual:** 1 character = 1 credit
- **V2 Multilingual:** 1 character = 1 credit
- **V2 Flash/Turbo English:** 0.5-1 credit per character (discounted)
- **V2.5 Flash/Turbo Multilingual:** 0.5-1 credit per character (discounted)

### Failed Generations
- Information not explicitly stated in sources
- Recommendation: Test with small request to confirm

### Usage Tracking
- Dashboard shows current usage
- Track usage in real-time via API or web interface
- Usage resets monthly on billing date

---

## 5. WHAT HAPPENS WHEN YOU EXCEED LIMITS

### Free Plan
- **Hard limit** - no overages available
- Generation stops when quota exhausted
- Must wait until next billing cycle or upgrade

### Starter Plan ($5/month)
- **Hard limit** - no overages available
- No usage-based billing option
- Must upgrade to Creator plan or higher for overages

### Creator Plan ($22/month) and Above
- **Usage-based billing available**
- Automatically charges for overages at tier-specific rates
- Can set maximum threshold to control costs

### Overage Billing Triggers
1. **End of billing cycle:** Charges at end of month
2. **Immediate charge:** If overage exceeds 2x monthly subscription fee
   - Example (Creator): If overage hits $44 (2 x $22), immediate charge

### Setting Overage Limits
- You can set a **maximum threshold** for additional credits
- Prevents unexpected charges
- Configurable in account settings
- Reference: https://help.elevenlabs.io/hc/en-us/articles/35899480663313

---

## 6. API VS WEB INTERFACE

### API Access
- **Available on ALL plans** (including Free)
- No extra cost beyond character usage
- Same character limits apply
- Same pricing as web interface

### Per-Generation Limits Comparison

| Interface | Free Plan | Paid Plans (Web) | API (Non-Turbo) | API (Turbo v2) |
|-----------|-----------|------------------|-----------------|----------------|
| Max Characters | 2,500 | 5,000 | 10,000 | 30,000 |

### API-Specific Features
- Higher per-request limits (especially Turbo v2: 30k chars)
- Better for automation and integration
- Same monthly quota consumption as web
- Rate limits may apply (not specified in sources)

### Web Interface Features
- Lower per-request limits
- Visual preview and editing
- Easier for manual generation
- Same monthly quota consumption as API

---

## 7. OVERAGE CHARGES SUMMARY

### Overage Rates (per 1,000 characters)
- **Creator Plan:** $0.30
- **Pro Plan:** $0.24
- **Scale Plan:** $0.18
- **Business Plan:** $0.12

### Example Overage Calculations

#### Creator Plan ($22/month, 100k chars included)
- Used: 150,000 characters
- Overage: 50,000 characters
- Cost: 50 x $0.30 = $15.00
- **Total Bill:** $22 + $15 = $37.00

#### Pro Plan ($99/month, 500k chars included)
- Used: 750,000 characters
- Overage: 250,000 characters
- Cost: 250 x $0.24 = $60.00
- **Total Bill:** $99 + $60 = $159.00

### Immediate Charge Threshold
- If overage exceeds **2x monthly subscription**, immediate charge
- Example: Creator plan immediate charge at $44 overage (~147k extra chars)

---

## 8. ADDITIONAL PROGRAMS

### ElevenLabs Grants Program
- **Free usage for startups**
- 12 months of free access
- 33+ million credits included
- Application required
- Great for new products testing integration

### Annual Billing Discounts
- Save 16-20% on all paid tiers
- Example: Starter at $4.17/month instead of $5/month

---

## 9. KEY TAKEAWAYS FOR DEVELOPERS

### Recommendations by Use Case

#### Prototyping / Testing
- **Free Plan** - 10k chars/month, full API access, no credit card

#### Small Projects / Hobby
- **Starter Plan** ($5/month) - 30k chars, commercial license

#### Content Creators / Medium Traffic
- **Creator Plan** ($22/month) - 100k chars, overage billing available

#### Professional Apps / High Traffic
- **Pro Plan** ($99/month) - 500k chars, lower overage rates

#### Startups / Publishers
- **Scale Plan** ($330/month) - 4M chars, best cost-per-character

#### Enterprise / High Volume
- **Business Plan** ($1,320/month) - 22M chars, lowest overage rate

### Cost Optimization Tips
1. Use Turbo models (0.5-1 credit/char) when possible
2. Set overage thresholds to prevent unexpected charges
3. Consider annual billing for 16-20% savings
4. Apply for Grants program if eligible
5. Monitor usage via dashboard/API regularly
6. Batch requests to reduce overhead
7. Cache generated audio when possible

---

## 10. IMPORTANT NOTES

### January 2025 Pricing Changes
- ElevenLabs restructured pricing with model-specific credits
- Split credits across Multilingual v2 and Conversational v1 models

### August 2025 Simplification
- Unified credits regardless of model
- Easier to understand and track usage
- Current system (as of research date)

### API Security
- Never expose API keys in client-side code
- Use environment variables
- Rotate keys if compromised
- Each key can be named for tracking

### Support Resources
- Documentation: https://elevenlabs.io/docs
- API Reference: https://api.elevenlabs.io/docs
- Help Center: https://help.elevenlabs.io
- Pricing Page: https://elevenlabs.io/pricing

---

## SOURCES CONSULTED

1. Official ElevenLabs Pricing Page: https://elevenlabs.io/pricing
2. Official ElevenLabs API Pricing: https://elevenlabs.io/pricing/api
3. Official Documentation: https://elevenlabs.io/docs
4. FlexPrice Analysis: https://flexprice.io/blog/elevenlabs-pricing-breakdown
5. Orb Pricing Breakdown: https://www.withorb.com/blog/eleven-labs-pricing
6. Multiple third-party verified sources (SaaSworthy, Tekpon, etc.)

**Research Confidence:** HIGH - Information cross-verified across multiple official and third-party sources.

---

## FILE METADATA

- **Absolute Path:** `/Users/alexsolecarretero/Public/projects/crypto-ideas/crypto-ai-coin/redpill-ai/docs/elevenlabs-pricing-research-2025.md`
- **Created:** 2025-01-21
- **Purpose:** ElevenLabs API pricing and billing research for crypto-ai-coin project
- **Next Steps:** Review pricing tiers and select appropriate plan for project requirements
