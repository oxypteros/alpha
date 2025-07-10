// /assets/alpha/liva/js/modules/error-tracker.js

import { StorageKeys } from "./constants.js";

const currentPage = window.location.href;

// Passed in from the main script to update the UI
let onErrorsUpdatedCallback = () => {};

const updateLocalStorage = () => {
  const errorElements = document.querySelectorAll("[data-error]");
  let errorData =
    JSON.parse(localStorage.getItem(StorageKeys.ERROR_LIST)) || {};

  if (errorElements.length > 0) {
errorData[currentPage] = [...errorElements].map((el) => el.dataset.error);

  } else {
    delete errorData[currentPage]; // Remove page from list if no errors
  }

  localStorage.setItem(StorageKeys.ERROR_LIST, JSON.stringify(errorData));
  console.log("Updated error list:", errorData);
  onErrorsUpdatedCallback(); // Notify other modules that errors have changed
};

export function initializeErrorTracking(callback) {
  if (typeof callback === "function") {
    onErrorsUpdatedCallback = callback;
  }

  // MutationObserver: Watches for changes in `data-error`
  const observer = new MutationObserver(updateLocalStorage);
  observer.observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ["data-error"],
  });

  // Listen for changes from other tabs/windows
  window.addEventListener("storage", (event) => {
    if (event.key === StorageKeys.ERROR_LIST) {
      console.log("LocalStorage changed in another tab.");
      onErrorsUpdatedCallback();
    }
  });

  // Initial check on page load
  updateLocalStorage();
}
