import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

/**
 * Cross-platform storage utility that works on web and mobile
 * Uses AsyncStorage on mobile and localStorage on web
 */
export class Storage {
  static async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn('localStorage getItem failed:', error);
        return null;
      }
    }
    return AsyncStorage.getItem(key);
  }

  static async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
        return;
      } catch (error) {
        console.warn('localStorage setItem failed:', error);
        return;
      }
    }
    return AsyncStorage.setItem(key, value);
  }

  static async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
        return;
      } catch (error) {
        console.warn('localStorage removeItem failed:', error);
        return;
      }
    }
    return AsyncStorage.removeItem(key);
  }

  static async clear(): Promise<void> {
    if (Platform.OS === 'web') {
      try {
        localStorage.clear();
        return;
      } catch (error) {
        console.warn('localStorage clear failed:', error);
        return;
      }
    }
    return AsyncStorage.clear();
  }
}