---
layout:   post
title:    "Comprehensive vs exhaustive list of stuff to do reduce JavaScript bundle size"
date:     2023-03-26 16:00:45 +0000
---

This is a list of all the things I know, and all the things we've used to reduce the bundle size of the Peacock app.

- load code depending on the device / target
- code-splitting
- eliminate dependencies (remove duplicate dependencies)
- rewrite dependencies
- make sure you're using inconsistent imports since they lead to duplicate code (link to previous post)
- use plain ES modules that export functions instead of classes, since they are more tree-shakable (link to previous post)
- tree-shaking https://webpack.js.org/guides/tree-shaking/
  - avoid `import * as Something`
  - do all your dependencies have "sideEffects": false?
    https://webpack.js.org/guides/tree-shaking/#mark-the-file-as-side-effect-free
    https://esbuild.github.io/api/#injecting-files-without-imports
    - do all the dependencies of your dependencies have "sideEffects": false?
- Dead code elimination with environment variables https://www.debugbear.com/blog/reducing-javascript-bundle-size#dead-code-elimination-with-environment-variables
- remove comments
- use a minifier / compressor / uglifier
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
