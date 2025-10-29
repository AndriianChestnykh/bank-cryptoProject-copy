import React from 'react';
import { CSS_CLASSES, LABELS, PRICING } from '../constants';

export default function MarketPricing({
  isExpanded,
  onToggle,
  cryptoPrice,
  onPriceChange,
  onResetPrice,
  initialPrice
}) {
  return (
    <div className={CSS_CLASSES.CARD_BG}>
      <h3 className="font-medium flex justify-between items-center">
        {LABELS.MARKET_PRICING}
        <button
          onClick={onToggle}
          className="ml-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          aria-expanded={isExpanded}
        >
          <svg
            className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </h3>
      {isExpanded && (
        <div className="mt-3">
          <label className="text-xs text-gray-500">{LABELS.BTC_PRICE_USD}</label>
          <div className="mt-1 flex gap-2 items-center">
            <input
              type="number"
              value={cryptoPrice}
              min={PRICING.MIN_CRYPTO_PRICE}
              max={PRICING.MAX_CRYPTO_PRICE}
              step={PRICING.PRICE_STEP}
              onChange={onPriceChange}
              className={CSS_CLASSES.INPUT_FIELD}
            />
            <button
              className="px-3 py-2 bg-gray-500 text-white rounded"
              onClick={onResetPrice}
            >
              Reset
            </button>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {LABELS.RATES_API_NOTE}
          </div>
        </div>
      )}
    </div>
  );
}

