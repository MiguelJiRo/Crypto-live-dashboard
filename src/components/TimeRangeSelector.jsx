import { TIME_RANGES } from '../services/cryptoApi';

const TimeRangeSelector = ({ selectedRange, onRangeChange }) => {
  return (
    <div className="time-range-selector">
      {Object.entries(TIME_RANGES).map(([key, { label }]) => (
        <button
          key={key}
          className={`range-button ${selectedRange === key ? 'active' : ''}`}
          onClick={() => onRangeChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;
