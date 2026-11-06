import React, { useState, useEffect } from 'react';
import RegistrationPortal from './components/Auth/RegistrationPortal';
import VisionDashboard from './components/Dashboard/VisionDashboard';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('agahi_authenticated_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const handleAuthenticate = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('agahi_authenticated_user', JSON.stringify(userData));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('agahi_authenticated_user');
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) {
    return <RegistrationPortal onAuthenticate={handleAuthenticate} />;
  }

  return <VisionDashboard user={user} onLogout={handleLogout} />;
}
