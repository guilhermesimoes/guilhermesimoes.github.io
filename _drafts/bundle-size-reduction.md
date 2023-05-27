---
layout:   post
title:    "Comprehensive vs exhaustive list of stuff to do reduce JavaScript bundle size"
date:     2023-05-27 16:00:45 +0000
---

This is a list of all the things I know, and all the things we've used to reduce the bundle size of the Peacock app. If you pay attention, you'll see it all boils down to shipping less code.

- load code depending on the target (device / browser)
- code-splitting (load page-specific code only when the user visits that page)
- eliminate dependencies
- remove duplicate dependencies
- rewrite dependencies
- read your dependencies' documentation.

  one possible solution for that would be to wrap any logging in something like __OCELLUS_DEBUG__ and that way, using a bundler, we can set these kinds of variables to false in production builds and reduce the total bundle size. It’s what Sentry does: https://docs.sentry.io/platforms/javascript/guides/react/configuration/tree-shaking/#list-of-flags

- implement tree-shaking https://webpack.js.org/guides/tree-shaking/
  - avoid `import * as Something`
  - do all your dependencies have "sideEffects": false?
    https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free
    https://esbuild.github.io/api/#injecting-files-without-imports
    - do all the dependencies of your dependencies have "sideEffects": false?
  - use plain ES modules that export functions instead of classes, since they are more tree-shakable (link to previous post)
- make sure your imports are consistent since [inconsistent imports can lead to duplicate code]
- Dead code elimination with environment variables https://www.debugbear.com/blog/reducing-javascript-bundle-size#dead-code-elimination-with-environment-variables
- use language features that lead to smaller code. Example:

  ```ts
  const qs = {};
  const params = { qs };
  ```

  vs

  ```ts
  const queryString = {};
  const params = { qs: queryString };
  ```

  - You must be aware of what is your most important target (device / browser). For example:

    ```ts
  function someFn(params) {
    return params.a + params.b;
  }
  ```

  can be rewritten in a smaller format, like so:

  ```ts
  function someFn({ a, b }) {
    return a + b;
  }
  ```

  But when targetting an older device, that does not support [destructuring function parameters], the transpiled output is larger:

  ```ts
  function someFn(_a) {
    var a = _a.a, b = _a.b;
    return a + b;
  }
  ```

  So maybe the original code is better. The final result changes though once we go into the next step.

- use a minifier / compressor / uglifier to remove comments and reduce the size of the code.
  - go over _all_ the options of the minifier you're using. terser swc. Go beyond the tool's defaults. Read the documentation. Example, terser only does one pass. If you use `passes: 2` compressing takes longer but results can be better.
  - specify appropriate target
    - a === undefined || a === null ? 1 : a could be minified to a ?? 1
    - 2015 or greater to emit shorthand object properties - i.e.: {a} instead of {a: a}
    https://www.debugbear.com/blog/reducing-javascript-bundle-size#compile-your-bundle-just-for-the-browsers-you-need-to-support
    https://calibreapp.com/blog/bundle-size-optimization#deliver-es6-modules-to-up-to-date-browsers

- mangling (renames)
  - https://lihautan.com/reduce-minified-code-size-by-property-mangling/
  - rename private methods https://github.com/timocov/ts-transformer-minify-privates
  - rename private properties https://github.com/timocov/ts-transformer-properties-rename
  - rename public methods
  - rename public properties

- gzip brotli HTTP/2
https://rovity.io/brotli-vs-gzip/
https://www.siteground.com/blog/brotli-vs-gzip-compression
https://wp-rocket.me/blog/brotli-vs-gzip-compression/


https://terser.org/docs/api-reference
https://swc.rs/docs/configuration/minification
https://esbuild.github.io/api/#tree-shaking
https://esbuild.github.io/api/#mangle-props
https://esbuild.github.io/api/#minify
https://github.com/google/closure-compiler#readme


https://madelinemiller.dev/blog/reduce-webapp-bundle-size/
https://www.useanvil.com/blog/engineering/minimizing-webpack-bundle-size/



[inconsistent imports can lead to duplicate code]: 2023-04-24-inconsistent-javascript-imports-can-lead-to-duplicate-code.md
[destructuring function parameters]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#unpacking_properties_from_objects_passed_as_a_function_parameter
