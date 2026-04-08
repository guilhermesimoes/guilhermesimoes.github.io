---
layout:   post
title:    "Making dark mode play nice with bfcache"
date:     2026-04-08 12:00:00 +0000
image:
  hero:   true
  path:   /assets/images/class-system.png
  alt:    "Drawing representing the class system of a feudal society. There's a king, a queen, a bishop, and some nobles."
tags:     [Web, JavaScript, CSS]
---

This blog has a theme toggle button that cycles between system, dark and light themes. It worked great -- until a user navigated to another page, changed the theme, and then went back in history. The page would come back from the browser's [back-forward cache (bfcache)][bfcache] with the old theme, creating a confusing mismatch. Fixing this required three separate changes.

### 1. Switching the theme on bfcache restore

The [bfcache] stores a complete snapshot of the page in memory -- including the DOM, JavaScript state, and CSS. So if a user is on page X with the light theme, navigates to page Y, switches to dark, and then goes back, page X is restored with the stale light theme even though `localStorage` has been updated to `dark`.

The fix is to listen for the [`pageshow`][pageshow] event and re-apply the theme stored in `localStorage`:

```js
self.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    var theme = localStorage.getItem('theme');
    var root = document.documentElement;
    root.classList.remove('light-theme', 'dark-theme');
    if (theme) {
      root.classList.add(`${theme}-theme`);
    }
  }
});
```

The `event.persisted` flag tells us the page was restored from the bfcache rather than loaded fresh.

### 2. Removing the theme animation on restore

With the first fix in place, the theme switch happened correctly -- but with a visible color transition animation. The `body` had a `transition` on `color` and `background-color`, so going back in history played a 300ms fade from the old theme to the new one. Not great.

The solution was to make the transition opt-in by gating it behind an `animatable` class on the `<html>` element. On `pagehide`, the class is removed. On `pageshow`, after applying the correct theme, the class is added back in a `setTimeout` so the browser has a chance to paint the new theme without animating:

```js
// On pagehide:
document.documentElement.classList.remove('animatable');

// On pageshow, after applying the theme:
setTimeout(() => {
  root.classList.add('animatable');
});
```

And in the CSS, all theme transitions are now scoped under `.animatable`:

```scss
.animatable {
  body {
    transition-property: color, background-color;
    transition-duration: 0.3s;
  }
}
```

### 3. Fixing the toggle button state

The theme toggle cycles through `['system', 'dark', 'light']` using an index stored in a JavaScript variable. But when a page is restored from bfcache, the in-memory `themeIndex` could be wrong -- the user may have toggled the theme on the other page.

Rather than trying to sync the index on every `pageshow` event, the simpler approach was to derive the current theme index from the DOM on each button click:

```js
themeToggle.addEventListener('click', () => {
  var themeIndex = 0;
  for (let className of root.classList) {
    var match = className.match(/(.*)-theme/);
    var theme = match && match[1];
    if (theme) {
      themeIndex = themes.indexOf(theme);
      break;
    }
  }
  // ... cycle to next theme
});
```

No stale state to worry about. The less state the better.

---

All three bugs were caused by the same root issue: bfcache restores the full page state from a snapshot, but `localStorage` and user expectations may have moved on. The [bfcache documentation][bfcache] is a great resource for understanding these edge cases.

[bfcache]: https://web.dev/articles/bfcache
[pageshow]: https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event
