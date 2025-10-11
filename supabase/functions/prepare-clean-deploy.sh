#!/bin/bash

# This script prepares a clean deployment setup for Supabase Edge Functions

echo "🔧 Setting up clean deployment environment for Supabase Edge Functions..."

# Create a fresh plan-deploy directory
rm -rf plan-deploy
mkdir -p plan-deploy

# Copy only the essential files
cp plan/index.ts plan-deploy/

# Fix environment variable names if needed
sed -i '' 's/Deno\.env\.get("URL")/Deno\.env\.get("SUPABASE_URL")/g' plan-deploy/index.ts
sed -i '' 's/Deno\.env\.get("KEY")/Deno\.env\.get("SUPABASE_ANON_KEY")/g' plan-deploy/index.ts

cat > plan-deploy/deno.json << 'EOF'
{
  "tasks": {
    "start": "deno run --allow-net --allow-env --allow-read index.ts"
  },
  "imports": {
    "std/http/server": "https://deno.land/std@0.177.0/http/server.ts",
    "@supabase/supabase-js": "npm:@supabase/supabase-js@2.38.4",
    "openai": "npm:openai@4.19.0"
  }
}
EOF

echo "✅ Clean deployment environment ready."
echo "To deploy, run:"
echo "  cd plan-deploy"
echo "  supabase functions deploy plan --project-ref YOUR_PROJECT_REF"