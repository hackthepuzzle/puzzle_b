// tests/api.test.js
import request from 'supertest';
import { appServer } from '../backend/server.js'; // Requires export appServer from server.js

describe('Backend API Controller Tests', () => {
  
  test('GET /api/health should return healthy status', async () => {
    const response = await request(appServer).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('timestamp');
  });

  describe('POST /api/chat Gemini Integration', () => {
    
    test('Should return 400 when message body is missing', async () => {
      const response = await request(appServer)
        .post('/api/chat')
        .send({ role: 'student' });
        
      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe('Message must be provided as a string');
    });

    test('Should return mocked response if Gemini API key absent', async () => {
      const payload = {
        message: "Where do I vote?",
        role: "journalist",
        language: "english"
      };

      const response = await request(appServer)
        .post('/api/chat')
        .send(payload);
        
      // Will return 200 Mock fallback because process.env.GEMINI_API_KEY is null in test setup
      expect(response.status).toBe(200);
      expect(response.body.reply).toMatch(/\(Mock Mode\) You asked: Where do I vote\?/);
    });

  });
});
