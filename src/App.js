import React, { useState } from 'react';
import BankCryptoSimulator from './BankCryptoSimulator';
import SimplifiedBankCrypto from './SimplifiedBankCrypto';
import './App.css';

function App() {
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed' or 'simplified'

  return (
    <div className="App">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Bank Crypto Simulator</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  viewMode === 'detailed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Detailed View
              </button>
              <button
                onClick={() => setViewMode('simplified')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  viewMode === 'simplified'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Simplified View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'detailed' ? <BankCryptoSimulator /> : <SimplifiedBankCrypto />}
    </div>
  );
}

export default App;
