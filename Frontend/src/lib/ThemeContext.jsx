import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useThemeContext = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage or system preference on load
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [roleTheme, setRoleTheme] = useState(() => {
    return localStorage.getItem('roleTheme') || 'employee';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const root = window.document.documentElement;
    // Remove all theme classes first
    root.classList.remove('theme-admin', 'theme-manager', 'theme-employee');
    
    // Add current theme class
    if (roleTheme !== 'employee') {
      root.classList.add(`theme-${roleTheme}`);
    }
    localStorage.setItem('roleTheme', roleTheme);
  }, [roleTheme]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setRole = (role) => {
    // Valid roles: admin, manager, employee
    setRoleTheme(role.toLowerCase());
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, roleTheme, setRole }}>
      {children}
    </ThemeContext.Provider>
  );
};
