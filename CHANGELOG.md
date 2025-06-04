# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]
### Changed
- Refactored shortcodes to use semantic  elements instead of generic `<div>`.
- Added default and fallback headings to improve accessibility.
- Implemented unique `id`/`aria-labelledby` pairs using to prevent duplicate IDs when shortcodes appear multiple times on a page.
- Added appropriate default heading values to `i18n/en.toml`.

### Added
- Tailwind and CSS rules for updated semantic wrappers 
([#9](https://github.com/oxypteros/alpha/pull/9))

## [0.1.1-beta] — 2024-06-01
### Fixed
- Resolved an issue where heading elements could overflow their containers on narrow viewports, causing horizontal scrolling. Long words within headings now correctly wrap. ([#8>](https://github.com/oxypteros/alpha/pull/8))

### Added
- Enabled manual hyphenation support (`hyphens: manual;` with `&shy;­`) for frontmatter `title` and shortcode parameters `TITLE` to allow manual word breaks.

## [0.1.0-beta] — 2024-05-29

### Added
-   Foundation of the Alpha theme, establishing:
    -   Core theme structure compatible with Hugo :`^v0.146.1`.
    -   Essential layouts for common page types: `home`, `list`, `page`, `story`, `taxonomy` , `terms` , and `utility`.
    -   A versatile collection of initial shortcodes for content building:
        -   `[about]`
        -   `[cta]`
        -   `[faq]`
        -   `[featured]`
        -   `[hero]`
        -   `[num-list]` 
        -   `[recent]` 
        -   `[recommended]` 
        -   `[social]` 
        -   `[status-card]`
        -   `[text-content]`
        -   `[text-snippet]`
    -   Initial `exampleSite/` demonstrating theme usage and features.
    -   Configuration structure in `config/_default/` for theme-specific parameters (e.g., `params.toml`, `menus.toml`).
    -   Core documentation files: `README.md`, `LICENSE`, and `CHANGELOG.md`.

---
