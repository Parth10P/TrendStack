import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const lightTheme = {
  type: "light",
  background: "#f8f9fa",
  surface: "#ffffff",
  surfaceHighlight: "#e9ecef",
  text: "#1a1b1e",
  textSecondary: "#6c757d",
  border: "#ced4da",
  cardBackground: "#ffffff",
  icon: "#2c3e50",
  iconSecondary: "#95a5a6",
  inputBackground: "#f4f7fb",
  inputBorder: "#ced4da",
  primary: "#19be64", // Adjusted for green aesthetic
  secondary: "#6dfe9c", 
  success: "#00b894",
  danger: "#d63031",
  onPrimary: "#ffffff",
  gradient: ["#19be64", "#0b8a4f"], 
};

export const darkTheme = {
  type: "dark",
  background: "#060e20", // Bioluminescent Base
  surface: "#0f1930", // surface_container
  surfaceHighlight: "#141f38", // surface_container_high
  text: "#dee5ff", // on_surface
  textSecondary: "#a3aac4", // on_surface_variant
  border: "#40485d", // outline_variant at low opacity
  cardBackground: "#091328", // surface_container_low
  icon: "#dee5ff",
  iconSecondary: "#a3aac4",
  inputBackground: "#0f1930",
  inputBorder: "#6d758c", // outline
  primary: "#6dfe9c", // Bioluminescent Green
  secondary: "#19be64", // primary_container
  success: "#5def8f",
  danger: "#ff716c",
  onPrimary: "#005f2e",
  gradient: ["#19be64", "#6dfe9c"], // 135deg glow equivalent
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
