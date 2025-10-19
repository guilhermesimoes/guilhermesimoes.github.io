---
layout:   post
title:    "Narrowing TypeScript Unions without the `in` operator"
subtitle: "Don't let TypeScript tell you how to write JavaScript."
date:     2025-10-18 23:17:15 +0100
image:
  hero:   true
  path:   /assets/images/half-bird-half-fish.png
  alt:    "Crude drawing of a half-bird, half-fish animal."
---

When using a [Union Type] such as this:

```ts
interface BaseAnimal {
  weight: number;
}

export interface Bird extends BaseAnimal {
  fly: Function;
}

export interface Fish extends BaseAnimal {
  fins: number;
  swim: Function;
}

export type Animal = Bird | Fish;
```

TypeScript does not let us write code like this:

```ts
let animal: Animal;

if (animal.swim) { // Error!
  animal.swim();
}
```

TypeScript errors out with `Property 'swim' does not exist on type 'Bird'`.

Instead, we are "forced" to use the `in` operator:

```ts
let animal: Animal;

if ('swim' in animal) { // TypeScript is ok with this
  animal.swim();
}
```

But if we really want to avoid the `in` operator, for whatever reason, there is a type "trick" we can use:

```ts
export interface Bird extends BaseAnimal {
  fly: Function;
  swim?: undefined // hack
}
```

We can type that same property as `undefined`, and now TypeScript no longer complains:

```ts
let animal: Animal;

if (animal.swim) { // All good!
  animal.swim();
}
```

[See for yourself][Playground].

It's a bit of a hack, and I wouldn't recommend this for general use, but it can be helpful when used judiciously.

[Union Type]: 2019-05-11-simplifying-typescript-code-with-union-types.md

[Playground]: https://www.typescriptlang.org/play/?#code/JYOwLgpgTgZghgYwgAgEJwM4QIIa2ZAbwFgAoZC5AdwmAHMALMALmRAFcBbAI2gG4yAXzJkIADwAOAeygFQkWIhSpgUACbJxkEGoxpMOPBAIlylGABsAnqwBi7EAjDApIAWYoYqwTgH5WDmoQMKAQGgD04cgMiADWQiKk4tKyyPLQ8EjItsAYDJpi2rr6WLj4RGSUyCEgGKwcPPyVlF4+dg5OLm4JpKKSMgRgVhIo2CA+cBbIALxoqhoAPtm5DO5kQQgWcFAoFsbIcKxjExZrpMAwyAAUcAB0rZwAlBUeB-fenFfPkcgAKsMQADKCCgwAkBAQMh2TmsaRAMGgejg404kzSSOWeSEQA
