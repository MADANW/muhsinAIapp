#!/bin/bash

# Deploy script for Supabase Edge Functions
# This script helps prepare and deploy edge functions

set -e # Exit on error

echo "🚀 Preparing to deploy Supabase Edge Functions..."

# Make sure we're in the right directory
cd "$(dirname "$0")"

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check for Deno
if ! command -v deno &> /dev/null; then
    echo "❌ Deno not found. Please install it first:"
    echo "curl -fsSL https://deno.land/install.sh | sh"
    exit 1
fi

echo "✅ Dependencies found"

# Check for problematic .npmrc file
if [ -f "plan/.npmrc" ]; then
    echo "⚠️ Found .npmrc file in plan directory, checking for issues..."
    if grep -q "@deno:registry" "plan/.npmrc"; then
        echo "⚠️ Found problematic @deno:registry in .npmrc, removing it..."
        sed -i '' '/@deno:registry/d' "plan/.npmrc"
    fi
fi

# Cache the imports for the plan function
echo "📦 Caching dependencies for plan function..."
cd plan

# Try a more direct approach using the import map
echo "🔄 Using import_map.json for dependency resolution..."
deno cache --reload --import-map=import_map.json index.ts
if [ $? -ne 0 ]; then
    echo "⚠️ First attempt failed, trying alternative approach..."
    # Try without npm flag
    deno cache --reload --no-npm index.ts
    if [ $? -ne 0 ]; then
        echo "❌ Failed to cache dependencies. Please check error messages above."
        exit 1
    fi
fi
cd ..

echo "✅ Dependencies cached successfully"

# Deploy the function
echo "🚀 Deploying plan function to Supabase..."
supabase functions deploy plan

echo "🎉 Deployment complete!"