#!/bin/bash

# SafeMind Setup Script
# This script sets up the development environment

set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║                  SafeMind Setup Script                   ║"
echo "║       Youth Guardrails for AI Interactions               ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js version
echo "🔍 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Node.js 20 or higher is required. You have $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Root dependencies installed"
echo ""

echo "📦 Installing API dependencies..."
cd apps/api && npm install
cd ../..
echo "✅ API dependencies installed"
echo ""

echo "📦 Installing Web dependencies..."
cd apps/web && npm install
cd ../..
echo "✅ Web dependencies installed"
echo ""

# Create .env files
echo "🔧 Setting up environment files..."

if [ ! -f "apps/api/.env" ]; then
    cp apps/api/.env.example apps/api/.env
    echo "✅ Created apps/api/.env from template"
    echo "⚠️  Please add your API keys to apps/api/.env"
else
    echo "ℹ️  apps/api/.env already exists"
fi

if [ ! -f "apps/web/.env.local" ]; then
    cp apps/web/.env.local.example apps/web/.env.local
    echo "✅ Created apps/web/.env.local from template"
else
    echo "ℹ️  apps/web/.env.local already exists"
fi
echo ""

# Summary
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                     Setup Complete!                      ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Add your API keys to apps/api/.env:"
echo "   - Get Perspective API key: https://developers.perspectiveapi.com/s/"
echo "   - Get OpenAI API key: https://platform.openai.com/signup"
echo ""
echo "2. Start the development servers:"
echo "   Terminal 1: npm run dev:api"
echo "   Terminal 2: npm run dev:web"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation:"
echo "   - GETTING_STARTED.md - Complete setup guide"
echo "   - TECHNICAL_RECOMMENDATIONS.md - Technical details"
echo "   - README.md - Project overview"
echo ""
echo "🛡️  Building safer AI spaces for youth!"
echo ""
