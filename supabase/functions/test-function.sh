#!/bin/bash

# Test script for local function verification
# This script helps test the Supabase Edge Function locally
# Updated to handle debugging options

echo "🧪 Testing Supabase Edge Function locally..."

# Make sure we're in the right directory
cd "$(dirname "$0")"
cd plan-deploy

# Check if .env file exists, create if not
if [ ! -f ".env" ]; then
  echo "Creating sample .env file..."
  cat > .env << 'EOF'
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-key
EOF
  echo "⚠️ Please edit .env with your actual API keys before testing."
  exit 0
fi

# Run the function locally with environment variables
echo "🚀 Starting local server..."
deno run --allow-net --allow-env --allow-read --import-map=deno.json index.ts

echo "✅ Test complete."