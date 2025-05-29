(() => {
  console.log("OCD is running");

  //OCD Global Constants
  const OcdPositions = {
    BOTTOM_LEFT: "ocd-bottom-left",
    BOTTOM_RIGHT: "ocd-bottom-right",
  };
  const OcdStates = {
    HIDDEN: "ocd-hidden",
    ERROR: "ocd-fab-error",
    HUGO_VERSION_URL: "https://api.github.com/repos/gohugoio/hugo/tags",
    THEME_VERSION_URL: "https://alpha.oxypteros.com/alpha/version.json",
    ALPHA_UPDATE_DOC: "https://alpha.oxypteros.com/update",
    ALPHA_UPDATE_HUGO_DOC: "https://alpha.oxypteros.com/hugo/update",
  };

  // OCD Global Elements
  const errorElements = document.querySelectorAll("[data-error]");
  const ocdContainer = document.querySelector('[data-alpha="ocd-container"]');
  const ocdConsoleContainer = document.querySelector(
    '[data-alpha="ocd-console-container"]',
  );
  const ocdConsoleContent = document.querySelector(
    '[data-alpha="ocd-console-content"]',
  );
  // FAB
  const ocdFab = document.querySelector('[data-alpha="ocd-fab-button"]');
  // Settings
  const ocdSettings = document.querySelector('[data-alpha="ocd-settings"]');
  const ocdSettingsCloseBtn = document.querySelector(
    '[data-alpha="ocd-close-settings"]',
  );
  const selectElement = document.querySelector(
    '[data-alpha="ocd-select-position"]',
  );
  const ocdOpenConsoleBtn = document.querySelector(
    '[data-alpha="ocd-open-console-button"]',
  );
  const ocdUpdateBtn = document.querySelector(
    '[data-alpha="ocd-updates-button"]',
  );
  // Console
  const ocdConsole = document.querySelector('[data-alpha="ocd-console"]');
  const ocdConsoleCloseBtn = document.querySelector(
    '[data-alpha="ocd-close-console"]',
  );
  const ocdConsoleHelpBtn = document.querySelector(
    '[data-alpha="ocd-console-help-button"]',
  );
  const ocdConsoleResetBtn = document.querySelector('[data-alpha="ocd-console-reset-button"]');
  //Restore fab position to user choices
  const restoreFabPosition = () => {
    let fabPosition = localStorage.getItem("ocd-pos");
    if (fabPosition) {
      ocdContainer.classList.remove(
        OcdPositions.BOTTOM_LEFT,
        OcdPositions.BOTTOM_RIGHT,
      );
      const options = selectElement.querySelectorAll("option");
      options.forEach((option) => option.removeAttribute("selected"));
      const optionToSelect = selectElement.querySelector(
        `option[value="${fabPosition}"]`,
      );

      if (optionToSelect) {
        optionToSelect.setAttribute("selected", "");
      }

      ocdContainer.classList.add(fabPosition);
    }
  };

  // Update local storage with errors
  const currentPage = window.location.href;
  const errorListKey = "ocd-error-list";
  (() => {
    // Function to update storage
    const updateLocalStorage = () => {
      let errorElements = document.querySelectorAll("[data-error]");
      let errorData = JSON.parse(localStorage.getItem(errorListKey)) || {};

      if (errorElements.length > 0) {
        errorData[currentPage] = [
          ...new Set([...errorElements].map((el) => el.dataset.error)),
        ];
      } else {
        delete errorData[currentPage]; // Remove page if no errors
      }

      localStorage.setItem(errorListKey, JSON.stringify(errorData));
      console.log("Updated error list:", errorData);
    };

    // MutationObserver: Watches for changes in `data-error`
    const observer = new MutationObserver(updateLocalStorage);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-error"],
    });

    // Listen for changes from other tabs/windows
    window.addEventListener("storage", (event) => {
      if (event.key === errorListKey) {
        console.log(
          "LocalStorage changed in another tab:",
          JSON.parse(event.newValue),
        );
        updateLocalStorage(); // Ensure UI updates
      }
    });

    // Initial check on page load
    document.addEventListener("DOMContentLoaded", updateLocalStorage);
  })();

  // Add, remove error styles from fab
  (() => {
    if (!ocdFab) return;
    const updateOcdFab = () => {
      //const storageErrors = localStorage.getItem("ocd-error");
      let errorData = JSON.parse(localStorage.getItem("ocd-error-list")) || {};
      const localErrors = errorElements.length > 0;
      const listErrors = Object.keys(errorData).length;

      if (localErrors === true && listErrors === 0) {
        console.log(
          "Storage is not updated on current tab: " +
            Object.keys(errorData).length,
        );
      }

      if (
        (localErrors === false || listErrors === 0) &&
        ocdFab.classList.contains("ocd-fab-error") === true
      ) {
        //const existingList = ocdFab.querySelector(".list-errors");
        //if (existingList) existingList.remove();
        ocdFab.classList.remove("ocd-fab-error");
      }

      if (listErrors > 0) {
        //let countErrors = listErrors === 1 ? "1 error" : listErrors + " errors";

        //const existingList = ocdFab.querySelector(".list-errors");
        //if (existingList) existingList.remove();
        //const element = document.createElement("span");
        // element.textContent = countErrors;
        //element.className = "list-errors";
        ocdFab.classList.add("ocd-fab-error");
        //ocdFab.insertBefore(element, ocdFab.firstChild);
      }
    };
    updateOcdFab();

    // Listen for changes in localStorage from other tabs/windows
    window.addEventListener("storage", (event) => {
      if (event.key === "ocd-error") {
        console.log(`LocalStorage changed: ${event.key} = ${event.newValue}`);
        updateOcdFab();
      }
    });

    //After 1sec check for changes in localStorage if they are not synced
    window.addEventListener("load", () => {
      setTimeout(() => {
        updateOcdFab();
      }, 1000);
    });
  })();

  // OCD Settings/Console Modals
  (() => {
    // OCD Console
    const appendTemplate = (template) => {
      const getTemplate = template;
      if (getTemplate) {
        const clonedTemplate = getTemplate.content.cloneNode(true);
        ocdConsoleContent.appendChild(clonedTemplate);
      }
    };
    const showConsoleHelp = () => {
      console.log("Help");
      const helpTemplate = document.querySelector(
        '[data-alpha="ocd-help-template"]',
      );
      ocdConsoleContent.innerHTML = "";
      appendTemplate(helpTemplate);
    };
    const resetConsoleStorage = () => {
      localStorage.removeItem('ocd-error-list');
      window.location.href = window.location.href;

      return false;
    }
    //START
    const consoleErrorEntry = (error, url) => {
      const div = document.createElement('div');
      div.className = 'ocd-console-entry';
      div.textContent = '> ';
    
      const span = Object.assign(document.createElement('span'), { 
        className: 'ocd-console-code', 
        textContent: error 
      });
    
      div.append(span);
    
      if (url) {  
        div.append(' - ', Object.assign(document.createElement('a'), { 
          className: 'ocd-console-error-link', 
          href: url, 
          textContent: url 
        }));
      }
    
      ocdConsoleContent.appendChild(div);
    };
    const showErrors = () => {
      try {
        const storedDataString = localStorage.getItem(errorListKey);
        if (storedDataString) {
          const storedData = JSON.parse(storedDataString);
          const uniqueConfigErrors = new Set(); // Track unique "ocd-config" errors
          for (const pageUrl in storedData) {
            if (storedData.hasOwnProperty(pageUrl)) {
              
              const errorList = storedData[pageUrl]; 
          
              errorList.forEach((error) => {
                if (!error.startsWith("ocd-config-")) {
                  consoleErrorEntry(`${error}`, `${pageUrl}`);
                  let errorTemplateSelector = `[data-alpha="${error}-template"]`;
                  let errorTemplate = document.querySelector(errorTemplateSelector);
                  appendTemplate(errorTemplate);
                } else if (!uniqueConfigErrors.has(error)) {
                  // Only process unique "ocd-config" errors
                  consoleErrorEntry(`${error}`, `${pageUrl}`);
                  let errorTemplateSelector = `[data-alpha="${error}-template"]`;
                  let errorTemplate = document.querySelector(errorTemplateSelector);
                  appendTemplate(errorTemplate);
                  uniqueConfigErrors.add(error); 
                }
              });
    
            }
          }
        } else {
          console.log("No data found in localStorage with key:", errorListKey);
        }
      } catch (error) {
        console.error(
          "Error retrieving and processing data from localStorage:",
          error,
        );
      }
    };


    //END
    const toggleConsole = () => {
      ocdConsoleContainer.classList.contains(OcdStates.HIDDEN)
        ? openConsole()
        : closeConsole();
    };
    const openConsole = () => {
      if (!ocdSettings.classList.contains(OcdStates.HIDDEN)) closeSettings();
      ocdConsoleContainer.classList.remove(OcdStates.HIDDEN);
      ocdConsoleContainer.inert = false;
      ocdConsoleContainer.setAttribute("aria-expanded", true);
      showErrors();
    };
    const closeConsole = () => {
      ocdConsoleContainer.classList.add(OcdStates.HIDDEN);
      ocdConsoleContainer.inert = true;
      ocdConsoleContainer.setAttribute("aria-expanded", false);

      //Clear the console
      ocdConsoleContent.innerHTML = "";
    };

    // OCD check for updates

    const localAlpha = document.querySelector(
      '[data-alpha="local-alpha-version"]',
    );
    const localHugo = document.querySelector(
      '[data-alpha="local-hugo-version"]',
    );

    const localAlphaVersion = localAlpha?.textContent || "";
    const localHugoVersion = localHugo?.textContent || "";

    let remoteAlphaVersion;
    let remoteHugoVersion;

    // Fetch remote versions
    const checkUpdates = () => {
      closeSettings();
      fetch(OcdStates.THEME_VERSION_URL)
        .then((responseAlpha) => {
          if (!responseAlpha.ok) {
            console.error(
              "Error fetching Alpha Version URL:",
              responseAlpha.status,
            );
            compareAlphaVersion();
          } else {
            return responseAlpha.json();
          }
        })
        .then((data) => {
          remoteAlphaVersion = data.version;
          compareAlphaVersion();
        })
        .catch((error) => {
          console.error(
            "Network error fetching Alpha Version URL:",
            error.message,
          );
          compareAlphaVersion();
        });

      fetch(OcdStates.HUGO_VERSION_URL)
        .then((responseHugo) => {
          if (!responseHugo.ok) {
            console.error(
              "Error fetching Hugo Version URL:",
              responseHugo.status,
            );
            compareHugoVersion();
          } else {
            return responseHugo.json();
          }
        })
        .then((json) => {
          remoteHugoVersion = json[0].name;
          compareHugoVersion();
        })
        .catch((error) => {
          console.error("Network error fetching HUGO_URL:", error.message);
          compareHugoVersion();
        });
    };

    // Append link for new versions helper function
    const appendLink = (url, title, text, element, badge, badge_class) => {
      element.innerHTML = "";
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.title = title;
      link.textContent = text;
      element.appendChild(link);
      badge.classList.add(badge_class);
    };

    // Fetch Errors function
    const checkError = (element, title, badge) => {
      element.innerHTML = "";
      element.textContent = "Error";
      element.title = title;
      badge.classList.add("ocd-check-error");
    };

    // Compare Alpha Theme Versions
    const compareAlphaVersion = () => {
      if (ocdConsoleContainer.classList.contains(OcdStates.HIDDEN))
        toggleConsole();
      const alphaBadge = document.querySelector(
        '[data-alpha="ocd-alpha-update-badge"]',
      );
      if (remoteAlphaVersion && remoteAlphaVersion !== localAlphaVersion) {
        console.log("Alpha update found");
        const updateMsg = "Update alpha to the latest version";
        const updateBadge = "ocd-update";

        appendLink(
          OcdStates.ALPHA_UPDATE_DOC,
          updateMsg,
          remoteAlphaVersion,
          localAlpha,
          alphaBadge,
          updateBadge,
        );
        const alphaUpdateTemplate = document.querySelector(
          '[data-alpha="ocd-alpha-updates-template"]',
        );
        console.log(alphaUpdateTemplate);
        appendTemplate(alphaUpdateTemplate);
      } else if (
        remoteAlphaVersion &&
        remoteAlphaVersion === localAlphaVersion
      ) {
        const noAlphaUpdateTemplate = document.querySelector(
          '[data-alpha="ocd-no-alpha-updates-template"]',
        );
        console.log("No Alpha updates");
        localAlpha.title = "You have the latest version";
        alphaBadge.classList.add("ocd-no-update");
        appendTemplate(noAlphaUpdateTemplate);
      } else {
        const errorMsg = "Could not check for alpha updates, try again later";
        checkError(localAlpha, errorMsg, alphaBadge);
      }
    };

    // Compare Hugo Versions
    const compareHugoVersion = () => {
      if (ocdConsoleContainer.classList.contains(OcdStates.HIDDEN))
        toggleConsole();
      const hugoBadge = document.querySelector(
        '[data-alpha="ocd-hugo-update-badge"]',
      );
      if (remoteHugoVersion && remoteHugoVersion !== localHugoVersion) {
        console.log("Hugo update found");
        const updateMsg = "Update alpha to the latest version";
        const updateBadge = "ocd-update";
        appendLink(
          OcdStates.ALPHA_UPDATE_HUGO_DOC,
          updateMsg,
          remoteHugoVersion,
          localHugo,
          hugoBadge,
          updateBadge,
        );
        const hugoUpdateTemplate = document.querySelector(
          '[data-alpha="ocd-hugo-updates-template"]',
        );
        appendTemplate(hugoUpdateTemplate);
      } else if (remoteHugoVersion && remoteHugoVersion === localHugoVersion) {
        const noHugoUpdateTemplate = document.querySelector(
          '[data-alpha="ocd-no-hugo-updates-template"]',
        );
        console.log("No Hugo updates");
        localHugo.title = "You have the latest version";
        hugoBadge.classList.add("ocd-no-update");
        appendTemplate(noHugoUpdateTemplate);
      } else {
        const errorMsg = "Could not check for alpha updates, try again later";
        checkError(localHugo, errorMsg, hugoBadge);
      }
    };

    // Select fab position
    const selectPosition = () => {
      const selectedValue = selectElement.value;

      // Update ocd position
      ocdContainer.classList.remove(
        OcdPositions.BOTTOM_LEFT,
        OcdPositions.BOTTOM_RIGHT,
      );
      ocdContainer.classList.add(selectedValue);

      // Store to localStorage
      localStorage.setItem("ocd-pos", selectedValue);

      // Update Selection
      const options = selectElement.querySelectorAll("option");
      options.forEach((option) => option.removeAttribute("selected"));
      const selectedOption = selectElement.querySelector(
        `option[value="${selectedValue}"]`,
      );

      if (selectedOption) {
        selectedOption.setAttribute("selected", "");
      }
    };

    // Close Settings modal function
    const closeSettings = () => {
      ocdSettings.classList.add(OcdStates.HIDDEN);
      ocdSettings.inert = true;
      ocdSettings.setAttribute("aria-expanded", false);
    };

    // Open Settings modal function
    const openSettings = () => {
      ocdSettings.classList.remove(OcdStates.HIDDEN);
      ocdSettings.inert = false;
      ocdSettings.setAttribute("aria-expanded", true);
    };

    // Toggle Ocd function
    const toggleSettings = () => {
      let isHidden = ocdSettings.classList.contains(OcdStates.HIDDEN);
      if (!ocdFab.classList.contains(OcdStates.ERROR)) {
        if (isHidden) {
          openSettings();
        } else {
          closeSettings();
        }
      } else {
        toggleConsole();
        ocdConsole.classList.toggle("ocd-console-error");
      }
    };
    // Event Listeners
    ocdOpenConsoleBtn?.addEventListener("click", toggleConsole);
    ocdConsoleCloseBtn?.addEventListener("click", closeConsole);
    ocdConsoleHelpBtn?.addEventListener("click", showConsoleHelp);
    ocdConsoleResetBtn?.addEventListener("click", resetConsoleStorage);
    ocdSettingsCloseBtn?.addEventListener("click", closeSettings);
    selectElement?.addEventListener("change", selectPosition);
    ocdUpdateBtn?.addEventListener("click", checkUpdates);
    ocdFab?.addEventListener("click", toggleSettings);
  })();
  document.addEventListener("DOMContentLoaded", restoreFabPosition);
})();

/*

  let fabPosition = localStorage.getItem("ocd-pos");
  if (fabPosition) {
    ocdFab.classList.remove("ocd-fab-bottom-left", "ocd-fab-bottom-right");
    ocdFab.classList.add(fabPosition);
  }
*/
/*
    const toggleSettings = () => {
      const ocdSettings = document.querySelector('[data-alpha="ocd-settings"]');
      let isHidden = ocdSettings.classList.contains("ocd-hidden");

      // Select FAB position function
      const selectPosition = () => {
        const selectElement = document.querySelector(
          '[data-alpha="ocd-select-position"]',
        );
        const selectedValue = selectElement.value;

        console.log("Selected value:", selectedValue);

        ocdFab.classList.remove("ocd-fab-bottom-left", "ocd-fab-bottom-right");

        ocdFab.classList.add(selectedValue);
        localStorage.setItem("ocd-pos", selectedValue);

        const options = selectElement.querySelectorAll("option");
        options.forEach((option) => option.removeAttribute("selected"));
        const selectedOption = selectElement.querySelector(
          `option[value="${selectedValue}"]`,
        );

        if (selectedOption) {
          selectedOption.setAttribute("selected", "");
          //selectedOption.selected = true; wont work on chrome
        }
      };

      // Open Settings modal function
      const openSettings = () => {
        ocdSettings.classList.remove("ocd-hidden");
        ocdSettings.inert = false;
        ocdSettings.setAttribute("aria-expanded", true);
        const ocdSettingsClose = document.querySelector(
          '[data-alpha="ocd-close-settings"]',
        );

        ocdSettingsClose?.addEventListener("click", closeSettings);

        const selectElement = document.querySelector(
          '[data-alpha="ocd-select-position"]',
        );

        if (fabPosition) {
          const options = selectElement.querySelectorAll("option");
          options.forEach((option) => option.removeAttribute("selected"));
          const optionToSelect = selectElement.querySelector(
            `option[value="${fabPosition}"]`,
          );

          if (optionToSelect) {
            optionToSelect.setAttribute("selected", "");
          }
        }
        selectElement.addEventListener("change", selectPosition);
      };

      //Close Settings modal function
      const closeSettings = () => {
        const ocdSettingsClose = document.querySelector(
          '[data-alpha="ocd-close-settings"]',
        );
        ocdSettings.classList.add("ocd-hidden");
        ocdSettings.inert = true;
        ocdSettings.setAttribute("aria-expanded", false);
        ocdSettingsClose.removeEventListener("click", closeSettings);
        const selectElement = document.querySelector(
          '[data-alpha="ocd-select-position"]',
        );
        selectElement.removeEventListener("change", selectPosition);
      };

      if (!ocdFab.classList.contains("ocd-fab-error") && isHidden) {
        openSettings();
      } else {
        closeSettings();
      }
    };
    ocdFab?.addEventListener("click", toggleSettings);
    */
/*
  (() => {
    document.addEventListener("DOMContentLoaded", function () {
      const currentPage = window.location.href;
  
      // ✅ Load existing error list
      let errorData = JSON.parse(localStorage.getItem("ocd-error-list")) || {};
  
      // ✅ Ensure the current page has an entry
      if (!errorData[currentPage]) {
        errorData[currentPage] = [];
      }
  
      // ✅ Extract error codes from the current page
      const pageErrors = new Set(errorData[currentPage]); // Preserve existing ones
      errorElements.forEach((element) => {
        const key = element.dataset.error;
        if (key) {
          pageErrors.add(key); // Add new errors
        }
      });
  
      // ✅ Save updated list (convert Set back to Array)
      errorData[currentPage] = [...pageErrors];
      localStorage.setItem("ocd-error-list", JSON.stringify(errorData));
    });
  
    window.addEventListener("load", function () {
      const currentPage = window.location.href;
      let errorData = JSON.parse(localStorage.getItem("ocd-error-list")) || {};
  
      // ✅ If no errors remain on this page, remove it from the list
      if (errorElements.length === 0 && errorData[currentPage]) {
        delete errorData[currentPage];
      }
  
      // ✅ Save updated list
      localStorage.setItem("ocd-error-list", JSON.stringify(errorData));
    });
  })();
  
*/
