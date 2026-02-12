import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { CRM } from './components/CRM';
import { ThankYouPage } from './components/ThankYouPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/gracias" element={<ThankYouPage />} />
        <Route path="/crm" element={<CRM />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
