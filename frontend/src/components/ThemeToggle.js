import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <FaSun className="text-yellow-400 text-lg" />
      ) : (
        <FaMoon className="text-gray-600 text-lg" />
      )}
    </button>
  );
};

export default ThemeToggle;
