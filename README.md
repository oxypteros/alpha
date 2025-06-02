<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/oxypteros/alpha/refs/heads/main/.github/screenshots/alpha-header-dark.webp">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/oxypteros/alpha/refs/heads/main/.github/screenshots/alpha-header.webp">
  <img alt="Alpha header demo screenshot" src="https://raw.githubusercontent.com/oxypteros/alpha/refs/heads/main/.github/screenshots/alpha-header.webp">
</picture>

# Alpha — Hugo Theme
[![Latest Release](https://img.shields.io/github/v/release/oxypteros/alpha?label=Release&style=flat&color=5f5f5f)](https://github.com/oxypteros/alpha/releases/latest)
[![Hugo Version](https://img.shields.io/badge/Hugo-%5E0.146.1-5f5f5f?&style=flat&logoColor=white)](https://github.com/gohugoio/hugo/releases)
[![License](https://img.shields.io/github/license/oxypteros/alpha?label=License&style=flat&color=5f5f5f)](https://github.com/oxypteros/alpha/blob/main/LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/oxypteros/alpha?label=Last%20Commit&style=flat&color=5f5f5f)](https://github.com/oxypteros/alpha/commits/main)
[![Stars](https://img.shields.io/github/stars/oxypteros/alpha?label=Stars&style=flat&color=5f5f5f)](https://github.com/oxypteros/alpha/stargazers)


[![Live Demo](https://img.shields.io/badge/Demo-alpha.oxypteros.com-2196f3)](https://alpha.oxypteros.com)
[![Docs](https://img.shields.io/badge/Docs-Available-2196f3)](https://alpha.oxypteros.com/docs)
---
![Netlify](https://img.shields.io/netlify/:865e5cb8-b588-4738-a1ea-169c89f3d3c5?label=Netlify&style=flat&color=5f5f5f&logo=netlify&logoColor=ffffff)

## Table of Contents
- [Introduction](#built-for-writers-from-a-readers-perspective)
- [Features](#features)
- [Installation](#installation)
- [Demo](#demo)
- [Need help?](#need-help)
- [Feedback or Questions](#feedback-or-questions)
- [Versioning & Changelog](#versioning--changelog)
- [License](#license)
  
## Built for writers, from a reader’s perspective.
**Alpha** is a beginner-friendly theme for [Hugo](https://gohugo.io/), designed specifically for *personal*, *text-based* websites. Its core philosophy is centered around the reading experience.

Alpha is a **shortcode based theme** that lets you customize content and layout without editing theme files. It follows a **zero-distraction** design while remaining feature rich and highly configurable. It's ideal for *creative writing* projects, *articles*, *blogs* and long-form writing

## Features
- Unobtrusive, content-focused design
- Shortcode based customizations
- Multilingual suport
- Accessible-first markup
- Performance optimized
- OCD (a discreet helper)
- Optional Tailwind development mode
- Optional search with Pagefind
- Optional analytics with GoatCounter
- Complete documentation

## Installation
**New to Hugo?** Start with, ["From Zero with Zero"](https://alpha.oxypteros.com/get-started)
For complete instructions and configuration, see the [documentation](https://alpha.oxypteros.com/docs).

### Quick Install

#### Prerequisites
- **Git**
- **Hugo** (`^0.146.1`)
- Node.js (*optional, for Tailwind CSS*)
- Go (*only if using Hugo Module method*)

#### For a new site or testing 

**Manual Setup —  Option 1** 
1. [Download the Alpha Starter](https://alpha.oxypteros.com/downloads/alpha-starter.zip).
2. Unzip and navigate into the folder:
```bash
cd alpha-starter
hugo server

```
 **Use GitHub template — Option 2**
1. Go to the [Alpha Starter](https://github.com/oxypteros/alpha-starter).
2. Click the **“Use this template”** button to create a new repository.
3. Clone your new repo locally a navigate into the repo folder and run:
```bash
cd YOUR-PROJECT-NAME
hugo server
```

#### For a existing Hugo site
**Git Submodule — Option 1**
``` bash
git submodule add https://github.com/oxypteros/alpha.git themes/alpha
```
In your `hugo.toml`:
```toml
theme = "alpha"
```
**Hugo module — Option 2** (*requires golang*)
1. Initialize your site as a module (*if not already*):
```bash
hugo mod init github.com/yourusername/yoursite
```
2. Add Alpha as a dependency:
```bash
hugo mod get github.com/oxypteros/alpha
```
3. Reference the theme in `hugo.toml`:
```toml
theme = ["github.com/oxypteros/alpha"]
```
> Copy or [download](https://alpha.oxypteros.com/downloads/config.zip) the `themes/alpha/config/_default/` to your root `config/` folder and merge carefully to avoid overwriting your existing setup.

## Demo
[Alpha in action](https://alpha.oxypteros.com)

## Need help?
- [Documentation](https://alpha.oxypteros.com/docs)
- [Developing Alpha (Tailwind setup)](https://alpha.oxypteros.com/docs/developing-alpha)

## Feedback or Questions?
- [Open an issue](https://github.com/oxypteros/alpha/issues) 
- [Contact me](mailto:alpha@oxypteros.com?subject=Alpha%20theme).

## Versioning & Changelog

### Versioning

This theme uses Semantic Versioning:
```
MAJOR.MINOR.PATCH

```
- **MAJOR** — Breaking changes, large reworks, changes incompatible with previous configurations, or significant updates required due to incompatible changes in upstream dependencies (like Hugo).
- **MINOR** — New features, enhancements, or content that is backward compatible.
- **PATCH** — Bug fixes, content tweaks, small updates, or non-breaking config changes.


**Hugo Version Compatibility:** Alpha is a *"living theme"*, it evolves alongside Hugo itself. My goal is to adopt improvements and best practices from new Hugo releases as they become relevant and beneficial to the theme.

This means Alpha **does not aim to stay locked to older Hugo versions**. But to embrace modern Hugo capabilities to provide a better user and developer experience.
If a theme update requires a new minimum Hugo version, this will be clearly noted in the documentation and in the changelog.

### Changelog

You can find all changes in [CHANGELOG.md](./CHANGELOG.md).
## License
This theme is released under the [MIT License](./LICENSE).  

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/screenshots/alpha-footer-dark.webp">
  <source media="(prefers-color-scheme: light)" srcset=".github/screenshots/alpha-footer.webp">
  <img alt="Alpha footer demo screenshot" src=".github/screenshots/alpha-footer.webp">
</picture>
