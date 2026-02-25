import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeContext } from '../lib/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-sec-card-bg text-text-sec hover:text-text-main hover:bg-border-color transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;
