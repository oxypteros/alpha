<div class="liva-help-message">

### About the LiVa System

**LiVa** (*Linting Validator*) is a built-in system designed to help you, while you create content in your website, by catching common errors and configuration mistakes before your site goes live.

It acts like a helpful assistant, providing clear, actionable feedback directly within your development environment.

### How It Works

The LiVa system works in three main ways—and **only when you're in development mode** (running `hugo server`). These warnings will never appear on your deployed site.

1. **Terminal Warnings:** Every issue detected is logged in your terminal with detailed info. This has global scope, so errors from any page will be reported, even during a regular `hugo` build (**without breaking it**).
2. **Page Warnings:** For content related issues, a visual card will appear directly on the page containing the error. You must be viewing the specific page to see it.
3. **Console Warnings:** Warning that will appear in the current panel when also the page is loaded. Like page warnings, they are scoped per page, but you can see errors from other open tabs too.


### Configuration

You can control the LiVa system from your site's configuration params file (`config/_default/params.toml`).

* To control the visual warnings (page and console), set `liva_enabled = false`.
* To control the terminal warnings, set `livaWarn_enabled = false`.

By default, both systems are active during development. No LiVa files or dependencies are ever included in your production website, regardless of these settings.

### The help Shortcode

The <span class="liva-mono">&lbrace;&lbrace;&lt; help &gt;&rbrace;&rbrace;</span> shortcode is a development-only utility that displays help for various Alpha components. The current version provides help for `shortcodes` and `markdown` syntax.

**Usage:** <span class="liva-mono">&lbrace;&lbrace;&lt; help TYPE="markdown" &gt;&rbrace;&rbrace;</span> 
**Valid TYPE Values:** `markdown`, `shortcodes`

</div>
