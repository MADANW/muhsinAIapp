// Basic test file to ensure Jest is working
// Due to the Expo setup complexities, we'll start with a simple test

// Mock of store logic for testing purposes
const mockStore = {
  // Storage keys
  STORAGE_KEYS: {
    isPro: 'muhsin:isPro',
    usageCount: 'muhsin:usageCount',
  },
  
  // State
  state: {
    isPro: false,
    usageCount: 0
  },
  
  // Methods
  setPro: function(value: boolean) {
    this.state.isPro = value;
    return Promise.resolve();
  },
  
  incUsage: function() {
    this.state.usageCount += 1;
    return Promise.resolve();
  },
  
  resetUsage: function() {
    this.state.usageCount = 0;
    return Promise.resolve();
  }
};

// Tests
describe('Store functionality tests', () => {
  test('setPro should update isPro state', async () => {
    expect(mockStore.state.isPro).toBe(false);
    await mockStore.setPro(true);
    expect(mockStore.state.isPro).toBe(true);
  });
  
  test('incUsage should increment usageCount state', async () => {
    mockStore.state.usageCount = 0;
    
    await mockStore.incUsage();
    expect(mockStore.state.usageCount).toBe(1);
    
    await mockStore.incUsage();
    expect(mockStore.state.usageCount).toBe(2);
    
    await mockStore.incUsage();
    expect(mockStore.state.usageCount).toBe(3);
  });
  
  test('resetUsage should set usageCount to 0', async () => {
    mockStore.state.usageCount = 5;
    await mockStore.resetUsage();
    expect(mockStore.state.usageCount).toBe(0);
  });
  
  test('STORAGE_KEYS should be correctly defined', () => {
    expect(mockStore.STORAGE_KEYS.isPro).toBe('muhsin:isPro');
    expect(mockStore.STORAGE_KEYS.usageCount).toBe('muhsin:usageCount');
  });
});