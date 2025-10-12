#!/bin/bash

echo "🚀 GemBooth Setup Script"
echo "========================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo ""
    echo "⚠️  Supabase CLI not found. Would you like to install it? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        npm install -g supabase
    fi
fi

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local and add your API keys"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your API keys"
echo "2. Follow SUPABASE_SETUP.md to set up your backend"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "📖 Documentation:"
echo "- Supabase Setup: ./SUPABASE_SETUP.md"
echo "- Android Setup: ./ANDROID_SETUP.md"
echo "- Deployment: ./DEPLOYMENT.md"
