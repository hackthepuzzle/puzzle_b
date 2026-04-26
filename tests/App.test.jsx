import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';
import Chatbot from '../src/components/Chatbot';

// Mocks
jest.mock('../src/firebase', () => ({
  auth: { onAuthStateChanged: jest.fn((auth, cb) => cb({ displayName: 'Test User' })) },
  googleProvider: {}
}));

describe('App Component Accessibility & UI Testing', () => {
  test('Renders standard App headers and respects ARIA tags', async () => {
    render(<App />);

    // Fast loading resolution fallback check
    await waitFor(() => {
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
    expect(screen.getByText(/ElectoGuide/i)).toBeInTheDocument();
  });
});

describe('Chatbot Component Testing', () => {
  test('Sends input natively and renders', async () => {
    // Stub global fetch for chat
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ reply: "Testing reply" }),
        })
    );

    render(<Chatbot user={{ displayName: 'Tester' }} role="citizen" language="english" />);
    
    // Simulate Input Event
    const inputField = screen.getByLabelText(/Ask a question.../i);
    const sendButton = screen.getByRole('button', { name: /Send message/i });

    fireEvent.change(inputField, { target: { value: 'Is this working?' } });
    expect(inputField.value).toBe('Is this working?');
    
    // Validate Submit Event
    fireEvent.click(sendButton);
    expect(inputField.value).toBe('');

    await waitFor(() => {
        expect(screen.getByText('Testing reply')).toBeInTheDocument();
    });
  });
});
