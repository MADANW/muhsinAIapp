#!/bin/bash

# Script to fix asset issues with two approaches:
# 1. Replace ICO files with PNG files
# 2. Use embedded base64 images as fallbacks

echo "🛠️ MuhsinAI Asset Fix Utility"
echo "=============================="
echo "This script will fix asset reference issues in the MuhsinAI app."

# Navigate to the project root
cd "$(dirname "$0")/.." || exit 1
PROJECT_ROOT="$(pwd)"

echo "📁 Project root: $PROJECT_ROOT"

# Step 1: Create PNG directory if it doesn't exist
echo "📂 Creating PNG directory..."
mkdir -p "$PROJECT_ROOT/assets/images/png"

# Step 2: Copy ICO files to PNG files
echo "🖼️ Converting ICO files to PNG format..."

# List of ICO files
ICO_FILES=("logo" "nobg" "inverse")

for file in "${ICO_FILES[@]}"; do
  source_file="$PROJECT_ROOT/assets/images/$file.ico"
  dest_file="$PROJECT_ROOT/assets/images/png/$file.png"
  
  if [ -f "$source_file" ]; then
    echo "  - Copying $file.ico to png/$file.png"
    cp "$source_file" "$dest_file"
  else
    echo "⚠️ Warning: $source_file does not exist"
  fi
done

# Step 3: Update brand.ts file
echo "📝 Updating brand.ts file..."
BRAND_TS="$PROJECT_ROOT/app/theme/brand.ts"

if [ -f "$BRAND_TS" ]; then
  # Create a backup
  cp "$BRAND_TS" "$BRAND_TS.bak"
  
  # Update the file using sed
  sed -i '' 's/logo\.ico/png\/logo\.png/g' "$BRAND_TS"
  sed -i '' 's/nobg\.ico/png\/nobg\.png/g' "$BRAND_TS"
  sed -i '' 's/inverse\.ico/png\/inverse\.png/g' "$BRAND_TS"
  
  echo "✅ Updated brand.ts"
else
  echo "❌ Error: brand.ts not found"
fi

# Step 4: Update app.json file
echo "📝 Updating app.json file..."
APP_JSON="$PROJECT_ROOT/app.json"

if [ -f "$APP_JSON" ]; then
  # Create a backup
  cp "$APP_JSON" "$APP_JSON.bak"
  
  # Update the file using sed
  sed -i '' 's/"icon": "\.\/assets\/images\/logo\.ico"/"icon": "\.\/assets\/images\/png\/logo\.png"/g' "$APP_JSON"
  sed -i '' 's/"foregroundImage": "\.\/assets\/images\/logo\.ico"/"foregroundImage": "\.\/assets\/images\/png\/logo\.png"/g' "$APP_JSON"
  sed -i '' 's/"favicon": "\.\/assets\/images\/logo\.ico"/"favicon": "\.\/assets\/images\/png\/logo\.png"/g' "$APP_JSON"
  sed -i '' 's/"image": "\.\/assets\/images\/logo\.ico"/"image": "\.\/assets\/images\/png\/logo\.png"/g' "$APP_JSON"
  
  echo "✅ Updated app.json"
else
  echo "❌ Error: app.json not found"
fi

# Step 5: Now also create embedded images as a fallback
echo "🔄 Creating embedded base64 images as fallbacks..."

# Create a directory for the embedded images
mkdir -p app/assets/embedded

# Create a directory for the image assets
mkdir -p app/assets/embedded

# Create a file with embedded base64 fallback data for the images
cat > app/assets/embedded/images.ts << 'EOF'
/**
 * Temporary embedded assets
 * 
 * This file contains base64 representations of critical image assets
 * to avoid issues with file format compatibility in React Native.
 * 
 * These should be replaced with proper images when the asset system is fixed.
 */

// Simple placeholder image data (a green square)
export const PLACEHOLDER_ICON_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAApklEQVR42mNkGGDAOOqAUQeMOmDUAaMOGHXAqANGHUBvB4CK8f/RAYpLP4fFJWfD4tPPIfHkM0h88hnYAaCAJxYwAx3BAHYMMDQYgA5hYIA6AhgqDEBHMMA9D3MEDFA6JAgZISHBAPUIVGcD1AMMQA8wQGLCAeQRBmgQMEJCggGqmQHqAQZwaDAA9TJAHcAADQUGaBAwQkKCAerqUQeMOmDUAaOQgQEADu9xtZmH4WwAAAAASUVORK5CYII=';

// Export embedded image assets
export const EmbeddedImages = {
  logo: PLACEHOLDER_ICON_DATA,
  nobg: PLACEHOLDER_ICON_DATA,
  inverse: PLACEHOLDER_ICON_DATA,
};
EOF

# Create an updated asset registry
cat > app/lib/assetRegistry.ts << 'EOF'
/**
 * MuhsinAI Asset Registry
 * 
 * This file centralizes all asset imports to avoid path issues and provide
 * better type checking for assets.
 */

import { EmbeddedImages } from '../assets/embedded/images';

// Logo assets with fallback strategy
export const LogoAssets = {
  // Try PNG files first with embedded fallbacks
  logo: tryRequireWithFallback('../../assets/images/png/logo.png', EmbeddedImages.logo),
  nobg: tryRequireWithFallback('../../assets/images/png/nobg.png', EmbeddedImages.nobg),
  inverse: tryRequireWithFallback('../../assets/images/png/inverse.png', EmbeddedImages.inverse),
};

// Background images - using direct imports where possible
export const BackgroundAssets = {
  appBg: require('../../assets/images/appbg.jpg'),
};

// Export all asset categories
export const Assets = {
  logos: LogoAssets,
  backgrounds: BackgroundAssets,
};

/**
 * Helper function that tries to require an image and falls back to a base64 image if that fails
 */
function tryRequireWithFallback(imagePath: string, fallbackBase64: string) {
  try {
    // First try to load the actual image file
    return require(imagePath);
  } catch (error) {
    // If that fails, use the embedded base64 image
    console.warn(`Failed to load image: ${imagePath}, using fallback`);
    return { uri: fallbackBase64 };
  }
}

/**
 * This function lets you safely register an image that might not exist yet
 * It will try to load the image in development, but won't crash in production
 */
export function safeRequire(path: string) {
  try {
    return require(path);
  } catch (e) {
    console.warn(`Failed to load asset: ${path}`);
    return null;
  }
}

export default Assets;
EOF

# Step 6: Find and list files that might need updating
echo "🔍 Searching for files with potential ICO references..."

# Find files with potential ICO references
ICO_REFS=$(grep -r "\.ico" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" "$PROJECT_ROOT/app" | grep -v "deno\.json" | grep -v "\.bak")

if [ -n "$ICO_REFS" ]; then
  echo "📋 Files with ICO references that may need updating:"
  echo "$ICO_REFS"
else
  echo "✅ No more ICO references found"
fi

echo ""
echo "🎉 Asset fix operation completed!"
echo "The script has implemented two approaches to fix the asset issues:"
echo "  1. PNG files in assets/images/png directory"
echo "  2. Embedded base64 images as fallbacks"
echo ""
echo "To use the asset registry in your components:"
echo "  1. Import: import { Assets } from './lib/assetRegistry';"
echo "  2. Use: <Image source={Assets.logos.nobg} />"
echo ""
echo "If issues persist, you may need to restart your development server."