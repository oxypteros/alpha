// assets/alpha/js/modules/privacy-snackbar.js
/**
 * @file Manages a simple privacy/cookie informational snackbar.
 * @module modules/privacy-snackbar
 *
 * @summary Displays a dismissible snackbar to inform users about privacy or
 * cookie usage. It uses `localStorage` to remember the user's acknowledgment
 * and avoid showing the snackbar on subsequent visits if already addressed.
 *
 * @description
 * This module dynamically injects a privacy notice into a designated snackbar
 * container using content from an HTML `<template>`.
 *
 * Key Functionality:
 * 1. Checks `localStorage`: On initialization, it checks `localStorage` for a
 *    `tracking` item. If this item exists, it assumes the user has already 
 *    interacted with a privacy notice, and the snackbar is not displayed.
 * 2. Displays Snackbar: If no `tracking` status is found in `localStorage`,
 *    the snackbar is displayed.
 * 3. Dismissal: The snackbar includes a close button. When clicked:
 *    - If the browser's "Do Not Track" setting is not on remembers the
 *    acknowledgment.
 *    - The snackbar content is removed from the DOM.
 * 4. Accessibility: Uses an announcer element to provide screen reader feedback 
 *    when the snackbar opens and closes.
 *
 * Error handling is included to ensure critical DOM elements are present. 
 * Initialization is halted if they are missing.
 * Localized strings for error messages and ARIA announcements are passed via an
 * i18n object.
 *
 * This module provides a basic mechanism for informing users and is NOT a
 * comprehensive consent management platform. It's designed exclusively for 
 * Alpha theme that by default has a no cookies and privacy friendly policy.
 *
 * @param {object} i18n - An object containing localized strings.
 * @param {string} i18n.privacySbElemMiss - Error message if critical snackbar 
 * elements are missing.
 * @param {string} i18n.snackbarOpen - Screen reader announcement when the 
 * snackbar opens.
 * @param {string} i18n.snackbarClose - Screen reader announcement when the 
 * snackbar closes.
 *
 * @requires ../utils.js - For `$` (selector) and `errorHandler` utilities.
 */

import { $, errorHandler } from "../utils.js";

export const initPrivacySnackbar = (i18n) => {
  const ELEMENTS = {
    snackbarContainer: $('[data-alpha="snackbar-container"]'),
    privacyTemplate: $('[data-alpha="snackbar-privacy-template"]'),
    announcer: $('[data-alpha="announcer"]'),
  };
  // Check if crucial elements exist
  if (!ELEMENTS.snackbarContainer || !ELEMENTS.privacyTemplate) {
    errorHandler(i18n.privacySbElemMiss, "error", true);
  }
  // Announce snackbar state
  const announceSnackbarState = (isOpen) => {
    if (!ELEMENTS.announcer) return;
    ELEMENTS.announcer.textContent = isOpen
      ? i18n.snackbarOpen
      : i18n.snackbarClose;
  };
  // Check if privacy has been already accepted/decline
  const privacyAccepted = () => {
    let status = localStorage.getItem("tracking");
    if (status === "true" || status === "false") return;
    togglePrivacySnackbar();
  };

  // Toggle the privacy snackbar
  const togglePrivacySnackbar = () => {
    const privacyContent = ELEMENTS.privacyTemplate.content.cloneNode(true);

    ELEMENTS.snackbarContainer.innerHTML = "";

    ELEMENTS.snackbarContainer.appendChild(privacyContent);

    requestAnimationFrame(() => {
      const closeBtn = $('button[data-alpha="snackbar-close-button"]');

      if (closeBtn) {
        closeBtn.addEventListener(
          "click",
          () => {
            if (navigator.doNotTrack !== "1") {
              localStorage.setItem("tracking", "true");
            }
            ELEMENTS.snackbarContainer.innerHTML = "";
            announceSnackbarState(false);
          },
          { once: true },
        );
      }
      announceSnackbarState(true);
    });
  };
  privacyAccepted();
  //console.log("privacy-snackbar.js imported");
};
