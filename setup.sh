#!/bin/bash

# RedPill AI - Quick Setup Script
# This script helps you get started quickly

set -e

echo "🔴 RedPill AI - Quick Setup Script"
echo "=================================="
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required!"
    echo "Current version: $(node -v)"
    echo "Please upgrade from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: You need to add your API keys to .env file"
    echo ""
    echo "Required API keys:"
    echo "  1. HELIUS_API_KEY - Get from https://helius.dev"
    echo "  2. TOGETHER_API_KEY - Get from https://together.ai"
    echo "  3. ANTHROPIC_API_KEY - Get from https://console.anthropic.com"
    echo "  4. GROQ_API_KEY - Get from https://console.groq.com"
    echo "  5. REDPILL_TOKEN_ADDRESS - Your Solana token mint address"
    echo ""
    echo "Optional:"
    echo "  6. TELEGRAM_BOT_TOKEN - Get from @BotFather on Telegram"
    echo ""

    # Prompt user to edit .env
    read -p "Would you like to edit .env now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ${EDITOR:-nano} .env
    fi
else
    echo "✅ .env file already exists"
fi

echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    echo "This may take a few minutes..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo ""
echo "1. Make sure your API keys are set in .env file"
echo "2. Update REDPILL_TOKEN_ADDRESS with your token mint"
echo "3. Run: npm run dev"
echo "4. Open: http://localhost:3000"
echo ""
echo "For Telegram bot:"
echo "  npm run telegram-bot (in a separate terminal)"
echo ""
echo "Documentation:"
echo "  - README.md - Project overview"
echo "  - QUICKSTART.md - Quick start guide"
echo "  - DEPLOYMENT.md - Deployment instructions"
echo ""
echo "Need help? Visit: https://github.com/your-repo/issues"
echo ""
