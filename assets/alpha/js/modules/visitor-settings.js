// assets/alpha/js/modules/visitor-settings.js

/**
 * @file Manages a visitor settings modal for user controlled preferences.
 * @module modules/visitor-settings
 *
 * @summary Provides a UI for users to control "tracking" and "prefetching." 
 * Preferences are stored in `localStorage`.
 *
 * @description
 * This module controls a settings modal that is dynamically populated from an
 * HTML `<template>` when a settings button is clicked.
 *
 * Key functionalities within the modal include:
 * 1.  Anonymous Tracking Toggle:
 *     - A button allows users to toggle a preference stored at `localStorage.
 *     - The button's icon and ARIA attributes are updated to reflect the 
 *       current state.
 * 2.  Prefetch Functionality Toggle:
 *     - A button allows users to toggle a preference stored at `localStorage.
 *     - Similar UI and ARIA updates are applied to this button.
 * 3.  Modal Display and Dismissal:
 *     - The modal is shown when the main settings button is clicked.
 *     - A close button within the modal clears its content and dismisses it.
 * 4.  Accessibility:
 *     - An announcer element provides screen reader
 *       feedback for modal open/close states.
 *     - ARIA attributes are managed for the toggle buttons.
 *
 * The initial state of the toggle buttons within the modal reflects the current
 * values stored in `localStorage`. Error handling checks for the presence of
 * critical DOM elements, halting initialization if they are missing.
 * Localized strings for UI elements, ARIA labels, and error messages are
 * passed via an i18n object.
 *
 * @param {object} i18n - An object containing localized strings.
 * @param {string} i18n.settingsElementsMissing - Error message if critical 
 * settings elements are missing.
 * @param {string} i18n.settingsOpen - Screen reader announcement when the 
 * settings modal opens.
 * @param {string} i18n.settingsClose - Screen reader announcement when the 
 * settings modal closes.
 * @param {string} i18n.trackingDisabled - ARIA label/text indicating anonymous 
 * tracking is disabled by the user.
 * @param {string} i18n.trackingEnabled - ARIA label/text indicating anonymous 
 * tracking is enabled by the user.
 * @param {string} i18n.prefetchDisabled - ARIA label/text indicating prefetch 
 * functionality is disabled by the user.
 * @param {string} i18n.prefetchEnabled - ARIA label/text indicating prefetch 
 * functionality is enabled by the user.
 *
 * @requires ../utils.js - For `$` (selector), `errorHandler`, and 
 * `setAttributes` utilities.
 */

import { $, errorHandler, setAttributes } from "../utils.js";

export const initVisitorSettings = (i18n) => {
  const ELEMENTS = {
    settingsContainer: $('[data-alpha="settings-container"]'),
    settingsTemplate: $('[data-alpha="settings-template"]'),
    settingsBtn: $('button[data-alpha="settings-button"]'),
    announcer: $('[data-alpha="announcer"]'),
  };
  let trackBtn;
  let trackBtnIcon;
  let prefetchBtn;
  let prefetchBtnIcon;
  // Check if crucial elements exist
  if (
    !ELEMENTS.settingsContainer ||
    !ELEMENTS.settingsTemplate ||
    !ELEMENTS.settingsBtn
  ) {
    errorHandler(i18n.settingsElementsMissing, "error", true);
    return;
  }

  /**
   * Announces the settings modal state for accessibility.
   * @param {boolean} isOpen - Indicates whether the modal is open.
   */
  const announceSettingsState = (isOpen) => {
    if (!ELEMENTS.announcer) return;
    ELEMENTS.announcer.textContent = isOpen
      ? i18n.settingsOpen
      : i18n.settingsClose;
  };

  /**
   * Toggles anonymous tracking preference.
   */
  const toggleTracking = () => {
    const currentTrackingValue = localStorage.getItem("tracking");
    // Determine next state
    const newValue = currentTrackingValue === "true" ? "false" : "true"; 
    localStorage.setItem("tracking", newValue);

    // Update Button UI immediately:
    setAttributes(trackBtnIcon, {
      href: newValue === "false" ? "#icon-off" : "#icon-on",
    });
    setAttributes(trackBtn, {
      "aria-pressed": newValue === "false" ? "true" : "false",
    });
    setAttributes(trackBtn, {
      "aria-label":
        newValue === "false" ? i18n.trackingDisabled : i18n.trackingEnabled,
    });
  };

  /**
   * Toggles prefetch functionality preference.
   */
  const togglePrefetch = () => {
    const currentPrefetchValue = localStorage.getItem("prefetch");

    const newValue = currentPrefetchValue === "true" ? "false" : "true";
    localStorage.setItem("prefetch", newValue);

    setAttributes(prefetchBtnIcon, {
      href: newValue === "false" ? "#icon-off" : "#icon-on",
    });
    setAttributes(prefetchBtn, {
      "aria-pressed": newValue === "false" ? "true" : "false",
    });
    setAttributes(prefetchBtn, {
      "aria-label":
        newValue === "false" ? i18n.prefetchDisabled : i18n.prefetchEnabled,
    });
  };

  /**
   * Opens the settings modal and initializes UI states.
   */
  const openSettings = () => {
    const settingsContent = ELEMENTS.settingsTemplate.content.cloneNode(true);
    ELEMENTS.settingsContainer.innerHTML = "";
    ELEMENTS.settingsContainer.appendChild(settingsContent);

    const closeBtn = $('button[data-alpha="settings-close-button"]');
    trackBtn = $('button[data-alpha="tracking-button"]');
    trackBtnIcon = $('button[data-alpha="tracking-button"] svg > use');
    prefetchBtn = $('button[data-alpha="prefetch-button"]');
    prefetchBtnIcon = $('button[data-alpha="prefetch-button"] svg > use');

    const initialTrackingState = localStorage.getItem("tracking") === "false";
    const initialPrefetchState = localStorage.getItem("prefetch") === "false";

    if (trackBtn) {
      setAttributes(trackBtnIcon, {
        href: initialTrackingState ? "#icon-off" : "#icon-on",
      });
      setAttributes(trackBtn, {
        "aria-pressed": initialTrackingState ? "true" : "false",
      });
      setAttributes(trackBtn, {
        "aria-label": initialTrackingState
          ? i18n.trackingDisabled
          : i18n.TrackingEnabled,
      });
      trackBtn.addEventListener("click", toggleTracking);
    }

    if (prefetchBtn) {
      setAttributes(prefetchBtnIcon, {
        href: initialPrefetchState ? "#icon-off" : "#icon-on",
      });
      setAttributes(prefetchBtn, {
        "aria-pressed": initialPrefetchState ? "true" : "false",
      });
      setAttributes(prefetchBtn, {
        "aria-label": initialPrefetchState
          ? i18n.prefetchDisabled
          : i18n.prefetchEnabled,
      });
      prefetchBtn.addEventListener("click", togglePrefetch);
    }

    if (closeBtn) {
      closeBtn.addEventListener(
        "click",
        () => {
          ELEMENTS.settingsContainer.innerHTML = "";
          announceSettingsState(false);
        },
        { once: true },
      );
    }

    announceSettingsState(true);
  };

  ELEMENTS.settingsBtn?.addEventListener("click", openSettings);
  //console.log("visitor-settings.js imported");
};
