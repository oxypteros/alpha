// /assets/alpha/liva/js/modules/update-checker.js

import { ApiUrls, DocUrls } from "./constants.js";
import {
  localAlphaVersionEl,
  localHugoVersionEl,
  alphaBadge,
  hugoBadge,
} from "./dom.js";
import { openConsole, appendTemplate } from "./ui-controller.js";

const localAlphaVersion = localAlphaVersionEl?.textContent || "";
const localHugoVersion = localHugoVersionEl?.textContent || "";

const appendLink = (url, title, text, element, badgeEl, badge_class) => {
  element.innerHTML = "";
  const link = Object.assign(document.createElement("a"), {
    href: url,
    target: "_blank",
    rel: "noopener noreferrer",
    title: title,
    textContent: text,
  });
  element.appendChild(link);
  badgeEl.classList.add(badge_class);
};

const checkError = (element, title, badgeEl) => {
  element.innerHTML = "Error";
  element.title = title;
  badgeEl.classList.add("liva-check-error");
};

const compareAlphaVersion = (remoteVersion) => {
  if (remoteVersion && remoteVersion !== localAlphaVersion) {
    appendLink(
      DocUrls.ALPHA_UPDATE,
      "Update alpha to the latest version",
      remoteVersion,
      localAlphaVersionEl,
      alphaBadge,
      "liva-update",
    );
    appendTemplate(
      document.querySelector('[data-alpha="liva-alpha-updates-template"]'),
    );
  } else if (remoteVersion) {
    localAlphaVersionEl.title = "You have the latest version";
    alphaBadge.classList.add("liva-no-update");
    appendTemplate(
      document.querySelector('[data-alpha="liva-no-alpha-updates-template"]'),
    );
  } else {
    checkError(
      localAlphaVersionEl,
      "Could not check for alpha updates",
      alphaBadge,
    );
  }
};

const compareHugoVersion = (remoteVersion) => {
  if (remoteVersion && remoteVersion !== localHugoVersion) {
    appendLink(
      DocUrls.HUGO_UPDATE,
      "Update Hugo to the latest version",
      remoteVersion,
      localHugoVersionEl,
      hugoBadge,
      "liva-update",
    );
    appendTemplate(
      document.querySelector('[data-alpha="liva-hugo-updates-template"]'),
    );
  } else if (remoteVersion) {
    localHugoVersionEl.title = "You have the latest version";
    hugoBadge.classList.add("liva-no-update");
    appendTemplate(
      document.querySelector('[data-alpha="liva-no-hugo-updates-template"]'),
    );
  } else {
    checkError(
      localHugoVersionEl,
      "Could not check for Hugo updates",
      hugoBadge,
    );
  }
};

export async function checkUpdates() {
  openConsole(); // Show the console for results

  // Fetch Theme Version
  try {
    const response = await fetch(ApiUrls.THEME_VERSION);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    compareAlphaVersion(data[0].name);
  } catch (error) {
    console.error("Error fetching Alpha Version URL:", error);
    compareAlphaVersion(null);
  }

  // Fetch Hugo Version
  try {
    const response = await fetch(ApiUrls.HUGO_VERSION);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    compareHugoVersion(data[0].name);
  } catch (error) {
    console.error("Error fetching Hugo Version URL:", error);
    compareHugoVersion(null);
  }
}
