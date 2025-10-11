#!/bin/bash

# Script to convert .ico files to .png format for better Expo compatibility

echo "🖼️ Converting .ico files to .png for better Expo compatibility..."

# Check if the ImageMagick convert tool is installed
if ! command -v convert &> /dev/null; then
    echo "⚠️ ImageMagick is not installed. Please install it first:"
    echo "  brew install imagemagick"
    exit 1
fi

# Navigate to the assets directory
cd "$(dirname "$0")/../assets/images" || exit

# Create backup directory
mkdir -p backup

# Copy original .ico files to backup
cp *.ico backup/

# Convert each .ico file to .png
for file in *.ico; do
    # Get filename without extension
    filename=$(basename "$file" .ico)
    
    # Convert to PNG
    echo "Converting $file to $filename.png"
    convert "$file" "$filename.png"
    
    # Check if conversion was successful
    if [ -f "$filename.png" ]; then
        echo "✅ Successfully converted $file to $filename.png"
    else
        echo "❌ Failed to convert $file"
    fi
done

echo "🔄 Updating references in app/paywall.tsx..."
cd "$(dirname "$0")/.."

# Update the reference in paywall.tsx
sed -i '' 's/nobg\.ico/nobg\.png/g' app/paywall.tsx

echo "🔄 Updating references in brand.ts..."
sed -i '' 's/\.ico/\.png/g' app/theme/brand.ts

echo "🔄 Updating references in app.json..."
sed -i '' 's/\.ico/\.png/g' app.json

echo "✅ Conversion complete!"
echo "Please rebuild your app to use the new PNG files."