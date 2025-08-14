import { useState, useEffect } from 'react';

/**
 * Debounces a value so it only changes after the delay passes without further updates.
 * @param {*} value - The value to debounce
 * @param {number} delay - Delay in ms
 * @returns {*} - The debounced value
 */
export default function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
