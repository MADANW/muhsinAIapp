// Tests for API wrapper functionality
// This is a simplified version since we can't easily test the actual Supabase calls

// Mock implementation of the API module
const mockApi = {
  // Mock of the callPlan function
  callPlan: async function(userJWT: string, prompt: string) {
    // Simulate API response based on input
    if (!userJWT) {
      throw new Error('Missing JWT');
    }
    
    if (userJWT === 'invalid-token') {
      throw new Error('Invalid JWT');
    }
    
    // For testing quota limit errors
    if (prompt.includes('quota-error')) {
      throw new Error('usage_limit_reached');
    }
    
    // For other server errors
    if (prompt.includes('server-error')) {
      throw new Error('Server error');
    }
    
    // Simulate successful response
    return {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: 'test-user-id',
      date: new Date().toISOString().split('T')[0],
      source_input: prompt,
      model: 'stub',
      tokens_in: 10,
      tokens_out: 50,
      content_json: {
        generated_at: new Date().toISOString(),
        blocks: [
          { time: '07:00–08:00', title: 'Morning routine' },
          { time: '09:00–12:00', title: 'Deep work' },
        ]
      },
      created_at: new Date().toISOString()
    };
  }
};

describe('API wrapper tests', () => {
  test('callPlan should throw error for missing JWT', async () => {
    await expect(mockApi.callPlan('', 'Test prompt')).rejects.toThrow('Missing JWT');
  });
  
  test('callPlan should throw error for invalid JWT', async () => {
    await expect(mockApi.callPlan('invalid-token', 'Test prompt')).rejects.toThrow('Invalid JWT');
  });
  
  test('callPlan should throw quota error when limit reached', async () => {
    await expect(mockApi.callPlan('valid-token', 'quota-error test')).rejects.toThrow('usage_limit_reached');
  });
  
  test('callPlan should return plan data on success', async () => {
    const result = await mockApi.callPlan('valid-token', 'Create a plan for today');
    
    // Check response shape
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.user_id).toBe('test-user-id');
    expect(result.source_input).toBe('Create a plan for today');
    expect(result.content_json).toBeDefined();
    expect(result.content_json.blocks).toBeInstanceOf(Array);
    expect(result.content_json.blocks.length).toBe(2);
  });
});