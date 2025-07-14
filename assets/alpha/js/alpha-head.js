/**
 * Primary JavaScript entry point for the Alpha theme.
 *
 * This script serves as the primary JavaScript bundle for the Alpha theme.
 * It utilizes ES modules and is processed by Hugo Pipes, enabling conditional
 * loading of specific modules and associated translations based on site 
 * configuration.
 *
 * The theme supports multilingual sites by generating a distinct 
 * `alpha-head-[lang].js` file for each configured language ensuring optimal 
 * localization.
 *
 * IMPORTANT:
 * Direct modifications to this file (`themes/alpha/assets/js/alpha-head.js`)
 * will be overwritten during Alpha theme updates.
 * To customize JavaScript:
 *  1. For extensive modifications or to override specific theme JavaScript 
 *     files:
 *     Copy the relevant files from the folder `themes/alpha/assets/js/` to your
 *     project's root `/assets/js/` directory.
 *     Files in your project's `/assets/js/` will take precedence.
 *  2. For adding supplementary JavaScript without altering theme files:
 *     - Use `assets/js/custom-tail.js` (loaded before the closing </body> tag).
 */

// Conditional Module Imports & Initialization
// Modules in this section are imported and initialized based on site
// parameters defined in  `params.toml`

// Prefetch links destination on marked links `data-prefetch="true"`, `data-prerender= "true"`.
{{- if eq .Site.Params.prefetch_enabled true }}
  import { initPrefetch } from './modules/prefetch.js';
  initPrefetch();
{{- end }}

  // Visitor-configurable settings.
{{- if eq .Site.Params.visitor_settings true }}
  import { initVisitorSettings } from './modules/visitor-settings.js';
  // VIsitor i18n strings
const visitorSettingsI18n = {
  settingsElementsMissing: {{ printf "%q" (i18n "SettingsElementsMissing" . | default "Visitor settings elements are missing. The setting functionality is disabled.") }},
  settingsOpen: {{ printf "%q" (i18n "SettingsOpened" . | default "Settings modal is open") }},
  settingsClose: {{ printf "%q" (i18n "SettingsClosed" . | default "Settings modal is closed") }},
  trackingDisabled: {{ printf "%q" (i18n "TrackingDisabled" . | default "Anomymous tracking is disabled") }},
  trackingEnabled: {{ printf "%q" (i18n "TrackingEnabled" . | default "Anomymous tracking is enabled") }},
  prefetchDisabled: {{ printf "%q" (i18n "PrefetchDisabled" . | default "Prefetch function is disabled") }},
  prefetchEnabled: {{ printf "%q" (i18n "PrefetchEnabled" . | default "Prefetch function is enabled") }}
};
  initVisitorSettings(visitorSettingsI18n);
{{- end }}

  // Snackbar for privacy/cookie consent notice.
{{- if eq .Site.Params.noCookies_snackbar true }}
  import { initPrivacySnackbar } from './modules/privacy-snackbar.js';
  // Snackbar i18n strings
const privacySnackbarI18n = {
  privacySbElemMiss: {{ printf "%q" (i18n "PrivacySnackbarElementsMissing" . | default "Privacy snackbar elements are missing. The disclaimer snackbar is disabled.") }},
  snackbarOpen: {{ printf "%q" (i18n "SnackbarOpened" . | default "Privacy disclaimer is open") }},
  snackbarClose: {{ printf "%q" (i18n "SnackbarClosed" . | default "Privacy disclaimer is closed.") }}
};
  initPrivacySnackbar(privacySnackbarI18n);
{{- end }}

  // Alpha's modal for Pagefind client-side search functionality integration.
{{- if eq .Site.Params.pagefind_enabled true }}
  import { initPagefindAlpha } from './modules/pagefind-alpha.js';
  // Pagefind Alpha i18n strings
const pagefindAlphaI18n = {
  searchContMiss: {{ printf "%q" (i18n "SearchContainerMissing" . | default "Critical UI element missing: Search container (searchCont) not found. Search Modal disabled.") }},
  searchBtnMiss: {{ printf "%q" (i18n "SearchBtnMissing" . | default "Critical UI element missing: Search button (searchBtn) not found. Search Modal disabled.") }}
};
  initPagefindAlpha(pagefindAlphaI18n);
{{- end }}

// These modules are fundamental to the theme's base functionality and user experience.

// Removes lazy loading for images above the fold.

import { initLazyLoad } from "./modules/lazy-load.js";
initLazyLoad(); 


// Provides "Copy to clipboard" functionality for code blocks.
import { initCopyCode } from "./modules/copy-code.js";
// Copy-code i18n strings
const copyCodeI18n = {
  copied: {{ printf "%q" (i18n "Copied" . | default "Copied!") }},
  copy: {{ printf "%q" (i18n "Copy" . | default "Copy") }},
  failedCopy: {{ printf "%q" (i18n "FailedCopy" . | default "Failed to copy text:") }},
  copyToClipboardAria: {{ printf "%q" (i18n "CopyToClipboard" . | default "Copy to clipboard") }}
};

initCopyCode(copyCodeI18n);

// Manages the main Hamburger menu.
import { initMenu } from "./modules/menu.js";
// Menu i18n strings
const menuI18n = {
  menuElemMiss: {{ printf "%q" (i18n "MenuElementsMissing" . | default "Menu elements are missing. Menu is disabled.") }},
  menuOpen: {{ printf "%q" (i18n "MenuOpened" . | default "Menu opened. Press Escape to close, Tab to navigate within menu.") }},
  menuClose: {{ printf "%q" (i18n "MenuClosed" . | default "Menu closed.") }}
};

initMenu(menuI18n);

// Handles color scheme management.
import { initColorScheme } from "./modules/color-scheme.js";
// Color scheme i18n strings
const colorSchemeI18n = {
  colorSchemeElemMiss: {{ printf "%q" (i18n "ThemeButtonMissing" . | default "Theme toggle button or icon not found.") }}
};

initColorScheme(colorSchemeI18n);

// Adds a Material Design-style ripple effect to button interactions.
import { initRippleButtons } from "./modules/ripple-buttons.js";
initRippleButtons();
