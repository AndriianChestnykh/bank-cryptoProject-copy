import React from 'react';
import { CSS_CLASSES, LABELS } from '../constants';

/**
 * Reusable transaction history component
 * @param {Array} props.history - Array of transaction objects
 */
export default function TransactionHistory({ history = [] }) {
  return (
    <div className={CSS_CLASSES.HISTORY_CONTAINER}>
      <h3 className="text-xl font-semibold mb-4">{LABELS.TRANSACTION_HISTORY}</h3>
      <div className={CSS_CLASSES.HISTORY_LIST}>
        {history.length === 0 && (
          <div className="text-gray-400">{LABELS.NO_TRANSACTIONS}</div>
        )}
        <ul className="space-y-2">
          {history.map(tx => (
            <li key={tx.id} className="p-3 bg-white rounded shadow-sm">
              <div className="font-medium text-gray-800">{tx.type}</div>
              <div className="text-xs text-gray-600">{tx.details}</div>
              <div className="text-xs text-gray-400">{tx.timestamp}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

