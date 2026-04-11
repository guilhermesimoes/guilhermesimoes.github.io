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

I try to avoid making this blog be about adding features to the blog, but I recently added a [dark mode] to the blog and I hit a few snags that I felt might be worth talking about.

In addition to the dark mode, I added a toggle button to allow the reader to choose between dark, light and [system] themes. The button also [stores the user preference] so the reading experience is consistent between pages.

I thought everything was working great, until I noticed what happened when I navigated to a page, changed the theme and then pressed the back button of the browser:

<video class="ratio-16-9" src="/assets/videos/dark-mode-bf-cache.mp4" poster="/assets/images/dark-mode-bf-cache.png" loading="lazy" controls></video>

The previous page was retrieved from the browser's [back-forward cache (bfcache)][bfcache] with the old theme! Fixing this required three separate changes.

### 1. Switching the stale theme on bfcache restore

The bfcache stores a complete snapshot of each page in memory -- including the DOM, CSS and JavaScript state. So when a user changes themes and then goes back in browser history, the previous page is restored with the stale theme, even though `localStorage` rightly contains the last user-chosen theme. This stale theme issue also manifests when a user goes back in browser history, changes themes and then goes _forward_ in browser history. A little far-fetched, but still a possible scenario.

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

The `event.persisted` flag indicates whether the page was restored from the bfcache or loaded fresh.

### 2. Preventing a flash of incorrect color theme

With the first fix in place, the theme switch happened correctly, but with a visible flash of color. The problem was that I had decided to make the theme swapping a little smoother, so I had added a CSS color transition to the page.
This now meant that when `pageshow` switched themes it would animate from the old theme to the new one.

To solve this, all CSS transitions were moved inside an `animatable` class:

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

This class is initially added to the `<html>` element but it's removed on [`pageshow`], before replacing the stale theme.[^1] The class is added back after the browser has had a chance to paint the new theme (I opted for a `setTimeout`):

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

### 3. Avoiding the stale state of the theme toggle button

My initial implementation of the theme toggle button cycled through all the themes using an index stored in a JavaScript variable:

```js
let themes = ['system', 'dark', 'light'];
let userTheme = localStorage.getItem('theme') || 'system';
let themeIndex = themes.indexOf(userTheme);

themeToggle.addEventListener('click', () => {
  themeIndex = (themeIndex + 1) % themes.length;
  let nextTheme = themes.at(themeIndex);
  // update page to use the next theme
});
```

This seemed ok, but it misbehaved when a page restored from the bfcache had a stale theme. On `pageshow`, the theme was updated, but the in-memory `themeIndex` was not! So the `themeIndex` no longer matched the currently chosen theme.

Rather than trying to sync the index variable on the `pageshow` event, I found it simpler to derive the current theme index from the DOM on each button click:

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
  let nextTheme = themes.at(themeIndex);
  // update page to use the next theme
});
```

No stale state to worry about. The less state, the better.

---

Making the look of this blog configurable by the reader ended up being more complex than I expected. Animating the theme change also complicated things further. If I had kept it simple (just a regular dark mode using [`@media (prefers-color-scheme: dark)`] and [`light-dark()`]) I wouldn't have hit so many problems.

Still, the issues I found were not really related to dark mode. They were just the sum of the bfcache plus a user choice that persisted across page navigations. Issues like these can surface on any multi-page site that keeps user state. An e-commerce site may show a stale shopping cart or wishlist when a user navigates back. A news site may display articles in a grid layout even after a user changes it to a list layout if he then navigates back.

The point is that while the [bfcache] makes it really fast to access the previous page, it does introduce its own set of challenges. Making dark mode work seamlessly is just one of those challenges.

Incidentally, I tested my favourite tech news site, [Ars Technica], and it has the same stale theme issue! It's a minor quibble, but this sort of stuff might be more common than I thought. And it's not that hard to fix!


[^1]: Another option was to only add the `animatable` class when the theme toggle button is clicked and then remove it after the animations end.


[dark mode]: https://bnijenhuis.nl/notes/user-friendly-dark-mode/
[system]: https://kilianvalkhof.com/2020/design/your-dark-mode-toggle-is-broken/
[stores the user preference]: https://www.smashingmagazine.com/2024/03/setting-persisting-color-scheme-preferences-css-javascript/
[bfcache]: https://web.dev/articles/bfcache
[`pageshow`]: https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event
[`@media (prefers-color-scheme: dark)`]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme
[`light-dark()`]: https://www.bram.us/2023/10/09/the-future-of-css-easy-light-dark-mode-color-switching-with-light-dark/
[Ars Technica]: https://arstechnica.com/
