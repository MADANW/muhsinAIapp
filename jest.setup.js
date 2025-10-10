// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
}));

// Add these if you want to extend with custom matchers
// We'll leave this commented out for now since we're having issues
// import '@testing-library/jest-native/extend-expect';

// Mock any other dependencies as needed