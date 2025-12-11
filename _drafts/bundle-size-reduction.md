---
layout:   post
title:    "Comprehensive TODO list for reducing JavaScript bundle size"
date:     2025-11-24 15:00:45 +0000
class:    bundle-size-reduction
---

This is a list of all the things I know, and all the things we've used to reduce the bundle size of the Peacock app.

- <div class="list-item" markdown="1">
    <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
    Create target-specific builds (specially relevant when the same codebase is used for PlayStation, Xbox, Samsung TV, LG TV, Nvidia Shield, Fire TV, etc). In a browser context this would mean only loading IE-specific code on IE instead of loading it on every browser.
  </div>

- <div class="list-item" markdown="1">
    <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
    Code-splitting
  </div>

  - <div class="list-item" markdown="1">
      <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
      Load page-specific code only when the user visits that page.
    </div>

  - <div class="list-item" markdown="1">
      <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
      Load feature-specific code only when the user uses that feature. For example, in a chat app with an emoji-picker, only load the emoji-picker when the user clicks a button.
    </div>

- <div class="list-item" markdown="1">
    <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
    Remove duplicate dependencies.
  </div>

- <div class="list-item" markdown="1">
    <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
    Eliminate dependencies.
  </div>

- <div class="list-item" markdown="1">
    <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
    Rewrite dependencies.
  </div>

- <div class="list-item" markdown="1">
    <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
    Use a minifier / compressor such as [Terser], [SWC] or [esbuild].
  </div>

  - <div class="list-item" markdown="1">
      <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
      Go over _all_ the options of the minifier you're using. Go beyond the tool's defaults. Read its documentation. For example, Terser only does one pass. If you use `passes: 2` compressing takes longer but results are better.
    </div>

  - <div class="list-item" markdown="1">
      <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
      <div markdown="1">
      Specify the appropriate target. You should know what browsers implement what [ECMAScript versions]. You should also know what [language features] are implemented in what ECMAScript versions. There's a big difference between transpiling to `ES5` and `ES2021`. For example:

      ```ts
      // ES5
      const q = 'my search';
      const searchParams = { q: q };
      ```
      ```ts
      // ES6
      const q = 'my search';
      const searchParams = { q };
      ```
      </div>
    </div>

- <div class="list-item" markdown="1">
    <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
    <div markdown="1">
    Use [language features] that lead to smaller code. For example:

  ```ts
  usersEvents.reduce(userEvent => {
    if (!acc[userEvent.userId]) {
      acc[userEvent.userId] = [];
    }
    acc[userEvent.userId].push(userEvent);
    return acc;
  }, {});
  ```

  can be rewritten using the [logical OR assignment operator]:

  ```ts
  usersEvents.reduce(userEvent => {
    (acc[userEvent.userId] ||= []).push(userEvent);
    return acc;
  }, {});
  ```
    </div>
  </div>

  - <div class="list-item" markdown="1">
      <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
      <div markdown="1">
      **However**, be aware of what your most important target (browser) is. For example:

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
    Eliminate dead-code. Your bundler should already be doing this by default.
  </div>

  - <div class="list-item" markdown="1">
      <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
      <div markdown="1">
      Wrap optional code in [environment variables]. Examples:

      ```ts
      if (process.env.TEST_RUN) {
        component.testId = 'testId';
      }
      ```

      ```ts
      if (process.env.NODE_ENV !== 'production') {
        if (someConditionThatShouldNeverOccur) {
          console.error('Detected mistake during development. Fix it!');
        }
      }
      ```
      </div>
    </div>

  - <div class="list-item" markdown="1">
      <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
      Search the documentation of all your dependencies for these special environment variables. For example, [if you're using Sentry you can set the env var `__SENTRY_DEBUG__`] to `false` in production builds so that optional code is removed during minification.
    </div>

  - <div class="list-item" markdown="1">
      <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
      Enable [tree-shaking].
    </div>

    - <div class="list-item" markdown="1">
        <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
        Ensure that your dependencies have `"sideEffects": false`. Bundlers like [Webpack][webpack side effects], [esbuild][esbuild side effects] and [bun][bun side effects] agree.
      </div>

      - <div class="list-item" markdown="1">
          <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
          Ensure that the dependencies of your dependencies have `"sideEffects": false`.
        </div>

    - <div class="list-item" markdown="1">
        <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
        Use ECMAScript Modules (ESM) and not CommonJS.
      </div>

      - <div class="list-item" markdown="1">
          <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
          Ensure that dependencies use ECMAScript Modules (ESM) and not CommonJS.
        </div>

      - <div class="list-item" markdown="1">
          <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
          Ensure that imports are consistent since [inconsistent imports can lead to duplicate code].
        </div>

    - <div class="list-item" markdown="1">
        <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
        Write services as plain ES modules that export functions since [services implemented as classes with public methods are not tree-shakable].
      </div>

    - <div class="list-item" markdown="1">
        <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
        Forbid `import * as Something` since it's not tree-shakable.
      </div>

  - <div class="list-item" markdown="1">
      <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
      mangling (renames)
    </div>

    - <div class="list-item" markdown="1">
        <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
        https://lihautan.com/reduce-minified-code-size-by-property-mangling/
      </div>

    - <div class="list-item" markdown="1">
        <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
        rename private methods https://github.com/timocov/ts-transformer-minify-privates
      </div>

    - <div class="list-item" markdown="1">
        <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
        rename private properties https://github.com/timocov/ts-transformer-properties-rename
      </div>

    - <div class="list-item" markdown="1">
        <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
        rename public methods
      </div>

    - <div class="list-item" markdown="1">
        <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
        rename public properties
      </div>

- <div class="list-item" markdown="1">
    <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
    If using TypeScript, prefer `const enum`s to `enum`s. `const enum`s are inlined directly in the code, and avoid objects and imports.
  </div>

- <div class="list-item" markdown="1">
    <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
    <div markdown="1">
    Optimize code at build-time. For example:
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
      gzip brotli HTTP/2
      https://rovity.io/brotli-vs-gzip/
      https://www.siteground.com/blog/brotli-vs-gzip-compression
      https://wp-rocket.me/blog/brotli-vs-gzip-compression/
    </div>
  </div>

- <div class="list-item" markdown="1">
    <handdrawn-checkbox><input type="checkbox" /></handdrawn-checkbox>
    Finally, keep monitoring the size of your JavaScript bundle.
  </div>




This change has been made because... 5 and a half years ago the btoa dependency was included in the client-lib-js-common-request package. Apparently client-lib-js-common-request is/was also used in a NodeJS back-end project.

This third party btoa depends on Buffer, a NodeJS concept. Since Buffer does not exist in a web environment, Webpack "helpfully" "polyfills" Buffer by requiring another library: buffer, which has a parsed size of 20.38KB.

client-lib packages are meant to be used by front-end projects. If there's still a back-end project that depends on this library, it should instead polyfill btoa on their side instead of forcing packages on clients.

Be careful with Webpack 4's

https://webpack.js.org/blog/2020-10-10-webpack-5-release/#automatic-nodejs-polyfills-removed



[https://www.debugbear.com/blog/reducing-javascript-bundle-size#compile-your-bundle-just-for-the-browsers-you-need-to-support](https://www.debugbear.com/blog/reducing-javascript-bundle-size#compile-your-bundle-just-for-the-browsers-you-need-to-support)

[https://calibreapp.com/blog/bundle-size-optimization#deliver-es6-modules-to-up-to-date-browsers](https://calibreapp.com/blog/bundle-size-optimization#deliver-es6-modules-to-up-to-date-browsers)

[https://terser.org/docs/api-reference](https://terser.org/docs/api-reference)

[https://swc.rs/docs/configuration/minification](https://swc.rs/docs/configuration/minification)

[https://esbuild.github.io/api/#tree-shaking](https://esbuild.github.io/api/#tree-shaking)

[https://esbuild.github.io/api/#mangle-props](https://esbuild.github.io/api/#mangle-props)

[https://esbuild.github.io/api/#minify](https://esbuild.github.io/api/#minify)

[https://github.com/google/closure-compiler#readme](https://github.com/google/closure-compiler#readme)

[https://madelinemiller.dev/blog/reduce-webapp-bundle-size/](https://madelinemiller.dev/blog/reduce-webapp-bundle-size/)

[https://www.useanvil.com/blog/engineering/minimizing-webpack-bundle-size/](https://www.useanvil.com/blog/engineering/minimizing-webpack-bundle-size/)


[Terser]: https://try.terser.org/
[SWC]: https://play.swc.rs/
[esbuild]: https://esbuild.github.io/try/
[ECMAScript versions]: https://yagmurcetintas.com/journal/javascript-a-brief-introduction/
[language features]: https://yagmurcetintas.com/journal/whats-new-in-es2022/
[environment variables]: https://www.debugbear.com/blog/reducing-javascript-bundle-size#dead-code-elimination-with-environment-variables
[if you're using Sentry you can set the env var `__SENTRY_DEBUG__`]: https://docs.sentry.io/platforms/javascript/guides/react/configuration/tree-shaking/#list-of-flags
[webpack side effects]: https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free
[esbuild side effects]: https://esbuild.github.io/api/#ignore-annotations
[bun side effects]: https://bun.sh/blog/bun-bundler#tree-shaking
[tree-shaking]: https://webpack.js.org/guides/tree-shaking/
[services implemented as classes with public methods are not tree-shakable]: 2025-11-23-classes-considered-harmful-when-authoring-a-js-lib.md
[inconsistent imports can lead to duplicate code]: 2023-04-24-inconsistent-javascript-imports-can-lead-to-duplicate-code.md
[logical OR assignment operator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment
[optional chaining operator]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
[using optional chaining on a browser that does not support it leads to a larger bundle due to code transpilation]: https://www.typescriptlang.org/play/?target=2#code/CYUwxgNghgTiAEEQBd4AcD2BnLBLARhAJ4CqAdqAGa5kjADy+AVuMgFzwDe6MGaHAVzIBrMhgDuZeAF94AH3hCqNOgG4AsACgtmHAWLlltBs1bwAZOfTY8hUhRDVjjFmGQA6NLzQbtmgPT+8ABuWFrhmrq2Bg5OdC6sAPye3qpAA
[Prepack]: https://prepack.io/
[preval.macro]: https://github.com/kentcdodds/preval.macro
[babel-plugin-preval]: https://github.com/kentcdodds/babel-plugin-preval

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
      stroke-width: 0.5px;
    }

    :host .border {
      stroke: black;
      fill: none;
    }

    :host .line {
      stroke: rgba(237,75,26,.82);
    }

    ::slotted(input) {
      opacity: 0;
    }
  </style>
  <svg viewbox='0 0 10 10'>
    <path class='border'></path>
    <path class='line'></path>
    <path class='line'></path>
  </svg>
  <slot></slot>
`;

class HandDrawnCheckbox extends HTMLElement {
  connectedCallback() {
    var checkbox = this.querySelector('input[type="checkbox"]');
    var templateClone = template.content.cloneNode(true);
    var pathEls = templateClone.querySelectorAll('.line');
    var borderEl = templateClone.querySelector('.border');
    borderEl.setAttribute('d', getBorderPath());
    toggleVisibility(pathEls, checkbox);

    var shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(templateClone);

    checkbox.addEventListener('change', function() {
      toggleVisibility(pathEls, this)
    });
  }
}

function toggleVisibility(lines, checkbox) {
  var [line1, line2] = lines;

  if (checkbox.checked) {
    line1.setAttribute('d', getLine1Path());
    line2.setAttribute('d', getLine2Path());
    line1.style.strokeDasharray = line1.style.strokeDashoffset = getPathLength(line1);
    line2.style.strokeDasharray = line2.style.strokeDashoffset = getPathLength(line2);

    setTimeout(() => {
      line1.style.transition = line2.style.transition = 'stroke-dashoffset 200ms ease';
      line2.style['transition-delay'] = '200ms';
      line1.style.strokeDashoffset = line2.style.strokeDashoffset = 0;
    }, 10);
  } else {
    line1.style.strokeDashoffset = getPathLength(line1);
    line2.style.strokeDashoffset = getPathLength(line2);
  }
}

function getPathLength(path) {
  return Math.ceil(path.getTotalLength()) + 1; // Handle rounding issues
}

var crossCorner1Range = [0.5, 1.5];
var crossCorner2Range = [8.5, 9.5];
var borderCorner1Range = [0.2, 0.8];
var borderCorner2Range = [9.2, 9.8];

function getBorderPath() {
  return `M${getPoint(borderCorner1Range)} ${getPoint(borderCorner1Range)}L${getPoint(borderCorner2Range)} ${getPoint(borderCorner1Range)}M${getPoint(borderCorner2Range)} ${getPoint(borderCorner1Range)}L${getPoint(borderCorner2Range)} ${getPoint(borderCorner2Range)}M${getPoint(borderCorner2Range)} ${getPoint(borderCorner2Range)}L${getPoint(borderCorner1Range)} ${getPoint(borderCorner2Range)}M${getPoint(borderCorner1Range)} ${getPoint(borderCorner2Range)}L${getPoint(borderCorner1Range)} ${getPoint(borderCorner1Range)}M${getPoint(borderCorner1Range)} ${getPoint(borderCorner1Range)}`;
}

function getLine1Path() {
  return `M${getPoint(crossCorner1Range)} ${getPoint(crossCorner1Range)}L${getPoint(crossCorner2Range)} ${getPoint(crossCorner2Range)}`;
}

function getLine2Path() {
  return `M${getPoint(crossCorner2Range)} ${getPoint(crossCorner1Range)}L${getPoint(crossCorner1Range)} ${getPoint(crossCorner2Range)}`;
}

function getPoint(range) {
  var [start, end] = range;
  var diff = end - start;
  return +(start + Math.random() * diff).toFixed(2);
}

customElements.define('handdrawn-checkbox', HandDrawnCheckbox);
</script>
