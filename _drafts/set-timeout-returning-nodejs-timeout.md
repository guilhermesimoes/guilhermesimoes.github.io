---
layout:   post
title:    "Making setTimeout return number instead of NodeJS.Timeout"
date:     2024-07-20 18:48:45 +0000
---


For the longest time, we've had to deal with the fact that Node types were being included in the project. That's why `setTimeout` returned a `NodeJS.Timeout` instead of a `number`.

The way we used in the past to deal with this was to place the following at the top of each file:
```ts
declare let setTimeout: WindowOrWorkerGlobalScope['setTimeout'];
```

We thought this was part of TS but after discovering the TS compiler option [`explainFiles`] which explains in detail how each typing gets included in a project, we found this:

> node_modules/@types/node/index.d.ts
> Type library referenced via 'node' from file 'node_modules/@types/graceful-fs/index.d.ts' with packageId '@types/node/index.d.ts@20.5.7'

> node_modules/@types/node/index.d.ts
> Type library referenced via 'node' from file 'node_modules/@types/cacheable-request/index.d.ts' with packageId '@types/node/index.d.ts@18.11.17'

By using the TS compiler option [`types`], we can prevent all packages in node_modules/@types/* from being automatically included in the project. This fixes `@types/graceful-fs` (or `@types/cacheable-request`) being included and consequently including `@types/node`.

Do note that while using `types` is the most correct solution, they can make your tests fail in weird ways because they're expecting NodeJS types (which makes sense, the tests run in a NodeJS environment). So you'll most likely need a `tsconfig.test.json`.

It would actually be accurate to include `"node"` inside the `tsconfig.test.json`'s `types` array. The issue is that by doing that, we'd "pollute" the global typing environment during tests. So `yarn build` would work but `yarn test` would fail. The types of all the `setTimeout`s _in the code_ would change and would start returning `NodeJS.Timeout` instead of `number`. The solution then is to use `globalThis` (since `global` is a node type) and use this magic trick (called [Triple-Slash Directives](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) ✨) where `node` types are really needed:
```
/// <reference types="node" />
```


```ts
// globals.d.ts
declare let process: {
  env: {
    NODE_ENV: string;
  }
}
```

[`explainFiles`]: https://www.typescriptlang.org/tsconfig#explainFiles
[`types`]: https://www.typescriptlang.org/tsconfig#types
