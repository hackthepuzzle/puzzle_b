import React, { useState, useEffect } from 'react';
import Chatbot from './components/Chatbot';
import Timeline from './components/Timeline';
import ElectionGuide from './components/ElectionGuide';
import MapComponent from './components/MapComponent';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) return <div className="app-container">Loading...</div>;

  return (
    <div className="app-container">
      <header>
        <h1>ElectoGuide</h1>
        <p>Your Smart Election Process Assistant</p>
        {user ? (
          <button className="btn" style={{marginTop: '1rem'}} onClick={handleLogout}>Sign Out</button>
        ) : null}
      </header>

      {!user ? (
        <div className="auth-container">
          <div className="glass-panel auth-panel">
            <h2>Welcome to ElectoGuide</h2>
            <p>Please sign in to access personalized election guidance, find your polling station, and get reminders.</p>
            <button className="btn" onClick={handleLogin}>Sign in with Google</button>
          </div>
        </div>
      ) : (
        <main className="dashboard-grid">
          <section className="left-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <ElectionGuide user={user} />
            <Timeline />
            <MapComponent />
          </section>
          
          <section className="right-panel">
            <Chatbot user={user} />
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
