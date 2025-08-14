import { useEffect, useState } from 'react';

/**
 * Hook to detect system theme preference and listen for changes
 * Returns { isDarkMode: boolean }
 */
export default function useDarkMode() {
  const getPref = () =>
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [isDarkMode, setIsDarkMode] = useState(getPref);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = e => setIsDarkMode(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  return { isDarkMode };
}
