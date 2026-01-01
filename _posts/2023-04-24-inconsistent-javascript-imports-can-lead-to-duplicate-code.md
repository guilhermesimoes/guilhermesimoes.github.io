---
layout:   post
title:    "Inconsistent JavaScript imports can lead to duplicate code"
subtitle: "Years later, we're still shooting ourselves in the foot with CommonJS."
date:     2023-04-24 20:21:46 +0100
image:
  hero:   true
  path:   /assets/images/cheetahs.png
  alt:    "Drawing of two cheetahs, side by side, almost as if one was a clone of the other."
tags:
  - Perf
  - JavaScript
---

So this happened recently in a project at @work. I was analyzing the size of this project's bundle and noticed that a lot of `@company/internal-lib`'s code was being included twice. I tracked down all the imports of this library and found that on a file we were doing this:

```ts
import { x } from '@company/internal-lib';
```

But on another file we were doing this:

```ts
import { y } from '@company/internal-lib/lib/y';
```

We were importing from `/lib/y` because `internal-lib`'s main index file wasn't exporting `y`, and it was easier and quicker for a developer to import directly from that path than to submit a patch to the repository of `@company/internal-lib`, release a new version, and then change the project's `package.json` to use that new version.

This slightly different import was the apparent cause of all that duplicate code.

But why?

First of all, it was because `@company/internal-lib` is written in TypeScript, and there's a build/publish step that creates two different folders to be consumed by various projects:

```
internal-lib
├── package.json
├── src
|   ├── index.ts
|   └── ...
├── lib
|   ├── index.js
|   └── ...
└── es
    ├── index.js
    └── ...
```

The `lib` folder contained code transpiled to CommonJS and the `es` folder contained the same code transpiled to a more modern JavaScript format.[^1]

Then, internal-lib's `package.json` contained this:

```ts
"main": "./lib/index.js",
"module": "./es/index.js",
```

The [`main` field] is the primary entry point of the package, as per Node's original spec. This means that code like `require('@company/internal-lib')` actually imports the file `./lib/index.js`.[^2]

The `module` field is **_another_** entry point, this time used by most bundlers (such as [ESBuild][ESBuild module], [Rollup][Rollup module] and Webpack). For a long time, there were [multiple competing standards for JavaScript modules], such as CommonJS (CJS), AMD, and UMD. Ultimately, ECMAScript Modules (or ESM), in conjunction with the `module` field, was [the proposal that bundlers agreed on] because it lead to better code [tree-shaking].[^3]

Finally, our project was using Webpack which prefers ESM and looks for that `module` field. So when we did a regular `import { x } from '@company/internal-lib'` Webpack went to the `es` folder. But when we did an `import { y } from '@company/internal-lib/lib/y'` we forced Webpack to go to the `lib` folder and load [CommonJS code which isn't easily tree-shakable].

And there you have it.

That innocent-looking import was the cause of all the duplicate code. We fixed it by submitting a patch to `@company/internal-lib` to export `y` from its main index file and then updating all the imports inside the project. We also forbade the problematic imports with ESLint's [`no-restricted-imports`] rule so we don't repeat this mistake.

Watch out for this in your codebase. Don't make the same mistake!

[^1]: To be honest this folder structure didn't make a lot of sense. A more sensible folder naming scheme would be something like `./dist/cjs/*` for code using the old CommonJS format and `./dist/esm/*` for the more modern format.

[^2]: If a `main` field isn't specified inside the `package.json`, Node will try to import an `index.js` file located in the root folder of the required package.

[^3]: Major bundlers adopted the `module` field proposal because it lead to better [tree-shaking]. Node did not accept this proposal and opted for `"type": "module"` instead. Also, there is now a third standard: the `exports` field, used by at least [Node][Node exports] and [Webpack][Webpack exports] ([XKCD 927] flashbacks).

[`main` field]: https://docs.npmjs.com/cli/v6/configuring-npm/package-json#main
[multiple competing standards for JavaScript modules]: https://dev.to/iggredible/what-the-heck-are-cjs-amd-umd-and-esm-ikm
[ESBuild module]: https://esbuild.github.io/api/#main-fields
[Rollup module]: https://github.com/rollup/rollup/wiki/pkg.module
[the proposal that bundlers agreed on]: https://github.com/dherman/defense-of-dot-js/blob/f31319be735b21739756b87d551f6711bd7aa283/proposal.md
[tree-shaking]: https://webpack.js.org/guides/tree-shaking/
[CommonJS code which isn't easily tree-shakable]: https://web.dev/commonjs-larger-bundles/
[`no-restricted-imports`]: https://eslint.org/docs/latest/rules/no-restricted-imports
[Node exports]: https://nodejs.org/api/packages.html#package-entry-points
[Webpack exports]: https://webpack.js.org/guides/package-exports/
[XKCD 927]: https://xkcd.com/927/
