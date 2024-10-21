---
layout:   post
title:    "Making setTimeout return number instead of NodeJS.Timeout in TypeScript"
subtitle: "Your project may also be including NodeJS types unwittingly."
date:     2024-10-16 12:30:46 +1000
image:
  hero:   true
  path:   /assets/images/gemsbok.png
  alt:    "Drawing of a gemsbok, a large antelope."
---

For the longest time we had to deal with the fact that NodeJS types were being included in a web project at work. The most visible aspect of this issue was that the return type of `setTimeout` was a `NodeJS.Timeout` when it should be a `number`. In order to fix this we used to place the following at the top of each file that used `setTimeout`:[^1]

```ts
declare let setTimeout: WindowOrWorkerGlobalScope['setTimeout'];
```

We thought these NodeJS types were part of TypeScript just like the DOM types are part of it so we simply worked around them.

One day, while perusing [TypeScript's compiler options],
 we discovered [`explainFiles`] which explains in detail how each typing gets included in a project. Using it in our project yielded this:

```terminal
$ tsc --explainFiles
node_modules/@types/node/index.d.ts
Type library referenced via 'node' from file 'node_modules/@types/graceful-fs/index.d.ts' with packageId '@types/node/index.d.ts@20.5.7'

node_modules/@types/node/index.d.ts
Type library referenced via 'node' from file 'node_modules/@types/cacheable-request/index.d.ts' with packageId '@types/node/index.d.ts@18.11.17'
```
{: .wrap-code}

So, there were at least two type dependencies that were causing the dependency `@types/node` to be included in the project. But why were the types of `graceful-fs` and `cacheable-request` being included in the first place?

Diving again into [TypeScript's compiler options] gave us the answer, in the form of another compiler option -- [`types`]:

> By default all visible `@types` packages are included in your compilation. Packages in `node_modules/@types` of any enclosing folder are considered visible.
>
> If `types` is specified, only packages listed will be included in the global scope.

Our project was unnecessarily including the types of dozens of development dependencies! Setting the compiler option [`types`] to an empty array prevented all `node_modules/@types` from being automatically included. And just like that, the return type of `setTimeout` now finally appeared as `number`.

---

We should observe that while using `types` is the solution to avoid NodeJS types in a web project, this compiler option can cause the project's tests to fail if they do depend on NodeJS types. In that case, we need a way to include those test-specific types only when running the tests.

In our project, we had to do the following changes:

1. Create a `tsconfig.test.json` file that extends the main `tsconfig.json` file.
2. [Configure `jest` to use this new file].
3. Add `types: ["jest"]` to include the type definitions of `@types/jest` (like `describe`, `it`, `beforeEach`, etc).
4. Avoid adding `"node"` to the `types` array. While it would be somewhat accurate to do this, the issue is that by doing that we'd "pollute" the global typing environment during tests. All the `setTimeout`s would have a return type of `number` during our `build` command, but would have a return type of `NodeJS.Timeout` during our `test` command. So our `build` command would work but our `test` command would fail.
5. Rename `global` to [`globalThis`] in our tests since `global` is a NodeJS concept.
6. Use [Triple-Slash Directives] in tests where `node` types are really necessary (for example, when using `fs` or `path`):

   ```ts
   /// <reference types="node" />
   ```

---

While our project is a web project, we were still using _some_ NodeJS concepts to build the project, mostly in this form:

```ts
if (process.env.NODE_ENV !== 'production') {
  console.error('Log something only necessary in development');
}
```

This code no longer compiled without the NodeJS `process` type. Adding a new [declaration file] with our own type solved this:

```ts
// globals.d.ts
declare let process: {
  env: {
    NODE_ENV: string;
  }
}
```

This actually took a little more work than the simple workarounds we were using before but it was worth it. A notable outcome of these changes was that our `build` and `test` command times improved by about 1 second. It's possible that VSCode's auto-completion and auto-import features also improved. And honestly, we'd rather our project only include the exact types that we want instead of grabbing everything from `node_modules/@types`.


[^1]: Another option was to surrender to `NodeJS.Timeout` and use `ReturnType<typeof setTimeout>` instead of `number` everywhere.


[TypeScript's compiler options]: https://www.typescriptlang.org/tsconfig
[`explainFiles`]: https://www.typescriptlang.org/tsconfig#explainFiles
[`types`]: https://www.typescriptlang.org/tsconfig#types
[Configure `jest` to use this new file]: https://kulshekhar.github.io/ts-jest/docs/getting-started/options/tsconfig/#path-to-a-tsconfig-file
[`globalThis`]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
[Triple-Slash Directives]: https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html
[declaration file]: https://www.typescriptlang.org/docs/handbook/2/type-declarations.html
