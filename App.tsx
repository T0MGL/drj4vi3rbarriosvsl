import React, { useState, useEffect } from 'react';
import { LinktreeView } from './components/LinktreeView';
import { LandingPage } from './components/LandingPage';
import { CRM } from './components/CRM';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'links' | 'landing' | 'crm'>('links');

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/crm' || path.includes('crm')) {
      setCurrentView('crm');
    }
  }, []);

  if (currentView === 'crm') {
    return <CRM />;
  }

  if (currentView === 'landing') {
    return <LandingPage />;
  }

  return (
    <LinktreeView onEnterSite={() => setCurrentView('landing')} />
  );
};

export default App;
