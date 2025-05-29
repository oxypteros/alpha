// assets/js/utils.js

/**
 * @file Utility functions for the Alpha theme.
 * @module utils
 *
 * @summary Provides common helper functions for DOM manipulation and error handling.
 */

/**
 * A shorthand for `document.querySelector` or `scope.querySelector`.
 */
export const $ = (selector, scope = document) => scope.querySelector(selector);

/**
 * A shorthand for `document.querySelectorAll` or `scope.querySelectorAll`.
 */
export const $$ = (selector, scope = document) =>
  scope.querySelectorAll(selector);

/**
 * Error handler: Logs errors or other message types to the console and optionally halts execution.
 */
export const errorHandler = (message, type = "error", halt = false) => {
  console[type](message);
  if (halt) {
    throw new Error(message);
  }
};
/**
 * Sets multiple attributes on an HTML element.
 */
export const setAttributes = (el, attrs) => {
  for (const key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};
