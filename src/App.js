import React, { useState } from 'react';
import BankCryptoSimulator from './BankCryptoSimulator';
import SimplifiedBankCrypto from './SimplifiedBankCrypto';
import Navigation from './components/Navigation';
import { VIEW_MODES } from './constants';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState(VIEW_MODES.DETAILED);

  const renderContent = () => {
    switch (currentView) {
      case VIEW_MODES.DETAILED:
        return <BankCryptoSimulator />;
      case VIEW_MODES.SIMPLIFIED:
        return <SimplifiedBankCrypto />;
      default:
        return <BankCryptoSimulator />;
    }
  };

  return (
    <div className="App">
      <Navigation 
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      {renderContent()}
    </div>
  );
}

export default App;
