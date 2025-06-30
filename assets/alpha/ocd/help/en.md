### About the OCD System

OCD, or **On-page Component Diagnostics**, is a built-in system designed to help you build better websites by catching common errors and configuration mistakes before your site goes live.

Its goal is to act as a helpful assistant, providing clear, actionable feedback directly within your development environment.

---

### How It Works

The OCD system primarily works in two ways, and **only when you are in development mode** (running `hugo server`). These warnings will never appear on your deployed, live website.

1.  **Terminal Warnings (`warnf`):** For every issue detected, a detailed message is printed in your terminal console.
2.  **On-Page Warnings:** For many issues, a visual warning card will appear on your page. Clicking the icon in the top right of this card opens the **Console** you are reading now.

---

### Configuration

You can control the OCD system via your site's configuration (`config/_default/params.toml`).

*   To control the on-page visual warnings, set `ocd_enabled = false`.
*   To control the terminal warnings, set `ocdWarn_enabled = false`.

---

### The `help` Shortcode

The `< help >` shortcode is a special utility designed to render the detailed console explanation for a specific error code directly on your page.

**Usage:**