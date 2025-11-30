import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const lightTheme = {
  background: "#ffffff",
  text: "#111111",
  textSecondary: "#666666",
  border: "#f0f0f0",
  cardBackground: "#f6f7fb",
  icon: "#111111",
  iconSecondary: "#666666",
  inputBackground: "#ffffff",
  inputBorder: "#e6e9ef",
  primary: "#246bff",
  onPrimary: "#ffffff",
};

export const darkTheme = {
  background: "#121212",
  text: "#ffffff",
  textSecondary: "#aaaaaa",
  border: "#333333",
  cardBackground: "#1e1e1e",
  icon: "#ffffff",
  iconSecondary: "#aaaaaa",
  inputBackground: "#2c2c2c",
  inputBorder: "#444444",
  primary: "#246bff",
  onPrimary: "#ffffff",
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
