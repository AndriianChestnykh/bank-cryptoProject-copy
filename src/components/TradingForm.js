import React from 'react';
import { CSS_CLASSES, LABELS } from '../constants';

export default function TradingForm({ title, fields }) {
  return (
    <div className={CSS_CLASSES.WHITE_CARD + ' space-y-3 flex flex-col h-full'}>
      <h3 className="font-medium">{title}</h3>
      <div className="flex-1 space-y-3">
        {fields.map((field, index) => (
          <div key={index}>
            <label className="text-xs text-gray-500">
              {field.label} (max {field.maxValue.toFixed(2)})
            </label>
            <div className="mt-3 grid grid-cols-1 gap-2">
              <input
                type="number"
                min="0"
                max={field.maxValue}
                step={field.step || 1000}
                value={field.value}
                onChange={field.onChange}
                className={CSS_CLASSES.INPUT_FIELD}
              />
              {field.preview && (
                <div className="text-sm text-gray-600">
                  {field.preview}
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={field.onSubmit}
                  className={`flex-1 ${field.submitButtonClass || CSS_CLASSES.BUTTON_SUCCESS}`}
                >
                  {field.submitButtonText}
                </button>
                <button
                  onClick={field.onMax}
                  className={CSS_CLASSES.BUTTON_MAX}
                >
                  {LABELS.MAX}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

