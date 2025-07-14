/**
 * Dedicated JavaScript entry point for the Alpha theme's contact form functionality.
 *
 * This script serves as a specialized JavaScript bundle for the Alpha theme's
 * contact form. Is processed by Hugo Pipes, enabling conditional loading of the * contact module and associated translations based on site configuration  
 * (specifically, the presence of `make_hook`).
 *
 * The theme supports multilingual sites by generating a distinct
 * `alpha-contact-[lang].js` file for each configured language, ensuring optimal 
 * localization for contact form messages.
 *
 * PERFORMANCE & MODULARITY:
 * `alpha-contact.js` is loaded by Hugo *only* on pages that include the contact * form. It is separate from the main JavaScript bundles (`alpha-head.js`) to 
 * avoid loading contact-specific code on pages where it's not needed.
 *
 * IMPORTANT:
 * Direct modifications to this file (`themes/alpha/assets/js/alpha-contact.js`)
 * will be overwritten during Alpha theme updates.
 * To customize the contact form's JavaScript logic, consider overriding the
 * imported module: `assets/js/modules/contact.js` in your project root.
 */

// Conditional Module Import & Initialization
// The contact form module is imported and initialized only if a Make.com
// hook is defined in the site's parameters (`params.toml`).

// Initializes contact form functionality using a Make.com webhook.
{{- with .Site.Params.make_hook }}
  import { initContactForm } from './modules/contact.js';

  // The Make.com hook URL is passed from Hugo to JavaScript.
  const makeHookEndpoint = {{ printf "%q" . }};

  // Initialize the contact form module with the resolved endpoint.
  initContactForm(makeHookEndpoint);
{{- else }}
  console.warn("Alpha Theme: Contact form module not loaded. The `make_hook` parameter is not defined in site configuration. The contact form will not be functional.");
{{- end }}

