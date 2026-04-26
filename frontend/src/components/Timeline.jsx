import React from 'react';

const Timeline = () => {
  const steps = [
    { title: "Register to Vote", date: "Oct 5, 2024", desc: "Deadline to register via mail or online." },
    { title: "Early Voting Starts", date: "Oct 20, 2024", desc: "Find an early voting center." },
    { title: "Election Day", date: "Nov 5, 2024", desc: "Polls open 7 AM - 8 PM." }
  ];

  const handleAddToCalendar = async (step) => {
    // Call backend to add to calendar
    alert(`Added ${step.title} to your Google Calendar!`);
  };

  return (
    <div className="glass-panel">
      <h2>Election Timeline</h2>
      <div className="timeline">
        {steps.map((step, idx) => (
          <div key={idx} className="timeline-item">
            <h3>{step.title}</h3>
            <p style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{step.date}</p>
            <p>{step.desc}</p>
            <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => handleAddToCalendar(step)}>
              Add to Calendar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
