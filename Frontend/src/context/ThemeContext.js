import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const lightTheme = {
  type: "light",
  background: "#f4f6f9", // Slight cool grey tint
  surface: "#ffffff",
  surfaceHighlight: "#f8f9fa",
  text: "#1a1b1e",
  textSecondary: "#6c757d",
  border: "#eaecef",
  cardBackground: "#ffffff",
  icon: "#2c3e50",
  iconSecondary: "#95a5a6",
  inputBackground: "#f8f9fa",
  inputBorder: "#ced4da",
  primary: "#246bff", // Keep brand blue
  secondary: "#6c5ce7", // Accent purple
  success: "#00b894",
  danger: "#d63031",
  onPrimary: "#ffffff",
  gradient: ["#246bff", "#6c5ce7"], // Blue to Purple
};

export const darkTheme = {
  type: "dark",
  background: "#0f1115", // Very dark blue-grey, not pure black
  surface: "#181a20",
  surfaceHighlight: "#262a34",
  text: "#ffffff",
  textSecondary: "#a0a0a0",
  border: "#2d3436",
  cardBackground: "#181a20",
  icon: "#dfe6e9",
  iconSecondary: "#636e72",
  inputBackground: "#262a34",
  inputBorder: "#353b48",
  primary: "#246bff",
  secondary: "#a29bfe",
  success: "#00cec9",
  danger: "#ff7675",
  onPrimary: "#ffffff",
  gradient: ["#246bff", "#a29bfe"],
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
