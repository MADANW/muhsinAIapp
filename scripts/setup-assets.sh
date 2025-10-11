#!/bin/bash

# Script to properly structure assets directory for better React Native compatibility

echo "🖼️ Setting up asset directories for better React Native compatibility..."

# Navigate to the project root
cd "$(dirname "$0")/.."

# Make sure we have the png directory
mkdir -p assets/images/png

# Copy the ico files to png if they don't exist
if [ ! -f "assets/images/png/logo.png" ]; then
  echo "Creating logo.png from logo.ico"
  cp assets/images/logo.ico assets/images/png/logo.png
fi

if [ ! -f "assets/images/png/nobg.png" ]; then
  echo "Creating nobg.png from nobg.ico"
  cp assets/images/nobg.ico assets/images/png/nobg.png
fi

if [ ! -f "assets/images/png/inverse.png" ]; then
  echo "Creating inverse.png from inverse.ico"
  cp assets/images/inverse.ico assets/images/png/inverse.png
fi

# Create symbolic links in the base assets directory
ln -sf png/logo.png assets/images/logo.png
ln -sf png/nobg.png assets/images/nobg.png
ln -sf png/inverse.png assets/images/inverse.png

echo "✅ Asset directory setup complete!"
echo "Note: For proper rendering, you should convert the ICO files to actual PNG format."