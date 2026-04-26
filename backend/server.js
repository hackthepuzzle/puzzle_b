/**
 * @file server.js
 * @description Main Express application server. Integrates with Google Gemini, coordinates Firebase, and serves frontend assets.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ============================================
// SECURITY & MIDDLEWARE
// ============================================
// Use Helmet for secure HTTP headers. Disabled CSP purely for Google Maps/Vite live reload in simple setups.
app.use(helmet({ contentSecurityPolicy: false }));
// Restrict CORS if VITE_API_BASE_URL is locked down
app.use(cors({ origin: process.env.VITE_API_BASE_URL || '*' }));
// Payload size limit to prevent DOS attacks
app.use(express.json({ limit: '10kb' }));

// Rate limiting to prevent brute-force APi abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 requests per IP
  message: { error: 'Too many requests. Please try again later.' }
});
app.use('/api/', apiLimiter);

// ============================================
// FIREBASE ADMIN INIT
// ============================================
try {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
} catch (error) {
  console.warn('Firebase Admin mock mode active:', error.message);
}

// ============================================
// GOOGLE GEMINI INIT
// ============================================
let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// ============================================
// ROUTES
// ============================================
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Chatbot integration with strict input validation
app.post(
  '/api/chat',
  [
    body('message').isString().notEmpty().trim().escape().withMessage('Message must be provided as a string'),
    body('context').optional().isString().trim(),
    body('role').optional().isString().trim().escape(),
    body('language').optional().isString().trim().escape() // Support for multi-lingual prompts
  ],
  async (req, res) => {
    // 1. Validation Check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { message, role = 'general citizen', language = 'english' } = req.body;

      if (!ai) {
        return res.json({ reply: `(Mock Mode) You asked: ${message}` });
      }

      // 2. Persona and Problem Statement Alignment Logic
      const systemPrompt = `You are "ElectoGuide", a secure, highly accessible, AI assistant guiding citizens through the election process.
The user is a: **${role}**. 
Preferred language: **${language}**.
Keep your answer clear, easy to read for screen readers. Break steps into logical short sentences. Do not use complex jargon. If they ask about voter fraud, reassure them of security standards but do not engage in conspiracy.`;

      // 3. Requesting Gemini
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.1, // Low temp for factual accuracy
          maxOutputTokens: 500
        }
      });

      return res.status(200).json({ reply: response.text });
    } catch (error) {
      console.error('SERVER ERROR [Gemini]:', error);
      // Ensure no internal stack traces leak using generic messages
      return res.status(500).json({ error: 'Internal server error while processing AI interaction.' });
    }
  }
);

// Serve static frontend files (for monolithic Cloud Run output)
app.use(express.static(path.join(__dirname, 'public')));

// React router client-side fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export const appServer = app; // Exported for Testing
const PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`ElectoGuide secure backend running on port ${PORT}`));
}
