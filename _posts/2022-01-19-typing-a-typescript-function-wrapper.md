---
layout:   post
title:    "Typing a TypeScript function wrapper"
subtitle: "Things that are simple in JavaScript are a little trickier in TypeScript"
date:     2022-01-19 12:14:00 +0000
image:
  path:   /assets/images/iphone-music-app-paused.png
---

My task was simple: write a function wrapper to measure the time it takes to execute a function. It’s easy to write a function wrapper in JavaScript but in TypeScript this is hard because we need to preserve the types of the wrapped function. It took me a while to figure out how do this so I'm leaving this here so future me doesn't have to waste as much time as past me did.

```ts
function instrumentFn<F extends (...args: any[]) => ReturnType<F>>(id: string, fn: F) {
  return (...args: Parameters<F>) => {
    const t1 = performance.now();

    const result = fn(...args);

    const t2 = performance.now();

    console.log(`${id} took ${t2 - t1}ms`);

    return result;
  };
}
```

The tricky parts are these:

- `F extends (...args: any[]) => Type` to type `fn` as a generic function.
- [`ReturnType<Type>`] to get the return type of `fn`.
- [`Parameters<Type>`] to get the types of the parameters of `fn`.

And here's an example of using `instrumentFn`:

```ts
function fibonacci(n: number): number {
   if (n < 1) {
     return 0;
   } else if (n <= 2) {
     return 1;
   } else {
     return fibonacci(n - 1) + fibonacci(n - 2);
   }
}

const instrumentedFibonacci = instrumentFn('fibonacci', fibonacci);

instrumentedFibonacci(30);
```

[Pretty cool][Playground].

[`ReturnType<Type>`]: https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype
[`Parameters<Type>`]: https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype
[Playground]: https://www.typescriptlang.org/play?ts=4.5.4#code/GYVwdgxgLglg9mABDMBnKAnEBbApmKAMTAB5DFcAPKfAE1UQAoA6VgQwwHNUAuRNsAE8A2gF0AlIgC8APkQAlXFBAYwAFUEAHXGRkzGMWn3QYUnADSJgYPoUkBvAFCJEGJSqQtWlPgAUObHg0GKi6krKITi4uEAjoiFAAjNKI2hjAcBjYAhC4zGBwAO6M4gDcztGxaFCuuKggADY1UlZgXsyUZRUxcTVQAEwpaRlZOXkFxV3RiFWocA15DXCcjAAGACT2hgC+CXBwANaImwOIALQJidvYqKtT0W7KqrX1TeUu2+Xbjo6gkLAIKwwABGCDYEAgMEYNkQYBwwNwGHEfDh2ARGEi3RgwCYSBIiESDm6LkeHkQAAZ3h8KA1ULhkDjoYgSC1+kTprUnkhElTELtcLT6VFpqTnsAQWCIVCkBdCYgANRA0FgcGQpkXNm877fRyzGooEw4fA0WiECUqqUpA2YI0EYiMADk4uVqpgDsszslkK6uri80WywM1SweAIuFN5tdjAAzOTxGUgA