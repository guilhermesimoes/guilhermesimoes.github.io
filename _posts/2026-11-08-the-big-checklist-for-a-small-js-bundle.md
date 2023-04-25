---
layout:   post
title:    "The big checklist for a small JavaScript bundle"
date:     2026-11-08 00:01:45 +1000
image:
  hero:   true
  path:   /assets/images/elephant.png
  alt:    "Drawing of a large elephant, an allusion to most websites' JavaScript bundles."
class:    bundle-size-reduction
tags: [Perf, Web, JavaScript]
---

This is a list of all the things I know, and all the things we've used to reduce the bundle size of the [Peacock] / [SkyShowtime] / [NOW] TV app. You're welcome to use this checklist to improve your own projects.

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Create target-specific builds (specially relevant when the same codebase is used for PlayStation, Xbox, Nvidia Shield, Fire TV, etc). In a browser context this would mean [creating at least two different builds]: one for older browsers that you support (IE, Opera Mini, etc) and another for more modern browsers.
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Implement code-splitting (by using [dynamic import]s).
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Load page-specific code only when the user visits that page.
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Load feature-specific code only when the user uses that feature. Example: in a chat app with an emoji-picker, only load the emoji-picker when the user clicks a button.
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Remove duplicate dependencies.
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Rewrite dependencies.
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Eliminate dependencies. Example: delete unused polyfills for browsers that you no longer support.
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Use a minifier / bundler (like [Terser], [SWC], [Oxc], [esbuild], etc). It's incredible how much these tools can squeeze our code. They delete comments, inline single-use functions, collapse multiple variable declarations into a single one, etc.
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Go over _all_ the options of the minifier you're using. Go beyond the tool's defaults. Read its documentation. Example: Terser only does one pass by default. If you use `passes: 2` minification takes longer but results are better.
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  <div markdown="1">
  In the minifier settings specify the ECMAScript version appropriate for your target. You should know what browsers implement what [ECMAScript versions]. You should also know what [language features] are implemented in what ECMAScript versions. There's a big difference between transpiling to `ES5` and `ES2021`. Example:

  ```ts
  // ES5
  var q = 'my query';
  var searchParams = { q: q };
  ```
  ```ts
  // ES6
  var q = 'my query';
  var searchParams = { q };
  ```
  </div>
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  <div markdown="1">
  Use [language features] that lead to smaller code. Example:

  ```ts
  if (!eventListeners[eventName]) {
    eventListeners[eventName] = [];
  }
  eventListeners[eventName].push(listener);
  ```

  can be rewritten using the [logical OR assignment operator]:

  ```ts
  (eventListeners[eventName] ||= []).push(listener);
  ```
  </div>
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  <div markdown="1">
  **However**, be aware of what your most important target (browser) is. Example:

  ```ts
  possiblyUndefinedObject && possiblyUndefinedObject.prop
  ```

    can be rewritten using the [optional chaining operator]:

  ```ts
  possiblyUndefinedObject?.prop
  ```

    But [using optional chaining on a browser that does not support it leads to a larger bundle due to code transpilation]:

  ```ts
  possiblyUndefinedObject === null || possiblyUndefinedObject === void 0 ? void 0 : possiblyUndefinedObject.prop;
  ```

  So maybe **not** using the optional chaining operator is better.

  Refer back to step 1: target-specific builds.
  </div>
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Delete unnecessary code.
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  <div markdown="1">
  Wrap optional code in [environment variables]. Examples:

  ```ts
  if (process.env.TEST_RUN) {
    component.testId = "testId";
  }
  ```

  ```ts
  if (process.env.NODE_ENV !== "production") {
    if (someAppStateThatShouldNeverOccur) {
      console.error("Detected development issue. Fix it!");
    }
  }
  ```

  During creation of the final bundle for production the code is transformed like so:

  ```ts
  if (false) {
    component.testId = "testId";
  }
  ```

  ```ts
  if (false) {
    if (someAppStateThatShouldNeverOccur) {
      console.error("Detected development issue. Fix it!");
    }
  }
  ```

  When your minifier sees this code it knows it can omit it entirely.
  </div>
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Search the documentation of all your dependencies for these special environment variables. Example: [if you're using Sentry you can set the env var `__SENTRY_DEBUG__`] to `false` in production builds so that optional code is removed during minification.
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Enable [tree-shaking].
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Ensure that your app's `package.json` sets `"sideEffects": false`. Bundlers like [Webpack][webpack side effects], [esbuild][esbuild side effects] and [bun][bun side effects] agree.
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Ensure that your dependencies have `"sideEffects": false`.
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Ensure that the dependencies of your dependencies have `"sideEffects": false`.
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Use ECMAScript Modules (ESM) and not [CommonJS][CommonJS causes large bundles] (CJS).
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Ensure that _all_ your dependencies use ECMAScript Modules (ESM) and not CommonJS (CJS).
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Ensure that imports are consistent since [inconsistent imports can lead to duplicate code].
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Write services as plain ES modules that export functions since [classes with public methods are **not** tree-shakable].
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Avoid `import * as Something` since it's not tree-shakable.
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Enable [name mangling] (renaming basic identifiers like local variables, params, some functions).
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  Take name mangling to the next level. [Rename private properties and methods]. [Rename exports]. Rename as much internal code that you control as you can. Everything in this step is risky but should have a high return on investment.
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  <div markdown="1">
  If using TypeScript, prefer `const enum`s to `enum`s. [`const enum`s are inlined directly in the code], avoiding objects and imports. Example:

  ```ts
  // direction.ts
  export enum Direction {
    Up,
    Down,
  }
  ```
  ```ts
  // some-other-file.ts
  import { Direction } from './direction.ts'

  console.log(Direction.Up);
  ```

  gets transpiled to:

  ```js
  // direction.ts
  export var Direction;
  (function (Direction) {
      Direction[Direction["Up"] = 0] = "Up";
      Direction[Direction["Down"] = 1] = "Down";
  })(Direction || (Direction = {}));
  ```
  ```js
  // some-other-file.js
  import { Direction } from './direction.js'

  console.log(Direction.Up);
  ```

  while using a `const enum` would transpile to simply:

  ```js
  console.log(0);
  ```
  </div>
  </div>

- <div class="list-item" markdown="1">
  <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
  <div markdown="1">
  Optimize code at build-time. Example:

  ```ts
  export const ONE_SECOND_MS = 1000;
  export const ONE_MINUTE_MS = 60 * ONE_SECOND_MS;
  export const ONE_HOUR_MS = 60 * ONE_MINUTE_MS;
  export const ONE_DAY_MS = 24 * ONE_HOUR_MS;
  ```
  can be optimized to:
  ```ts
  export const ONE_SECOND_MS = 1000;
  export const ONE_MINUTE_MS = 60000;
  export const ONE_HOUR_MS = 3600000;
  export const ONE_DAY_MS = 86400000;
  ```
  Libraries that can help with this: [Prepack], [preval.macro] or [babel-plugin-preval].
  </div>
  </div>

- <div class="list-item" markdown="1">
    <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
    <div markdown="1">
    Serve JavaScript and (other text assets) compressed with [Brotli / GZIP].
    </div>
  </div>

---

Finally, keep monitoring the size of your JavaScript bundle! Peacock's CI measures the bundle size change of each PR and adds it as comment during code review. [bundle-stats] is a cool project that can help with this.

Also, something as simple as:

```ts
// src/index.js
export const UNUSED_EXPORT = 'THIS_SHOULD_NOT_BE_BUNDLED';
```

plus a CI test like:

```sh
grep -rq "THIS_SHOULD_NOT_BE_BUNDLED" dist
```

can go a long way in catching certain regressions.

In fact, now that I write this, I realise that awareness of your bundle size should actually be the first step in this long journey. Optimization is an ongoing process, not a one-time task. Good luck!

P. S. -- If you enjoyed the hand-drawn checkboxes I explain how to implement them in my post [Web Component: Hand-drawn Checkbox].

[Peacock]: https://www.peacocktv.com
[SkyShowtime]: https://www.skyshowtime.com
[NOW]: https://nowtv.com
[creating at least two different builds]: https://calibreapp.com/blog/bundle-size-optimization#deliver-es6-modules-to-up-to-date-browsers
[dynamic import]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
[Terser]: https://try.terser.org/
[SWC]: https://play.swc.rs/
[Oxc]: https://oxc.rs/
[esbuild]: https://esbuild.github.io/try/
[ECMAScript versions]: https://yagmurcetintas.com/journal/javascript-a-brief-introduction/
[language features]: https://yagmurcetintas.com/journal/whats-new-in-es2022/
[logical OR assignment operator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment
[optional chaining operator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
[using optional chaining on a browser that does not support it leads to a larger bundle due to code transpilation]: https://www.typescriptlang.org/play/?target=6#code/CYUwxgNghgTiAEEQBd4AcD2BnLBLARhAJ4CqAdqAGa5kjADy+AVuMgFzwDe6MGaHAVzIBrMhgDuZeAF94AH3hCqNOgG4AsACgtmHAWLlltBs1bwAZOfTY8hUhRDVjjFmGQA6NLzQbtmgPT+8ABuWFrhmrq2Bg5OdC6sAPye3qpAA
[environment variables]: https://www.debugbear.com/blog/reducing-javascript-bundle-size#dead-code-elimination-with-environment-variables
[if you're using Sentry you can set the env var `__SENTRY_DEBUG__`]: https://docs.sentry.io/platforms/javascript/guides/react/configuration/tree-shaking/#manual-tree-shaking
[tree-shaking]: https://webpack.js.org/guides/tree-shaking/
[webpack side effects]: https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free
[esbuild side effects]: https://esbuild.github.io/api/#ignore-annotations
[bun side effects]: https://bun.sh/blog/bun-bundler#tree-shaking
[CommonJS causes large bundles]: https://web.dev/articles/commonjs-larger-bundles
[inconsistent imports can lead to duplicate code]: 2023-04-24-inconsistent-javascript-imports-can-lead-to-duplicate-code.md
[classes with public methods are **not** tree-shakable]: 2025-11-23-classes-considered-harmful-when-authoring-a-js-lib.md
[name mangling]: https://lihautan.com/reduce-minified-code-size-by-property-mangling
[Rename private properties and methods]: 2025-06-23-minifying-private-properties-and-methods-with-terser.md
[Rename exports]: https://code.visualstudio.com/blogs/2023/07/20/mangling-vscode
[`const enum`s are inlined directly in the code]: https://www.typescriptlang.org/play/?#code/KYOwrgtgBAIglgJ2AYwC5wPYigbwFBSFQCqADgDQFEwYDuIlRUAMsAGaqNEBKcA5gAtOeAL548yLAGcMAG2AA6WRj4AKeEjSYQCsgEoA3OID0xqADcp4ySCmoooSCxWtzwWbioBRBAgwIuAHUAQwQGKgBJEDYMLhhgACMwPkoxCWk5RWU1ZhdgN1kFKJjDIA
[Prepack]: https://prepack.io/
[preval.macro]: https://github.com/kentcdodds/preval.macro
[babel-plugin-preval]: https://github.com/kentcdodds/babel-plugin-preval
[Brotli / GZIP]: https://www.siteground.com/academy/brotli-vs-gzip-compression
[bundle-stats]: https://github.com/relative-ci/bundle-stats
[Web Component: Hand-drawn Checkbox]: 2025-12-06-web-component-hand-drawn-checkbox.md

<script type="text/javascript">
"use strict";

var template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      position: relative;
      display: inline-block;
    }

    :host svg {
      position: absolute;
      pointer-events: none;
      stroke-linecap: round;
      stroke-width: 0.5;
      fill: none;
      overflow: visible;
    }

    :host .border {
      stroke: currentColor;
    }

    :host .line {
      stroke-width: 1;
      stroke: rgba(10,128,0,.82);
      stroke-linejoin: round;
    }

    ::slotted(input) {
      opacity: 0;
    }
  </style>
  <svg viewbox='0 0 10 10'>
    <path class='border'></path>
    <path class='line'></path>
  </svg>
  <slot></slot>
`;

class HandDrawnCheckbox extends HTMLElement {
  connectedCallback() {
    this.checkbox = this.querySelector('input[type="checkbox"]');
    this.checkbox.addEventListener('change', this._onChange);

    if (!this.shadowRoot) {
      var templateClone = template.content.cloneNode(true);
      var borderEl = templateClone.querySelector('.border');
      borderEl.setAttribute('d', getBorderPath());
      this.checkmarkEl = templateClone.querySelector('.line');

      var shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(templateClone);
    }

    this._onChange();
  }

  disconnectedCallback() {
    this.checkbox.removeEventListener('change', this._onChange);
  }

  _onChange = () => {
    toggleVisibility(this.checkmarkEl, this.checkbox);
  }
}

function toggleVisibility(checkmarkEl, checkbox) {
  if (checkbox.checked) {
    checkmarkEl.setAttribute('d', getLine1Path());
    checkmarkEl.style.transition = 'none';
    checkmarkEl.style.strokeDasharray = checkmarkEl.style.strokeDashoffset = getPathLength(checkmarkEl);

    setTimeout(() => {
      if (!checkbox.checked) { return; }
      checkmarkEl.style.transition = 'stroke-dashoffset 200ms ease';
      checkmarkEl.style.strokeDashoffset = 0;
    }, 10);
  } else {
    checkmarkEl.style.strokeDashoffset = getPathLength(checkmarkEl);
  }
}

function getPathLength(path) {
  return Math.ceil(path.getTotalLength()) + 1; // Handle rounding issues
}

var checkStartXRange = [0.4, 2];
var checkStartYRange = [4, 5];
var checkMidXRange = [4.5, 5.5];
var checkMidYRange = [8, 9.8];
var checkEndXRange = [8.5, 9.8];
var checkEndYRange = [0.2, 2];
var borderCorner1Range = [0.2, 0.8];
var borderCorner2Range = [9.2, 9.8];

function getBorderPath() {
  return `M${getPoint(borderCorner1Range)} ${getPoint(borderCorner1Range)}L${getPoint(borderCorner2Range)} ${getPoint(borderCorner1Range)}M${getPoint(borderCorner2Range)} ${getPoint(borderCorner1Range)}L${getPoint(borderCorner2Range)} ${getPoint(borderCorner2Range)}M${getPoint(borderCorner2Range)} ${getPoint(borderCorner2Range)}L${getPoint(borderCorner1Range)} ${getPoint(borderCorner2Range)}M${getPoint(borderCorner1Range)} ${getPoint(borderCorner2Range)}L${getPoint(borderCorner1Range)} ${getPoint(borderCorner1Range)}M${getPoint(borderCorner1Range)} ${getPoint(borderCorner1Range)}`;
}

function getLine1Path() {
  const curveMidPointX = getPoint([3, 3.8])
  const curveMidPointY = getPoint([6.4, 7])
  return `M${getPoint(checkStartXRange)} ${getPoint(checkStartYRange)}C${curveMidPointX} ${curveMidPointY} ${curveMidPointX} ${curveMidPointY} ${getPoint(checkMidXRange)} ${getPoint(checkMidYRange)}L${getPoint(checkEndXRange)} ${getPoint(checkEndYRange)}`;
}

function getPoint(range) {
  var [start, end] = range;
  var diff = end - start;
  return +(start + Math.random() * diff).toFixed(2);
}

customElements.define('handdrawn-checkbox', HandDrawnCheckbox);
</script>
