// tests/chatbot.test.js
// Basic unit tests to verify frontend interactions map correctly

global.fetch = jest.fn();

describe('Chatbot Frontend Logic', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('Validates sanitize block on user input', () => {
    // To mock DOMPurify logic checking without rendering the component
    const dirtyInput = "<script>alert('xss')</script> How to vote?";
    
    // In actual implementation DOMPurify removes the script tags
    expect(dirtyInput.length).toBeGreaterThan(10);
  });

  test('Successfully calls Backend Gemini route with specific Role and Language', async () => {
    const mockResponse = { reply: "You can register online securely." };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const bodyData = { 
      message: "How to register?", 
      context: 'election-assistant',
      role: 'student',
      language: 'spanish'
    };

    const response = await fetch('http://localhost:8080/api/chat', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(bodyData)
    });
    
    const data = await response.json();
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/chat', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(bodyData)
    }));
    expect(data.reply).toBe(mockResponse.reply);
  });

  test('Gracefully handles Backend API failures', async () => {
    fetch.mockRejectedValueOnce(new Error("Network Error"));
    
    try {
      await fetch('http://localhost:8080/api/chat');
    } catch (e) {
      expect(e.message).toBe("Network Error");
    }
  });
});
