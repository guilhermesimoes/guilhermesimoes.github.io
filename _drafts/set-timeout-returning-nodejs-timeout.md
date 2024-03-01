---
layout:   post
title:    "Making setTimeout return number instead of NodeJS.Timeout"
date:     2024-07-20 18:48:45 +0000
---


For the longest time, we've had to deal with the fact that Node types were being included in the project. That's why `setTimeout` returned a `NodeJS.Timeout` instead of a `number`.

We thought this was part of TS but after discovering the TS compiler option [`explainFiles`] which explains in detail how each typing gets included in a project, we found this:

> node_modules/@types/node/index.d.ts
>  Type library referenced via 'node' from file 'node_modules/@types/graceful-fs/index.d.ts' with packageId '@types/node/index.d.ts@20.5.7'

By using the TS compiler option [`types`], we can prevent all packages in node_modules/@types/* from being automatically included in the project. This fixes `@types/graceful-fs` being included and consequently including `@types/node`.

[`explainFiles`]: https://www.typescriptlang.org/tsconfig#explainFiles
[`types`]: https://www.typescriptlang.org/tsconfig#types
