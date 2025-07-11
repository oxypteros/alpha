// assets/alpha/js/modules/prefetch.js

/**
 * @file Enables link prefetching and prerendering for faster navigation.
 * @module modules/prefetch
 *
 * @summary Optimizes perceived speed by loading or rendering potential next
 * navigations. It prioritizes the Speculation Rules API if available, falling
 * back to traditional `<link rel="prefetch/prerender">` tags for broader
 * compatibility.
 *
 * @description
 * This module enhances user experience by attempting to load resources for
 * links marked with `data-prefetch="true"` or `data-prerender="true"`.
 *
 * Behavior:
 * 1. Checks User Preference & Connection:
 *    - Respects a `localStorage` item to disable the feature.
 *    - Avoids prefetching/prerendering on slow connections (effective types:
 *      "slow-2g", "2g", "3g") or if the user has Data Saver mode enabled,
 *      leveraging the Network Information API where available.
 * 2. Speculation Rules API (Primary Method):
 *    - If the browser supports `HTMLScriptElement.supports('speculationrules')`
 *      a `<script type="speculationrules">` tag is dynamically appended to the
 *      document head. This script instructs the browser to prerender links
 *      with `data-prerender="true"` and prefetch links with
 *      `data-prefetch="true"`.
 *      The `eagerness` is set to "conservative".
 * 3. Fallback Mechanism:
 *    - If Speculation Rules are not supported, the module iterates through all
 *      links with `data-prefetch="true"` or `data-prerender="true"` and
 *      dynamically appends the corresponding `<link rel="prefetch">` or
 *      `<link rel="prerender">` tags.
 *    - A `data-resource-fetched="true"` attribute is added to links once
 *      processed by the fallback mechanism to prevent duplicate link tags.
 *
 * This script is typically loaded in the `<head>` and conditionally enabled
 * with `enable_prefetch` in `params.toml`).
 *
 *  CSP - Hash for speculation rules : 
 * 'sha256-7hU1nhtHxQh8ziW5xcD1HB2QhOc24LKd7TLXNfXSCcc='
 * 
 * @see {@link https://developer.chrome.com/blog/speculation-rules/} 
 * - For Speculation Rules API.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation} 
 * - For Network Information API.
 */

export const initPrefetch = () => {
  // Function to append Speculation Rules script
  const appendSpeculationScript = () => {
    const speculationScript = document.createElement("script");
    speculationScript.type = "speculationrules";
    const speculationRules = {
      prerender: [
        {
          source: "document",
          where: {
            selector_matches: "[data-prerender=true]",
          },
          eagerness: "conservative",
        },
      ],
      prefetch: [
        {
          source: "document",
          where: {
            selector_matches: "[data-prefetch=true]",
          },
          eagerness: "conservative",
        },
      ],
    };
    speculationScript.textContent = JSON.stringify(speculationRules);
    document.head.appendChild(speculationScript);
  };

  // Fallback for prefetching & prerendering
  const enableFallback = () => {
    ["prefetch", "prerender"].forEach((rel) => {
      document.querySelectorAll(`a[data-${rel}="true"]`).forEach((link) => {
        if (!link.dataset.resourceFetched) {
          const resourceLink = document.createElement("link");
          resourceLink.rel = rel;
          resourceLink.href = link.href;
          document.head.appendChild(resourceLink);
          link.dataset.resourceFetched = "true";
          //console.log(`${rel}ed:`, link.href);
        }
      });
    });
  };

  // Main logic
  const getPrefetchStatus = localStorage.getItem("prefetch");
  if (getPrefetchStatus === null) localStorage.setItem("prefetch", "true");
  if (getPrefetchStatus === "false") return;
  const connection = navigator.connection || {};
  const isSlowConnection = ["slow-2g", "2g", "3g"].includes(
    connection.effectiveType,
  );
  const isDataSaverEnabled = connection.saveData === true;

  if (isSlowConnection || isDataSaverEnabled) {
    console.log(
      "Prefetch/prerender disabled due to slow connection or Data Saver mode.",
    );
    return;
  } else if (HTMLScriptElement.supports?.("speculationrules")) {
    //console.log('Speculation rules appended');
    appendSpeculationScript();
  } else {
    //console.warn("Fallback prefetch/prerender enabled.");
    enableFallback();
  }
  //console.log("prefetch.js imported");
};
