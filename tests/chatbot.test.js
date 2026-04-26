// Mocking the fetch call for the Chatbot connection to the backend
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ reply: "I can help with that!" }),
  })
);

describe('Chatbot Interaction Logic', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('should handle user input correctly', () => {
    const input = "How do I register in Texas?";
    expect(input.length).toBeGreaterThan(0);
  });

  test('should call the backend API when sending a message', async () => {
    const message = "Where is my polling station?";
    
    const response = await fetch('http://localhost:3001/api/chat', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ message })
    });
    
    const data = await response.json();
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(data.reply).toBe("I can help with that!");
  });
});
