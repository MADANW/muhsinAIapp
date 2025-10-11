// Test file to verify asset imports
import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';
import { Assets } from './lib/assetRegistry';

export default function AssetTest() {
  // Test different ways to import the image using the asset registry
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Testing Asset Import</Text>
      
      {/* Method 1: Using asset registry */}
      <Image
        source={Assets.logos.logo}
        style={{ width: 100, height: 100 }}
        contentFit="contain"
      />
      
      {/* Method 2: Using nobg logo */}
      <Image
        source={Assets.logos.nobg}
        style={{ width: 100, height: 100 }}
        contentFit="contain"
      />
      
      {/* Method 3: Using inverse logo */}
      <Image
        source={Assets.logos.inverse}
        style={{ width: 100, height: 100 }}
        contentFit="contain"
      />
    </View>
  );
}