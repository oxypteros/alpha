// /assets/alpha/ocd/js/modules/fab-controller.js

import { OcdPositions, OcdStates, StorageKeys } from "./constants.js";
import { ocdContainer, selectPositionElement, ocdFab } from "./dom.js";

export function restoreFabPosition() {
  const fabPosition = localStorage.getItem(StorageKeys.FAB_POSITION);
  if (!fabPosition || !ocdContainer) return;

  ocdContainer.classList.remove(
    OcdPositions.BOTTOM_LEFT,
    OcdPositions.BOTTOM_RIGHT,
  );
  ocdContainer.classList.add(fabPosition);

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

  ocdContainer.classList.remove(
    OcdPositions.BOTTOM_LEFT,
    OcdPositions.BOTTOM_RIGHT,
  );
  ocdContainer.classList.add(selectedValue);

  localStorage.setItem(StorageKeys.FAB_POSITION, selectedValue);
  restoreFabPosition(); // Re-sync the <select> element's 'selected' attribute
}

export function updateFabState() {
  if (!ocdFab) return;
  const errorData =
    JSON.parse(localStorage.getItem(StorageKeys.ERROR_LIST)) || {};
  const hasErrors = Object.keys(errorData).length > 0;

  if (hasErrors) {
    ocdFab.classList.add(OcdStates.ERROR);
  } else {
    ocdFab.classList.remove(OcdStates.ERROR);
  }
}
