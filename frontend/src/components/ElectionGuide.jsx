import React, { useState } from 'react';

const ElectionGuide = ({ user }) => {
  const [role, setRole] = useState('citizen');

  const content = {
    citizen: "As a general citizen, ensure you check your registration status at least 30 days before the election. Bring a valid state ID.",
    first_time: "Welcome, first-time voter! Step 1: Register online. Step 2: Research your ballot. Step 3: Find your polling location and bring ID.",
    student: "Students can often choose to register at their home address or their campus address. Decide where you want to vote and register accordingly."
  };

  return (
    <div className="glass-panel">
      <h2>Personalized Guide</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="role-select" style={{ marginRight: '1rem' }}>I am a:</label>
        <select 
          id="role-select" 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '0.25rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #475569' }}
        >
          <option value="citizen">General Citizen</option>
          <option value="first_time">First-Time Voter</option>
          <option value="student">Student</option>
        </select>
      </div>
      <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--accent)' }}>
        <p>{content[role]}</p>
      </div>
    </div>
  );
};

export default ElectionGuide;
