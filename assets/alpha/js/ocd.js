/**
 * Primary JavaScript entry point for the OCD.
 *
 * This script serves as the primary JavaScript bundle for the OCD.
 * It utilizes ES modules and is processed by Hugo Pipes, enabling conditional
 * loading of specific modules.
 *
 */

import { initializeErrorTracking } from './modules/ocd/error-tracker.js';
import { restoreFabPosition, updateFabState } from './modules/ocd/fab-controller.js';
import { initializeUiEventListeners } from './modules/ocd/ui-controller.js';

function main() {
  console.log("OCD is running");

  // UI event listeners 
  initializeUiEventListeners();

  // FAB position preference from localStorage
  restoreFabPosition();

  // Initialize error tracking. 
  // Pass `updateFabState` as a callback 
  // so the FAB's error state is updated whenever errors change.
  initializeErrorTracking(updateFabState);
}

// Run the main function when the DOM is ready.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}