---
layout: post
title:  "Nullish Coalescing Operator Chart"
date:   2026-10-21 15:33:46 +0100
image:
  path: /assets/images/flamingos.png
  alt:  "Drawing of two flamingos, side by side, almost resembling two question marks."
class:  "bleed"
tags:   [Perf, JavaScript, Web]
---

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

[Proof][Playground].

[Playground]: https://www.typescriptlang.org/play/?alwaysStrict=false&target=6#code/G4QwTgBAdgrgtgGggZwC5iQIwPbYDZLaYBWA3AFDkD0VEAvA408y62+05bHBAPy8QADNVrBk5bhAA+UoZRr0OS5SoaU0kfhABE2kRDHkN02bvm1Vlq53I58fAQDMQeZAFN9hu3hMRnrj31rYNVKImIHCABvAF9PcXDfWKA
