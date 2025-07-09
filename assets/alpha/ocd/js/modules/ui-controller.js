// /assets/alpha/ocd/js/modules/ui-controller.js

import { OcdStates, StorageKeys } from "./constants.js";
import * as Dom from "./dom.js";
import { handlePositionChange } from "./fab-controller.js";
import { checkUpdates } from "./update-checker.js";

const getTemplateNameForError = (error) => `${error}-template`;

// Console Content
export const appendTemplate = (template) => {
  if (template) {
    Dom.ocdConsoleContent.appendChild(template.content.cloneNode(true));
  }
};

const consoleErrorEntry = (error, url) => {
  const div = document.createElement("div");
  div.className = "ocd-console-entry";
  div.textContent = "> ";
  const span = Object.assign(document.createElement("span"), {
    className: "ocd-console-code",
    textContent: error,
  });
  div.append(span);
  if (url) {
    div.append(
      " - ",
      Object.assign(document.createElement("a"), {
        className: "ocd-console-error-link",
        href: url,
        textContent: url,
      }),
    );
  }
  Dom.ocdConsoleContent.appendChild(div);
};

const showErrors = () => {
  Dom.ocdConsoleContent.innerHTML = "";
  const storedData =
    JSON.parse(localStorage.getItem(StorageKeys.ERROR_LIST)) || {};
  const uniqueConfigErrors = new Set();

  for (const [pageUrl, errorList] of Object.entries(storedData)) {
    errorList.forEach((error) => {
      const isConfigError = error.startsWith("ocd-config-");
      if (!isConfigError || !uniqueConfigErrors.has(error)) {
        consoleErrorEntry(error, pageUrl);

        const templateName = getTemplateNameForError(error);

        const template = document.querySelector(
          `[data-alpha="${templateName}"]`,
        );

        appendTemplate(template);

        if (isConfigError) uniqueConfigErrors.add(error);
      }
    });
  }
};

const showConsoleHelp = () => {
  Dom.ocdConsoleContent.innerHTML = "";
  appendTemplate(document.querySelector('[data-alpha="ocd-help-template"]'));
};

const resetConsoleStorage = () => {
  localStorage.removeItem(StorageKeys.ERROR_LIST);
  window.location.reload();
};

// Modal Toggles
const closeSettings = () => {
  Dom.ocdSettings.classList.add(OcdStates.HIDDEN);
  Dom.ocdSettings.inert = true;
};

const openSettings = () => {
  Dom.ocdSettings.classList.remove(OcdStates.HIDDEN);
  Dom.ocdSettings.inert = false;
};

const closeConsole = () => {
  Dom.ocdConsoleContainer.classList.add(OcdStates.HIDDEN);
  Dom.ocdConsoleContainer.inert = true;
  Dom.ocdConsoleContent.innerHTML = ""; // Clear on close
};

export const openConsole = () => {
  if (!Dom.ocdSettings.classList.contains(OcdStates.HIDDEN)) closeSettings();
  Dom.ocdConsoleContainer.classList.remove(OcdStates.HIDDEN);
  Dom.ocdConsoleContainer.inert = false;
};

const toggleConsole = () => {
  if (Dom.ocdConsoleContainer.classList.contains(OcdStates.HIDDEN)) {
    openConsole();
    showErrors();
  } else {
    closeConsole();
  }
};

const handleFabClick = () => {
  if (Dom.ocdFab.classList.contains(OcdStates.ERROR)) {
    toggleConsole();
  } else {
    Dom.ocdSettings.classList.contains(OcdStates.HIDDEN)
      ? openSettings()
      : closeSettings();
  }
};

// Event Listener Initialization
export function initializeUiEventListeners() {
  Dom.ocdFab?.addEventListener("click", handleFabClick);
  Dom.ocdSettingsCloseBtn?.addEventListener("click", closeSettings);
  Dom.selectPositionElement?.addEventListener("change", handlePositionChange);
  Dom.ocdOpenConsoleBtn?.addEventListener("click", toggleConsole);
  Dom.ocdUpdateBtn?.addEventListener("click", () => {
    closeSettings();
    checkUpdates();
  });
  Dom.ocdConsoleCloseBtn?.addEventListener("click", closeConsole);
  Dom.ocdConsoleHelpBtn?.addEventListener("click", showConsoleHelp);
  Dom.ocdConsoleResetBtn?.addEventListener("click", resetConsoleStorage);
}
