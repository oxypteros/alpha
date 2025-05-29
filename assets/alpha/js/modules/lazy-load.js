// assets/alpha/js/modules/lazy-load.js

/**
 * @file Removes lazy loading from above-the-fold images on Alpha theme.
 * @module modules/lazy-load
 *
 * @summary Removes the `loading="lazy"` attribute from an image if it's
 * found within the first `<figure>` element of designated content containers.
 *
 * @description
 * This module targets specific container elements by their IDs. For each 
 * container, it checks if its first child is a `<figure>`. If so, and if that 
 * `<figure>` contains an image with `loading="lazy"`, the attribute is removed.
 * This ensures that primary images in Alpha theme are loaded eagerly to improve 
 * Largest Contentful Paint (LCP).
 *
 */

export const initLazyLoad = () => {
  const ids = ["article-content", "page-content", "story-content"];

  ids.forEach((id) => {
    const container = document.getElementById(id);

    if (container) {
      const firstChild = container.firstElementChild;

      if (firstChild && firstChild.tagName === "FIGURE") {
        const img = firstChild.querySelector('img[loading="lazy"]');

        if (img) {
          img.removeAttribute("loading");
        }
      }
    }
  });
  //console.log("lazy-load.js imported");
};
