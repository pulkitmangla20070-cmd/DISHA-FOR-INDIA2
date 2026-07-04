import React, { useState } from 'react';
import { format, subMonths, startOfWeek, startOfMonth, endOfMonth, subYears } from 'date-fns';

/**
 * FilterBar – reusable date range filter.
 * Emits the selected period string (e.g., 'today', 'this_week') and optional custom range.
 */
const periods = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'this_week' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Last 3 Months', value: 'last_3_months' },
  { label: 'Last 6 Months', value: 'last_6_months' },
  { label: 'Last Year', value: 'last_year' },
  { label: 'Custom Range', value: 'custom' },
];

const FilterBar = ({ onChange }) => {
  const [selected, setSelected] = useState('this_month');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const handleSelect = (e) => {
    const value = e.target.value;
    setSelected(value);
    if (value !== 'custom') {
      onChange({ period: value });
    }
  };

  const applyCustom = () => {
    if (customStart && customEnd) {
      onChange({ period: 'custom', start: customStart, end: customEnd });
    }
  };

  return (
    <div className="flex items-center space-x-4 mb-4">
      <select
        value={selected}
        onChange={handleSelect}
        className="border rounded p-2"
        aria-label="Select date period"
      >
        {periods.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
      {selected === 'custom' && (
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="border rounded p-1"
            aria-label="Custom start date"
          />
          <span>to</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="border rounded p-1"
            aria-label="Custom end date"
          />
          <button
            onClick={applyCustom}
            className="bg-primary text-white px-3 py-1 rounded"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
