---
layout:   post
title:    "Making dark mode play nicely with bfcache"
subtitle: "Who knew the back button could break dark mode?"
date:     2026-04-09 20:37:45 +0100
image:
  hero:   true
  path:   /assets/images/ship-by-king-carlos-I.png
  alt:    "A ship, hand-drawn by King Carlos I of Portugal."
tags:     [Web, JavaScript, CSS]
---

I try to avoid making this blog be about adding features to the blog, but I recently implemented a [dark mode] and hit a few snags that I felt might be worth talking about.

In addition to the dark mode, I added a toggle button to allow the reader to choose between dark, light and [system] themes. The button also [persists the user preference] so the reading experience is consistent across pages.

I thought everything was working great, until I noticed what happened when I navigated to a page, changed the theme and then pressed the browser's back button:

<video class="ratio-16-9 mb-1" src="/assets/videos/dark-mode-bf-cache.mp4" poster="/assets/images/dark-mode-bf-cache.png" loading="lazy" controls></video>

The previous page appeared with the old theme! This was unexpected because the `<head>` element contained this snippet[^1]:

```html
<script>
  let theme = localStorage.getItem('theme');
  if (theme) {
    document.documentElement.classList.add(`${theme}-theme`);
  }
</script>
```

This should be guaranteeing that the right theme was applied in each page navigation. However, the browser was retrieving the page from its [back-forward cache (bfcache)][bfcache], an optimization that enables instant navigation to previously visited pages but that can cause issues like this. Fixing this required three separate changes.

### 1. Switching the stale theme on bfcache restore

The bfcache stores a complete snapshot of each page in memory -- including the DOM, CSS and JavaScript state. When navigating back, the previous page is restored from such a snapshot. Since the page is not loaded from scratch, the JavaScript code in the `<head>` does not run (again).

Even though `localStorage` is always up-to-date, when a user changes themes and then goes back in browser history, the previous page is restored with the stale theme. This stale theme issue also manifests when a user goes back in browser history, changes themes and then goes _forward_ in browser history. A little far-fetched, but still a possible scenario.

The solution to both cases is to listen for the [`pageshow`] event and re-apply the theme stored in `localStorage`:

```js
self.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    let theme = localStorage.getItem('theme');
    let root = document.documentElement;
    root.classList.remove('light-theme', 'dark-theme');
    if (theme) {
      root.classList.add(`${theme}-theme`);
    }
  }
});
```

The `event.persisted` flag indicates whether the browser restored the page from the bfcache or loaded it fresh.

### 2. Preventing a flash of incorrect color theme

With the first fix in place, the theme switch happened correctly, but with a visible flash of color. The problem was that I had decided to make the theme swapping a little smoother, so I had added a CSS color transition to the page.
This now meant that when `pageshow` switched themes it would animate from the old theme to the new one.

To solve this, all CSS transitions were moved inside an `animatable` class, initially added to the `<html>` element:

```scss
.animatable {
  body {
    transition-property: color, background-color;
    transition-duration: 0.3s;
  }

  .theme-toggle {
    /* Button transitions */
  }
}
```

Then, this class is removed when the stale theme is updated on [`pageshow`]:

```diff
 self.addEventListener('pageshow', (event) => {
   if (event.persisted) {
     let theme = localStorage.getItem('theme');
     let root = document.documentElement;
-    root.classList.remove('light-theme', 'dark-theme');
+    root.classList.remove('light-theme', 'dark-theme', 'animatable');
     if (theme) {
       root.classList.add(`${theme}-theme`);
     }
+    setTimeout(() => {
+      root.classList.add('animatable');
+    });
   }
 });
```

Finally, the class is added back after the browser has had a chance to paint the new theme (I opted for a `setTimeout`).[^2]

### 3. Ensuring the toggle button switched to the right theme

My initial implementation of the theme toggle button cycled through all the themes using an index stored in a JavaScript variable:

```js
let themes = ['system', 'dark', 'light'];
let userTheme = localStorage.getItem('theme') || 'system';
let themeIndex = themes.indexOf(userTheme);

themeToggle.addEventListener('click', () => {
  themeIndex = (themeIndex + 1) % themes.length;
  let nextTheme = themes[themeIndex];
  // update page to use the next theme
});
```

This seemed ok, but it would swap to the wrong theme after a page was restored from the bfcache with a stale theme. On `pageshow`, the theme was updated, but the in-memory `themeIndex` was not! So the `themeIndex` would stop matching the currently chosen theme.

Rather than syncing the index variable on `pageshow`, I opted for deriving the current theme index from the DOM on each button click:

```js
themeToggle.addEventListener('click', () => {
  let themeIndex = 0;
  for (let className of root.classList) {
    let match = className.match(/(.*)-theme/);
    let theme = match && match[1];
    if (theme) {
      themeIndex = themes.indexOf(theme);
      break;
    }
  }
  themeIndex = (themeIndex + 1) % themes.length;
  let nextTheme = themes[themeIndex];
  // update page to use the next theme
});
```

No more stale state to worry about. The less state, the better.

---

Making the look of this blog configurable by the reader ended up being more complex than I expected. Animating the theme change also complicated things further. If I had kept it simple (just a regular dark mode using [`@media (prefers-color-scheme: dark)`] and [`light-dark()`]) I wouldn't have hit so many problems.

Still, the issues I found were not really related to dark mode. They were just the sum of the bfcache plus a user choice that persisted across page navigations. Issues like these can surface on any multi-page site that keeps user state. An e-commerce site may show a stale shopping cart or wishlist when a user navigates back. Or a news site may display articles in a grid layout even after a user changes it to a list layout if he then navigates back.

The point is that while the [bfcache] makes it really fast to access previous pages, it does introduce its own set of challenges. Making dark mode work seamlessly is just one of those challenges.[^3]

Incidentally, I tested my favourite tech news site, [Ars Technica], and it has the same stale theme issue! It's a minor quibble, but this sort of stuff might be more common than I thought. And it's not that hard to fix!


[^1]: If this snippet is included at the bottom of the page (and not in the `<head>` element) we run the risk of witnessing a flash of incorrect color theme.

[^2]: Another option is to initially omit the `animatable` class from the `<html>` element, and only add it when the theme toggle button is clicked. Then remove the class after the animations end.

[^3]: Another challenge is analytics. Pages restored from the bfcache don't count as new pageviews. If we want to count those we also need to use the `pageshow` event.


[dark mode]: https://bnijenhuis.nl/notes/user-friendly-dark-mode/
[system]: https://kilianvalkhof.com/2020/design/your-dark-mode-toggle-is-broken/
[persists the user preference]: https://www.smashingmagazine.com/2024/03/setting-persisting-color-scheme-preferences-css-javascript/
[bfcache]: https://web.dev/articles/bfcache
[`pageshow`]: https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event
[`@media (prefers-color-scheme: dark)`]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme
[`light-dark()`]: https://www.bram.us/2023/10/09/the-future-of-css-easy-light-dark-mode-color-switching-with-light-dark/
[Ars Technica]: https://arstechnica.com/
