---
layout:   block
title:    "Web Component: Hand-drawn Checkbox"
subtitle: Progressively enhance your checkboxes so they work even without JS.
date:     2025-12-07 01:40:25 +0000
image:
  path:   /assets/images/hand-drawn-checkboxes.png
block:
  path:   web-component-hand-drawn-checkbox.html
tags:
  - Web
  - JavaScript
  - Interactive
---

This is my first try at a Web Component. This one _progressively enhances_ an `<input type="checkbox" />`. So even if the user blocks JavaScript, a regular HTML checkbox is still rendered. The custom element can be used like this:

```html
<handdrawn-checkbox>
  <input type="checkbox" name="box1" checked />
</handdrawn-checkbox>
```

It's a bit verbose, but it's the only way to ensure that the progressive enhancement works. The element can also be declared this way:

```html
<handdrawn-checkbox name="box2"></handdrawn-checkbox>
```

This still works because this custom element adds a default checkbox in its constructor. The drawback is that this renders nothing if the user blocks JavaScript.

---

Here's the gist of how this Web Component works:

1. Using the [`slot`] element, we [create a portal in the template] where the original checkbox will be inserted.

2. Using the [`::slotted`] pseudo-element, we hide the original checkbox. We need to hide it with `opacity: 0` so that it remains interactive and accessible. We can't hide it with `visibility: hidden` or `display: none`.

3. Using the [`:host`] pseudo-class (which targets the root of the [shadow DOM]) we style the SVG element so that it has the same position and dimensions as the checkbox's. We also use [`pointer-events: none`] so that mouse clicks and touch events can properly reach the (invisible but still interactive) checkbox.

4. Finally, using the `connectedCallback` function (which is called when the element is added to the document) we render the [shadow DOM] and listen for `change` events coming from the checkbox. That way we can redraw our SVG element when the checkbox is toggled.

And that's it! Broken down like this it seems simple enough but it took me quite a bit to reach this solution. I quite like this [technique of augmenting an existing HTML element with a custom element][light-dom]. It's portable. It's accessible. And it feels like magic.

[`slot`]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/slot
[create a portal in the template]: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots
[`::slotted`]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::slotted
[`:host`]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:host
[shadow DOM]: https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM
[`pointer-events: none`]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/pointer-events
[light-dom]: https://meyerweb.com/eric/thoughts/2023/11/01/blinded-by-the-light-dom/
