import React, { useEffect, useState, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colorScheme } from "nativewind";

const ThemeContext = createContext();

const storeData = async (value) => {
  try {
    await AsyncStorage.setItem("mode", value);
    console.log("Theme saved to storage:", value);
  } catch (e) {
    console.error("Error saving theme to storage:", e);
  }
};

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem("mode");
    console.log("Value retrieved from storage:", value);
    return value || "light"; // Default to light theme if none is set
  } catch (e) {
    console.error("Error retrieving theme from storage:", e);
    return "light";
  }
};

export const toggleColorScheme = () => {
  const currentScheme = colorScheme.get();
  const newScheme = currentScheme === "light" ? "dark" : "light";
  console.log("New theme: ", newScheme);
  colorScheme.set(newScheme);
  storeData(newScheme);
};

export const useTheme = () => useContext(ThemeContext);

export const ColorThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const initializeTheme = async () => {
      const storedTheme = await getData();
      colorScheme.set(storedTheme);
      setTheme(storedTheme);
    };
    setTimeout(initializeTheme, 100); // Small delay
  }, []);

  useEffect(() => {
    // Sync state with `colorScheme`
    const currentScheme = colorScheme.get();
    if (currentScheme !== theme) {
      setTheme(currentScheme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    colorScheme.set(newTheme);
    console.log("New theme: ", newTheme);
    storeData(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
