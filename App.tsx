import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { CRM } from './components/CRM';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'crm'>('landing');

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/crm' || path.includes('crm')) {
      setCurrentView('crm');
    }
  }, []);

  if (currentView === 'crm') {
    return <CRM />;
  }

  return <LandingPage />;
};

export default App;
