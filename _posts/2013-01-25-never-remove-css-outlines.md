---
layout: post
title:  "Never remove CSS outlines"
date:   2013-01-25 21:00:45 +0100
---
Use of the rule `:focus { outline: none; }` to remove an outline results in the link or control being focusable but with no visible indication of focus.
Even worse, methods to remove it such as `onfocus="blur()"` result in keyboard users being unable to interact with the link or control.

If you do not like the default focus outline that is displayed when a user clicks on an interactive element you have 3 accessible solutions:

1. Style the outline. Webkit browsers have a more prominent glow so you could try [styling it] to make it less obtrusive.
   Consider the use of `a:focus { outline: thin dotted; }` to normalize the look of the outline across browsers.

2. Style the element itself. You can remove the outline as long as you style the focused element differently
   (using `color`, `background-color`, `border` or `text-decoration: underline` for example).

3. Remove outlines for mouse users only, if you truly *must* do so.
   Start without applying any `outline: none` rules.
   If a mouse event is detected apply those rules using JavaScript.
   Remove the rules again if keyboard interaction is detected.
   Here are 2 examples of accessible outline removal scripts:

    * [outliner.js], a cross-lib implementation with event delegation.

    * [outline.js], a similar approach that uses `mousedown` instead of `mouseover`.

   Consider this third solution as a last resort. Some browser/screen reader combinations fire mouse events, which could cause outlines to disappear while using this method.

In conclusion, using `outline: none` without proper fallbacks makes your site less accessible to any keyboard-only user, not just those with reduced vision.
Make sure to always give your interactive elements a visible indication of focus.


[styling it]: https://developer.mozilla.org/en-US/docs/Web/CSS/outline
[outliner.js]: https://gist.github.com/2470777
[outline.js]: https://github.com/lindsayevans/outline.js
