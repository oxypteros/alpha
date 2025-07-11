// assets/alpha/js/modules/menu.js

/**
 * @file Manages the "hamburger" navigation menu for the Alpha theme.
 * @module modules/menu
 *
 * @summary Handles the opening, closing, and accessibility aspects of the
 * main navigation menu, controlled by a menu button. It uses HTML templates to 
 * populate the menu content dynamically.
 *
 * @description
 * This module controls a collapsible navigation menu. It identifies key DOM
 * elements using `data-alpha-*` attributes.
 *
 * Key functionalities include:
 * - Toggling the menu's visibility and ARIA states.
 * - Changing the menu button icon.
 * - Dynamically inserting menu content from an HTML `<template>` element that 
 *   is conditional populated by Hugo and a config `menus.toml` file.
 * - Moving focus to the first focusable item within the opened menu, and 
 *   returning focus to the menu button when closed.
 * - Allowing the menu to be closed using the "Escape" key.
 * - Providing screen reader announcements for menu open/close states.
 * - A simple debounce mechanism (`isAnimating`) to prevent rapid toggling
 *   during CSS transitions.
 * - Cleaning up the dynamically added menu content from the DOM after the
 *   closing transition completes.
 *
 * The module includes error handling for missing critical DOM elements. 
 * Localized strings for ARIA announcements and error messages are passed via an
 * i18n object.
 *
 * @param {object} i18n - An object containing localized strings.
 * @param {string} i18n.menuElemMiss - Error message for missing critical menu 
 * elements.
 * @param {string} i18n.menuOpen - Screen reader announcement when the menu is 
 * opened.
 * @param {string} i18n.menuClose - Screen reader announcement when the menu is 
 * closed.
 *
 * @requires ../utils.js - For `$` (selector), `errorHandler`, and 
 * `setAttributes` utilities.
 */

import { $, errorHandler, setAttributes } from "../utils.js";

export const initMenu = (i18n) => {
  const ELEMENTS = {
    header: $('[data-alpha="header"]'),
    menuBtn: $('[data-alpha="menu-button"]'),
    btnIconUse: $('button[data-alpha="menu-button"] svg > use'),
    menuTemplate: $('[data-alpha="menu-template"]'),
    menuTemplateContainer: $('[data-alpha="menu-template-container"]'),
    announcer: $('[data-alpha="announcer"]'),
  };

  // Check if all elements exist
  for (const [key, el] of Object.entries(ELEMENTS)) {
    if (!el) errorHandler(`Missing element: ${key}`, "warn");
  }
  // Halt script if critical elements are missing
  if (
    !ELEMENTS.menuBtn ||
    !ELEMENTS.menuTemplate ||
    !ELEMENTS.menuTemplateContainer
  ) {
    errorHandler(i18n.menuElemMiss, "error", true);
  }

  const focus = (el) => el.focus();
  //Rapid click bouncer
  let isAnimating = false;

  // Toggle function
  const toggleMenu = () => {
    if (isAnimating) return;
    isAnimating = true;
    ELEMENTS.header.addEventListener(
      "transitionend",
      () => {
        isAnimating = false;
      },
      { once: true },
    );
    const menuIsOpen =
      ELEMENTS.menuBtn.getAttribute("aria-expanded") === "true";
    menuIsOpen ? closeMenu() : openMenu();
  };
  // Announce menu state
  const announceMenuState = (isOpen) => {
    if (!ELEMENTS.announcer) return;
    ELEMENTS.announcer.textContent = isOpen ? i18n.menuOpen : i18n.menuClose;
  };
  // Close Menu with Escape
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      ELEMENTS.menuBtn.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
    }
  });
  // Open function
  const openMenu = () => {
    const menuContent = ELEMENTS.menuTemplate.content.cloneNode(true);

    while (ELEMENTS.menuTemplateContainer.firstChild) {
      ELEMENTS.menuTemplateContainer.removeChild(
        ELEMENTS.menuTemplateContainer.firstChild,
      );
    }

    ELEMENTS.menuTemplateContainer.appendChild(menuContent);

    requestAnimationFrame(() => {
      ELEMENTS.header.classList.replace("menu-collapsed", "menu-expanded");
      setAttributes(ELEMENTS.btnIconUse, { href: "#icon-close" });
      setAttributes(ELEMENTS.menuBtn, {
        "aria-pressed": "true",
        "aria-expanded": "true",
      });
      announceMenuState(true);

      const firstFocusableElement =
        ELEMENTS.menuTemplateContainer.querySelector(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      } else {
        focus(ELEMENTS.menuBtn);
      }
    });
  };
  //Close Menu
  const closeMenu = () => {
    ELEMENTS.header.classList.replace("menu-expanded", "menu-collapsed");
    setAttributes(ELEMENTS.btnIconUse, { href: "#icon-menu" });
    setAttributes(ELEMENTS.menuBtn, {
      "aria-pressed": "false",
      "aria-expanded": "false",
    });
    // Clean up menu after transition ends
    ELEMENTS.header.addEventListener(
      "transitionend",
      (event) => {
        if (
          event.target === ELEMENTS.header &&
          event.propertyName === "height"
        ) {
          if (ELEMENTS.menuTemplateContainer.firstChild) {
            ELEMENTS.menuTemplateContainer.innerHTML = "";
          }
        }
      },
      { once: true },
    );
    focus(ELEMENTS.menuBtn);
    announceMenuState(false);
  };

  if (ELEMENTS.menuBtn) {
    ELEMENTS.menuBtn.addEventListener("click", toggleMenu);
  }
  //console.log("menu.js imported");
};
