import React from 'react';

// Added multiple roles to align closely with the problem statement requirement
const ElectionGuide = ({ currentRole, onRoleChange, currentLanguage, onLanguageChange }) => {

  const contentMap = {
    'general citizen': "Ensure you check your registration status at least 30 days before the election. Bring a valid state ID to the polling station.",
    'first-time voter': "Welcome! Step 1: Register online. Step 2: Research your ballot options. Step 3: Find your polling location and bring any necessary identification.",
    'student': "Students can often choose to register at their home address or campus address. Decide where you wish to vote and register appropriately before the deadline.",
    'journalist': "Verify press credential deadlines. Polling places may restrict camera access, so consult the local election board guidelines for media access.",
    'election volunteer': "Thank you for volunteering! Ensure you attend the mandatory poll worker training sessions and arrive at 5:30 AM on Election Day to set up."
  };

  return (
    <article className="glass-panel" aria-labelledby="guide-title">
      <h2 id="guide-title">Personalized Guide Configuration</h2>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Role Selection */}
        <div style={{ flex: '1 1 200px' }}>
          <label htmlFor="role-select" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>I am a:</label>
          <select 
            id="role-select" 
            value={currentRole} 
            onChange={(e) => onRoleChange(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #475569' }}
            aria-label="Select your voter profile"
          >
            <option value="general citizen">General Citizen</option>
            <option value="first-time voter">First-Time Voter</option>
            <option value="student">Student</option>
            <option value="journalist">Journalist</option>
            <option value="election volunteer">Election Volunteer</option>
          </select>
        </div>

        {/* Language Selection */}
        <div style={{ flex: '1 1 150px' }}>
          <label htmlFor="lang-select" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Language:</label>
          <select 
            id="lang-select" 
            value={currentLanguage} 
            onChange={(e) => onLanguageChange(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid #475569' }}
            aria-label="Select your preferred language"
          >
            <option value="english">English (Default)</option>
            <option value="spanish">Español</option>
            <option value="simple">Simple English Mode</option>
          </select>
        </div>
      </div>

      <div 
        role="region" 
        aria-live="polite" 
        style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--accent)' }}
      >
        <p tabIndex="0">{contentMap[currentRole]}</p>
      </div>
    </article>
  );
};

export default React.memo(ElectionGuide);
