# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---
<!--## [1.0.0-rc] — 2025-07-10-->
## [Unreleased] 

### [BREAKING CHANGE]
- **Standardized Shortcode Naming:** To ensure system stability and future compatibility, all shortcodes with hyphens in their names have been renamed to use `snake_case`. If you are upgrading, you **must** update your shortcode calls in your content files (e.g., `{{< status-card >}}` must be changed to `{{< status_card >}}`).

### Changed
- **Project OCD Rebranded to `LiVa`:** The entire validation system, has been rebranded to `LiVa` (Linting Validator) for clarity.
- **Overhauled LiVa System (1.0.0-rc):** Completely refactored the error detection and reporting system for significantly improved accuracy, performance, and maintainability.
    - All shortcode validation rules have been moved from shortcode files into a centralized `data/shortcodes/rules.toml` file, making the system dramatically easier to use and maintain.
    - The shortcode input error reporting use also `data/liva/` toml files improving the modularity of LiVa
    - Separated functionality into distinct contexts: a global terminal scope for build-time errors and on-page UI components for content creators.
    - Ensured a complete separation of concerns, decoupling the LiVa from the Alpha theme for better portability and future development.
    - Resolves issues [1](https://github.com/oxypteros/alpha/issues/1), [5](https://github.com/oxypteros/alpha/issues/5), [6](https://github.com/oxypteros/alpha/issues/6)
- **Example Site:** Updated all demo and example site content to align with the new shortcode names and validation system.
- **Dependency Updates:** Upgraded Tailwind CSS and `tailwind/cli` to their latest versions for improved performance and access to new features.

## [0.3.0-beta] — 2025-06-16
### Added
- **SEO Image Support:** 
    - Automatically control and optimizes social sharing images (Open Graph, Twitter Cards, Schema.org) for all page types.
    - Intelligently sources images from page bundles or a global `assets/img` directory.
    - LiVa warnings for missing or improperly sized images for best practices.

### Changed
- **Refactored Schema.org metadata** to include images on all page types and minor changes to JSON-LD structure to meet current Google and Schema.org best practices.
- **Improved performance of 'Recommended Posts'** partial by implementing `hugo.Store` based caching, resulting in significantly faster builds (relates to [#4](https://github.com/oxypteros/alpha/issues/4)).
- **Refactored card components** to a single shared partial (`components/card-post.html`), improving maintainability and ensuring visual consistency across the site (relates to [#3](https://github.com/oxypteros/alpha/issues/3)).

### Fixed
- **Corrected logic in 'Recommended Posts'** partial to handle edge cases more reliably (resolves [#4](https://github.com/oxypteros/alpha/issues/4)).

## [0.2.0-beta] — 2025-06-11
### Changed
- **Optimized series navigation performance** by refactoring the logic to use Hugo's fast taxonomy system. This significantly reduces build times on sites with large series.
- **Restructured head partials** to be more modular and efficient, improving overall site performance and SEO scores.
- **Refactored all content shortcodes** for improved accessibility and SEO by:  
    - Using semantic HTML elements instead of generic `<div>`s.
    - Added default and fallback headings to improve accessibility.
    - Ensuring unique element `id`s on pages where a shortcode is used multiple times.
    - Adding CSS and Tailwind utility classes to support the new semantic structure.

### Added
- **SEO features**, including dedicated partials for:
    - JSON-LD Schema.
    - Open Graph metadata for social sharing (Facebook, LinkedIn).
    - Twitter Cards for sharing on X
- **Favicon support**, allowing for user-defined light and dark mode favicons, as well as `apple-touch-icon` and `android-chrome` icons.
- **Default security headers and a Content Security Policy (CSP)** for out-of-the-box support on Cloudflare Pages, Netlify, and Vercel.
- **Default i18n heading values** in `i18n/en.toml` to improve accessibility and provide sensible fallbacks for shortcodes.

([#11](https://github.com/oxypteros/alpha/pull/11))
([#9](https://github.com/oxypteros/alpha/pull/9))

## [0.1.1-beta] — 2025-06-01
### Fixed
- Resolved an issue where heading elements could overflow their containers on narrow viewports, causing horizontal scrolling. Long words within headings now correctly wrap. ([#8>](https://github.com/oxypteros/alpha/pull/8))

### Added
- Enabled manual hyphenation support (`hyphens: manual;` with `&shy;­`) for frontmatter `title` and shortcode parameters `TITLE` to allow manual word breaks.

## [0.1.0-beta] — 2025-05-29

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
