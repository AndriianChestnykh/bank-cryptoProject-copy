import React from 'react';
import { VIEW_MODES, LABELS } from '../constants';

/**
 * Reusable navigation component
 * @param {Object} props
 * @param {string} props.currentView - Current view mode
 * @param {Function} props.onViewChange - View change callback
 * @param {string} props.title - Application title
 */
export default function Navigation({ currentView, onViewChange, title = 'Bank Crypto Simulator' }) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex gap-4">
            <button
              onClick={() => onViewChange(VIEW_MODES.DETAILED)}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentView === VIEW_MODES.DETAILED
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {LABELS.DETAILED_VIEW}
            </button>
            <button
              onClick={() => onViewChange(VIEW_MODES.SIMPLIFIED)}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentView === VIEW_MODES.SIMPLIFIED
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {LABELS.SIMPLIFIED_VIEW}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

