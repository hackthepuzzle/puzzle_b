import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { ErrorBoundary } from 'react-error-boundary';

// Lazy load components for Efficiency / Performance
const Chatbot = React.lazy(() => import('./components/Chatbot'));
const Timeline = React.lazy(() => import('./components/Timeline'));
const ElectionGuide = React.lazy(() => import('./components/ElectionGuide'));
const MapComponent = React.lazy(() => import('./components/MapComponent'));

function FallbackUI({ error }) {
  return (
    <div role="alert" style={{ padding: '2rem', color: '#ef4444' }}>
      <p>Something went wrong:</p>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
    </div>
  );
}

function Loader() {
  return <div aria-live="polite" className="app-container" style={{ textAlign: 'center' }}>Loading modules...</div>;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('general citizen');
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="app-container">
      {/* Semantic header for Accessibility flow */}
      <header role="banner">
        <h1 tabIndex="0">ElectoGuide</h1>
        <p tabIndex="0" aria-label="Subtitle: Your Smart Election Process Assistant">Your Smart Election Process Assistant</p>
        {user && (
          <button className="btn" aria-label="Sign out of your account" style={{marginTop: '1rem'}} onClick={handleLogout}>Sign Out</button>
        )}
      </header>

      <main role="main">
        {!user ? (
          <section className="auth-container" aria-labelledby="auth-title">
            <div className="glass-panel auth-panel">
              <h2 id="auth-title">Welcome to ElectoGuide</h2>
              <p>Please sign in to access personalized election guidance, find your polling station, and get reminders.</p>
              <button className="btn" onClick={handleLogin} aria-label="Sign in with your Google Account">Sign in with Google</button>
            </div>
          </section>
        ) : (
          <ErrorBoundary FallbackComponent={FallbackUI}>
            <div className="dashboard-grid">
              
              {/* Left Column Modules */}
              <section className="left-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} aria-labelledby="guide-title">
                <Suspense fallback={<Loader />}>
                  <ElectionGuide 
                    user={user} 
                    currentRole={role} 
                    onRoleChange={setRole} 
                    currentLanguage={language}
                    onLanguageChange={setLanguage}
                  />
                  <Timeline role={role} />
                  <MapComponent />
                </Suspense>
              </section>
              
              {/* Right Column Modules */}
              <section className="right-panel" aria-labelledby="assistant-title">
                <Suspense fallback={<Loader />}>
                  <Chatbot user={user} role={role} language={language} />
                </Suspense>
              </section>

            </div>
          </ErrorBoundary>
        )}
      </main>
    </div>
  );
}

export default App;
