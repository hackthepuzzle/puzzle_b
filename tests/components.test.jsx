import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ElectionGuide from '../src/components/ElectionGuide';
import Timeline from '../src/components/Timeline';

describe('ElectionGuide Component', () => {
  test('Renders different roles correctly', () => {
    const onRoleChange = jest.fn();
    const onLanguageChange = jest.fn();
    
    // Test base role
    const { rerender } = render(
      <ElectionGuide currentRole="journalist" onRoleChange={onRoleChange} currentLanguage="english" onLanguageChange={onLanguageChange} />
    );
    expect(screen.getByText(/Verify press credential deadlines/i)).toBeInTheDocument();

    // Trigger Role Change
    const roleSelect = screen.getByLabelText(/Select your voter profile/i);
    fireEvent.change(roleSelect, { target: { value: 'first-time voter' } });
    expect(onRoleChange).toHaveBeenCalledWith('first-time voter');

    // Re-render to simulate parent passing new props
    rerender(
      <ElectionGuide currentRole="first-time voter" onRoleChange={onRoleChange} currentLanguage="english" onLanguageChange={onLanguageChange} />
    );
    expect(screen.getByText(/Welcome! Step 1: Register online./i)).toBeInTheDocument();
  });
});

describe('Timeline Component', () => {
  test('Filters steps dynamically based on role', () => {
    const { rerender } = render(<Timeline role="general citizen" />);
    // Volunteer training should NOT be present
    expect(screen.queryByText(/Poll Worker Training/i)).not.toBeInTheDocument();

    // Re-render with volunteer role
    rerender(<Timeline role="volunteer" />);
    expect(screen.getByText(/Poll Worker Training/i)).toBeInTheDocument();
  });
});
