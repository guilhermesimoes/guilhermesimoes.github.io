---
layout: post
title: "Nullish Coalescing Operator Chart"
date: 2026-05-27 08:00:45 +0000
image:
  path: /assets/images/csp-directives-chart.png
  alt: "Nullish coalescing operator chart."
tags: [D3, Web]
---

{%- include charts/nullish-coalescing-operator.svg -%}

```
graph TB
    A["When can you use ?? if you care about bundle-size"] --> B{"Using ES2020 or above?"};
    B -->|No| C{"Doing `num ?? 0`?"};
    B -->|Yes| K["Sure, use `??` to your heart's content"];
    C -->|Yes| D["Stop! Use `num || 0`"];
    C -->|No| E{"Doing `str ?? ''`?"};
    E -->|Yes| F["Stop! Use `str || ''`"];
    E -->|No| G{"Doing `bool ?? false`?"};
    G -->|Yes| H["Stop! Use `bool || false`"];
    G -->|No| I{"Doing `obj ?? {}`?"};
    I -->|Yes| J["Stop! Use `obj || {}`"];
    I -->|No| K["Sure, use `??` to your heart's content"];
```

[Proof][Playground]

[Playground]: https://www.typescriptlang.org/play/?alwaysStrict=false&target=6#code/G4QwTgBAdgrgtgGggZwC5iQIwPbYDZLaYBWA3AFDkD0VEAvA408y62+05bHBAPy8QADNVrBk5bhAA+UoZRr0OS5SoaU0kfhABE2kRDHkN02bvm1Vlq53I58fAQDMQeZAFN9hu3hMRnrj31rYNVKImIHCABvAF9PcXDfWKA

https://gist.github.com/guilhermesimoes/586a96cc6700a962b2fb58bd5bc600b1
