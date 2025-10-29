import React from 'react';
import { CSS_CLASSES } from '../constants';
import { formatCurrency, getCurrencyType } from '../utils/currencyFormatting';

export default function BalanceCard({
  label,
  value,
  currency = 'USD',
  showSlider = false,
  min = 0,
  max = 1000000,
  step = 1000,
  onSliderChange,
  additionalInfo,
  cryptoPrice = null
}) {
  const currencyType = getCurrencyType(currency);
  const formattedValue = formatCurrency(value, currencyType, cryptoPrice);
  const isCryptoWithUsd = typeof formattedValue === 'object' && formattedValue.mainValue;

  return (
    <div className={CSS_CLASSES.BALANCE_CARD}>
      <div className={CSS_CLASSES.MONO_FONT}>
        {isCryptoWithUsd ? formattedValue.mainValue : formattedValue}
      </div>
      {isCryptoWithUsd && (
        <div className="text-sm text-gray-400 mt-2">{formattedValue.usdEquivalent}</div>
      )}
      {additionalInfo && (
        <div className="text-sm text-gray-400 mt-2">{additionalInfo}</div>
      )}
      {showSlider && (
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onSliderChange}
          className={CSS_CLASSES.RANGE_SLIDER}
        />
      )}
    </div>
  );
}

