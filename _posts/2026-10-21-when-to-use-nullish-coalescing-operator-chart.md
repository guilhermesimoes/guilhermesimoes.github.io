---
layout: post
title:  "Nullish Coalescing Operator Chart"
date:   2026-10-21 21:11:44 +0100
image:
  path: /assets/images/flamingos.png
  alt:  "Drawing of two flamingos, side by side, almost resembling two question marks."
class:  "bleed"
tags:   [Perf, JavaScript, Web]
---

{%- include charts/nullish-coalescing-operator.svg -%}

<div class="wrapper" markdown="1">

[Proof][Playground]:

<div class="centered centered--spaced" markdown="1">

```ts
// source code
num || 0
// vs
num ?? 0
```

```ts
// code transpiled to target < ES2020
num || 0;
// vs
num !== null && num !== void 0 ? num : 0;
```

</div>

</div>

[Playground]: https://www.typescriptlang.org/play/?alwaysStrict=false&target=6#code/G4QwTgBAdgrgtgGggZwC5iQIwPbYDZLaYBWA3AFDkD0VEAvA408y62+05bHBAPy8QADNVrBk5bhAA+UoZRr0OS5SoaU0kfhABE2kRDHkN02bvm1Vlq53I58fAQDMQeZAFN9hu3hMRnrj31rYNVKImIHCABvAF9PcXDfWKA
