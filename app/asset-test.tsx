// Test file to verify asset imports
import { Image } from 'expo-image';
import React from 'react';
import { Text, View } from 'react-native';

export default function AssetTest() {
  // Test different ways to import the image
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Testing Asset Import</Text>
      
      {/* Method 1: Direct path */}
      <Image
        source={require('../assets/images/logo.ico')}
        style={{ width: 100, height: 100 }}
      />
      
      {/* Method 2: Using asset from app.json */}
      <Image
        source={require('../assets/images/nobg.ico')}
        style={{ width: 100, height: 100 }}
      />
    </View>
  );
}