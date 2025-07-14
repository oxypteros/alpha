// assets/alpha/js/modules/pagefind-alpha.js

/**
 * @file Initializes and manages the client-side search modal for Alpha theme.
 * @module modules/pagefind-alpha
 *
 * @summary It handles the display and dismissal of a search modal, which is
 * populated by Pagefind's UI when activated by a search button.
 *
 * @description
 * This module listens for clicks on Alpha's search button 
 * (`data-alpha="search-button"`).
 * When clicked, it dynamically:
 * 1. Clones content from an HTML `<template>` into a container element.
 * 2. Initializes `PagefindUI` targeting an element with `id="search"` inside 
 *    the template.
 * 3. Manages modal behavior:
 *    - Prevents body scroll when the modal is open.
 *    - Sets appropriate ARIA attributes for accessibility.
 *    - Automatically focuses the Pagefind search input.
 *    - Provides a close button within the modal.
 * 4. Clears the modal content and resets ARIA attributes and body scroll when 
 *    closed.
 *
 * Error handler checks for the presence of critical DOM elements and 
 * initialization is halted if they are missing.
 * Localized strings for error messages are passed via an i18n object.
 *
 * Assumes the Pagefind library is installed and globally available when this 
 * module runs.
 *
 * @param {object} i18n - An object containing localized strings.
 * @param {string} i18n.searchContMiss - Error message if the search container 
 * element is missing.
 * @param {string} i18n.searchBtnMiss - Error message if the search button 
 * element is missing.
 *
 * @requires ../utils.js - For the `$` DOM utility function.
 * @see {@link https://alpha.oxypteros.com/docs/integrations/search} 
 * - For Pagefind with Alpha theme documentation.
 */

import { $ } from "../utils.js";

export const initPagefindAlpha = (i18n) => {
  const ELEMENTS = {
    searchBtn: $('button[data-alpha="search-button"]'),
    searchCont: $('[data-alpha="search-template-container"]'),
    searchTemplate: $('[data-alpha="search-template"]'),
  };

  if (!ELEMENTS.searchBtn || !ELEMENTS.searchCont) {
    console.error(
      ELEMENTS.searchBtn ? i18n.searchContMiss : i18n.searchBtnMiss,
    );
    return;
  }

  const toggleSearch = () => {
    const searchIsOpen =
      ELEMENTS.searchBtn.getAttribute("aria-expanded") === "true";
    searchIsOpen ? closeSearch() : openSearch();
  };

  const openSearch = () => {
    if (ELEMENTS.searchTemplate) {
      // Append the search template
      const clonedSearch = ELEMENTS.searchTemplate.content.cloneNode(true);
      ELEMENTS.searchCont.innerHTML = "";
      ELEMENTS.searchCont.appendChild(clonedSearch);

      // Initialize PagefindUI after template content is added to the DOM
      new PagefindUI({ element: "#search", showSubResults: true });

      // Focus the search input after rendering
      const searchInput = ELEMENTS.searchCont.querySelector(
        ".pagefind-ui__search-input",
      );
      if (searchInput) {
        // Wait for DOM updates before focus
        setTimeout(() => searchInput.focus(), 0); 
      }

      // Add event listener to the close button inside the modal
      const closeBtn = $('[data-alpha="close-search-button"]');
      if (closeBtn) {
        closeBtn.addEventListener("click", closeSearch);
      }
    }
    // Disable scroll beneath the modal
    document.body.classList.add("overflow-hidden", "h-screen");
    // Define ARIA values
    ELEMENTS.searchBtn.setAttribute("aria-expanded", "true");
    ELEMENTS.searchCont.setAttribute("role", "dialog");
    ELEMENTS.searchCont.setAttribute("aria-modal", "true");
  };

  const closeSearch = () => {
    document.body.classList.remove("overflow-hidden", "h-screen");
    ELEMENTS.searchCont.innerHTML = ""; // Clear modal content
    ELEMENTS.searchBtn.setAttribute("aria-expanded", "false");
    ELEMENTS.searchCont.removeAttribute("role");
    ELEMENTS.searchCont.removeAttribute("aria-modal");
  };

  ELEMENTS.searchBtn.addEventListener("click", toggleSearch);
  //console.log("pagefind-alpha.js imported");
};
