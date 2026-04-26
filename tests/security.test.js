// tests/security.test.js
import request from 'supertest';
import { appServer } from '../backend/server.js';

describe('Backend Security Configuration', () => {
  
  test('Should restrict payload size limits on JSON body (Efficiency & Security)', async () => {
    // Generate a payload over 10kb
    const hugeMessage = "A".repeat(11000); 
    const response = await request(appServer)
      .post('/api/chat')
      .send({ message: hugeMessage });

    expect(response.status).toBe(413); // Payload Too Large
  });

  test('Should validate and filter out extreme XSS scripts on input layer', async () => {
    const maliciousPayload = {
      message: "<script>alert('Stealing Data')</script> Who is voting?"
    };

    const response = await request(appServer)
      .post('/api/chat')
      .send(maliciousPayload);

    // Express-validator's .escape() converts special characters
    expect(response.status).toBe(200);
    expect(response.body.reply).not.toContain("<script>");
  });

  test('Should have Helmet security headers present', async () => {
    const response = await request(appServer).get('/api/health');
    expect(response.headers).toHaveProperty('x-xss-protection');
    expect(response.headers).toHaveProperty('x-frame-options');
  });

});
