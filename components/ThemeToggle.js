'use client';
import { Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
    } else {
      // Default to light theme
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save theme preference
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      console.log('Theme toggled from', prevTheme, 'to', newTheme);
      return newTheme;
    });
  };

  if (!mounted) {
    return (
      <button
        className="p-1 rounded hover:bg-gray-700 transition-colors"
        aria-label="Toggle theme"
      >
        <Lightbulb className="w-4 h-4 text-gray-400" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-1 rounded hover:bg-gray-700 transition-colors focus:outline-none"
      aria-label="Toggle theme"
    >
      <Lightbulb 
        className={`w-4 h-4 transition-colors ${
          theme === 'light' 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-400 fill-gray-400'
        }`} 
      />
    </button>
  );
}
