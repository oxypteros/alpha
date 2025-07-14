// assets/alpha/js/modules/color-scheme.js

/**
 * @file Manages Alpha's theme color scheme (light/dark mode) toggling.
 * @module modules/color-scheme
 *
 * @summary Handles user interaction for switching between light and dark theme,
 * updating the UI and store/update the preference in `localStorage`.
 *
 * @description
 * This module initializes the theme toggle button and its icon. It provides
 * functions to get the current theme, toggle it, and apply the changes to
 * the `<html>` classList and the button's icon.
 * 
 * To prevent FOUC (Flash Of Unstyled Content) a inline script is used in the 
 * `<head>` to define initial theme value.
 *
 * Relies on `data-alpha="theme-button"` for the toggle button and its SVG use 
 * element.
 *
 * @param {object} i18n - An object containing localized strings.
 * @param {string} i18n.colorSchemeElemMiss - Message for missing theme toggle 
 * elements.
 *
 * @requires ../utils.js - For the `$` DOM utility function.
 */

import { $ } from "../utils.js";

export const initColorScheme = (i18n) => {
  const ELEMENTS = {
    themeToggleBtn: $('button[data-alpha="theme-button"]'),
    btnIcon: $('button[data-alpha="theme-button"] svg > use'),
  };
  const ICONS = {
    dark: "#icon-sun",
    light: "#icon-moon",
  };

  // Check if theme toggle button exists
  if (!ELEMENTS.themeToggleBtn || !ELEMENTS.btnIcon) {
    console.warn(i18n.colorSchemeElemMiss);
    return;
  }

  // Get current theme
  const getCurrentTheme = () => {
    return localStorage.theme === "dark" ? "dark" : "light";
  };

  // Toggle the theme
  const toggleTheme = () => {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    localStorage.theme = newTheme;
    applyTheme(newTheme);
  };

  // Apply the theme
  const applyTheme = (theme = getCurrentTheme()) => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    applyIcon(theme);
  };

  // Apply the icon
  const applyIcon = (theme = getCurrentTheme()) => {
    ELEMENTS.btnIcon?.setAttribute("href", ICONS[theme] || ICONS.light);
  };

  //Listen for system theme changes and apply them
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      localStorage.setItem("theme", e.matches ? "dark" : "light");
      applyTheme();
    });

  // Initialize theme on page load ans add listener
  applyIcon();
  ELEMENTS.themeToggleBtn.addEventListener("click", toggleTheme);
  //console.log("color-scheme.js imported");
};
