---
layout:   block
title:    "Web Component: Hand-drawn Checkbox"
subtitle: Progressively enhance your checkboxes so they work even without JS.
date:     2025-12-06 11:36:40 +0000
image:
  path:   /assets/images/hand-drawn-checkboxes.png
block:
  path:   web-component-hand-drawn-checkbox.html
---

This is my first try at a Web Component. This one _progressively enhances_ an `<input type="checkbox" />`. So even if the user blocks JavaScript, a regular HTML checkbox is still rendered. The component can be used like this:

```html
<handdrawn-checkbox>
  <input type="checkbox" checked />
</handdrawn-checkbox>
```

It's a bit verbose, but it's the only way to ensure that the progressive enhancement works. The component can also be declared this way:

```html
<handdrawn-checkbox></handdrawn-checkbox>
```

It still works since the Web Component adds a default checkbox in its constructor. The trouble is that nothing renders without permission to run JavaScript.

---

I learned

I quite like this [technique of using a custom element to augment an existing HTML element][1]. It's portable. It only does one thing but it does it well.



[1]: https://meyerweb.com/eric/thoughts/2023/11/01/blinded-by-the-light-dom/
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:host
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted
https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots
