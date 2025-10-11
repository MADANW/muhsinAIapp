#!/bin/bash

# Test script for local function verification
# This script helps test the Supabase Edge Function locally

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
  echo ""
  echo "To find your Supabase URL and anon key:"
  echo "1. Go to Supabase dashboard"
  echo "2. Click Settings > API"
  echo "3. Copy 'Project URL' for SUPABASE_URL"
  echo "4. Copy 'anon/public' key for SUPABASE_ANON_KEY"
  echo ""
  echo "To find your OpenAI API key:"
  echo "1. Go to platform.openai.com/api-keys"
  echo "2. Create or copy an existing API key"
  echo ""
  echo "After updating the .env file, run this script again."
  exit 0
fi

# Check if API keys have been updated
if grep -q "your-project-ref.supabase.co" .env; then
  echo "⚠️ The .env file still contains default values. Please update with your actual API keys."
  echo "File location: $(pwd)/.env"
  exit 1
fi

# Load environment variables
export $(grep -v '^#' .env | xargs)

echo "🔍 Checking environment variables..."
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_ANON_KEY" ] || [ -z "$OPENAI_API_KEY" ]; then
  echo "❌ One or more environment variables are missing. Please check your .env file."
  exit 1
fi

# Run the function locally with environment variables
echo "🚀 Starting local server..."
echo "The function will start a local server. To test it:"
echo "1. Open a new terminal"
echo "2. Use curl or another tool to send a POST request with a valid JWT token"
echo "Press Ctrl+C to stop the server when done."
echo ""

deno run --allow-net --allow-env --allow-read --import-map=deno.json index.ts

echo "✅ Test complete."