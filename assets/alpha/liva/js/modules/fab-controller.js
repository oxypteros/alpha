// /assets/alpha/liva/js/modules/fab-controller.js

import { LivaPositions, LivaStates, StorageKeys } from "./constants.js";
import { livaContainer, selectPositionElement, livaFab } from "./dom.js";

export function restoreFabPosition() {
  const fabPosition = localStorage.getItem(StorageKeys.FAB_POSITION);
  if (!fabPosition || !livaContainer) return;

  livaContainer.classList.remove(
    LivaPositions.BOTTOM_LEFT,
    LivaPositions.BOTTOM_RIGHT,
  );
  livaContainer.classList.add(fabPosition);

  // Update the select dropdown to match
  const optionToSelect = selectPositionElement.querySelector(
    `option[value="${fabPosition}"]`,
  );
  if (optionToSelect) {
    // Reset previous selections
    selectPositionElement
      .querySelectorAll("option")
      .forEach((opt) => opt.removeAttribute("selected"));
    optionToSelect.setAttribute("selected", "");
    selectPositionElement.value = fabPosition;
  }
}

export function handlePositionChange() {
  const selectedValue = selectPositionElement.value;

  livaContainer.classList.remove(
    LivaPositions.BOTTOM_LEFT,
    LivaPositions.BOTTOM_RIGHT,
  );
  livaContainer.classList.add(selectedValue);

  localStorage.setItem(StorageKeys.FAB_POSITION, selectedValue);
  restoreFabPosition(); // Re-sync the <select> element's 'selected' attribute
}

export function updateFabState() {
  if (!livaFab) return;
  const errorData =
    JSON.parse(localStorage.getItem(StorageKeys.ERROR_LIST)) || {};
  const hasErrors = Object.keys(errorData).length > 0;

  if (hasErrors) {
    livaFab.classList.add(LivaStates.ERROR);
  } else {
    livaFab.classList.remove(LivaStates.ERROR);
  }
}
