// /assets/alpha/liva/js/modules/ui-controller.js

import { LivaStates, StorageKeys } from "./constants.js";
import * as Dom from "./dom.js";
import { handlePositionChange } from "./fab-controller.js";
import { checkUpdates } from "./update-checker.js";

const getTemplateNameForError = (error) => `${error}-template`;

// Console Content
export const appendTemplate = (template) => {
  if (template) {
    Dom.livaConsoleContent.appendChild(template.content.cloneNode(true));
  }
};

const consoleErrorEntry = (error, url) => {
  const div = document.createElement("div");
  div.className = "liva-console-entry";
  div.textContent = "> ";
  const span = Object.assign(document.createElement("span"), {
    className: "liva-console-code",
    textContent: error,
  });
  div.append(span);
  if (url) {
    div.append(
      " - ",
      Object.assign(document.createElement("a"), {
        className: "liva-console-error-link",
        href: url,
        textContent: url,
      }),
    );
  }
  Dom.livaConsoleContent.appendChild(div);
};

const showErrors = () => {
  Dom.livaConsoleContent.innerHTML = "";
  const storedData =
    JSON.parse(localStorage.getItem(StorageKeys.ERROR_LIST)) || {};
  const uniqueConfigErrors = new Set();

  for (const [pageUrl, errorList] of Object.entries(storedData)) {
    errorList.forEach((error) => {
      const isConfigError = error.startsWith("liva-config-");
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
  Dom.livaConsoleContent.innerHTML = "";
  appendTemplate(document.querySelector('[data-alpha="liva-help-template"]'));
};

const resetConsoleStorage = () => {
  localStorage.removeItem(StorageKeys.ERROR_LIST);
  window.location.reload();
};

// Modal Toggles
const closeSettings = () => {
  Dom.livaSettings.classList.add(LivaStates.HIDDEN);
  Dom.livaSettings.inert = true;
};

const openSettings = () => {
  Dom.livaSettings.classList.remove(LivaStates.HIDDEN);
  Dom.livaSettings.inert = false;
};

const closeConsole = () => {
  Dom.livaConsoleContainer.classList.add(LivaStates.HIDDEN);
  Dom.livaConsoleContainer.inert = true;
  Dom.livaConsoleContent.innerHTML = ""; // Clear on close
};

export const openConsole = () => {
  if (!Dom.livaSettings.classList.contains(LivaStates.HIDDEN)) closeSettings();
  Dom.livaConsoleContainer.classList.remove(LivaStates.HIDDEN);
  Dom.livaConsoleContainer.inert = false;
};

const toggleConsole = () => {
  if (Dom.livaConsoleContainer.classList.contains(LivaStates.HIDDEN)) {
    openConsole();
    showErrors();
  } else {
    closeConsole();
  }
};

const handleFabClick = () => {
  if (Dom.livaFab.classList.contains(LivaStates.ERROR)) {
    toggleConsole();
  } else {
    Dom.livaSettings.classList.contains(LivaStates.HIDDEN)
      ? openSettings()
      : closeSettings();
  }
};

// Event Listener Initialization
export function initializeUiEventListeners() {
  Dom.livaFab?.addEventListener("click", handleFabClick);
  Dom.livaSettingsCloseBtn?.addEventListener("click", closeSettings);
  Dom.selectPositionElement?.addEventListener("change", handlePositionChange);
  Dom.livaOpenConsoleBtn?.addEventListener("click", toggleConsole);
  Dom.livaUpdateBtn?.addEventListener("click", () => {
    closeSettings();
    checkUpdates();
  });
  Dom.livaConsoleCloseBtn?.addEventListener("click", closeConsole);
  Dom.livaConsoleHelpBtn?.addEventListener("click", showConsoleHelp);
  Dom.livaConsoleResetBtn?.addEventListener("click", resetConsoleStorage);
}
