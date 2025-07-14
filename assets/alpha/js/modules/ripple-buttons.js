// assets/alpha/js/modules/ripple-buttons.js

/**
 * @file Adds a Material Design-style ripple effect to buttons and designated 
 * link elements.
 * @module modules/ripple-buttons
 *
 * @summary Enhances user interaction by providing visual feedback in the form 
 * of an expanding ripple effect on buttons and links with the `.btn-link` class.
 *
 * @description
 * This module applies a click-triggered ripple animation to all `<button>` 
 * elements and all `<a>` elements with the class `.btn-link`.
 *
 * How it works:
 * 1. When a targeted element is clicked, a `<span>` element (the ripple) is
 *    dynamically created.
 * 2. The ripple's diameter is calculated based on the clicked element's 
 *    dimensions.
 * 3. It's positioned absolutely within the element, centered at the click 
 *    coordinates.
 * 4. A CSS class (`.ripple`) is added to trigger the animation defined in CSS.
 * 5. Any pre-existing ripple element from a rapid previous click is removed to
 *    ensure a clean effect.
 * 6. The new ripple element is appended to the clicked button/link.
 * 7. After the CSS animation completes (`animationend` event), the ripple
 *    element is removed from the DOM to prevent clutter.
 *
 * The necessary CSS for the ripple animation (defining `.ripple`, its animation,
 * and initial state for `button`/`.btn-link`) is expected to be present in the
 * theme's stylesheets.
 *
 * Based on an initial concept and code by Bret Cameron.
 *
 * @requires ../utils.js - For the `$$` (querySelectorAll shorthand) utility.
 */

/* Css included styles
button, .btn-link {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
span.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 700ms linear;
  background-color: rgba(75, 123, 91, 0.5);
}
.filled-btn span.ripple {
  background-color: rgba(248, 249, 251, 0.5);
}
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
*/

import { $$ } from "../utils.js";

export const initRippleButtons = () => {
  const RIPPLE_CLASS = "ripple";
  const createRipple = (event) => {
    const button = event.currentTarget;

    // Create the ripple element (span)
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    // Position the circle at the cursor position
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left - radius;
    const y = event.clientY - rect.top - radius;

    // Apply styles
    Object.assign(circle.style, {
      width: `${diameter}px`,
      height: `${diameter}px`,
      left: `${x}px`,
      top: `${y}px`,
    });

    // Add ripple class to the circle
    circle.classList.add(RIPPLE_CLASS);

    // Remove any existing ripple elements
    const existingRipple = button.querySelector(`.${RIPPLE_CLASS}`);
    if (existingRipple) {
      existingRipple.remove();
    }

    // Append the new ripple element
    button.appendChild(circle);

    // Clean up ripple after animation
    circle.addEventListener("animationend", () => {
      circle.remove();
    });
  };

  // Add the ripple effect to ALL btns
  $$("button").forEach((button) => {
    button.addEventListener("click", createRipple);
  });
  // Add the ripple effect to ALL links with the "btn-link" class
  $$("a.btn-link").forEach((link) => {
    link.addEventListener("click", createRipple);
  });
  //console.log("ripple-buttons.js imported");
};
