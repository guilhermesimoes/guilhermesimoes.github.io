---
layout:   post
title:    "Simplifying TypeScript code with Union Types"
subtitle: "Reduce the size of your code and improve type inference with this technique."
date:     2019-05-11 19:52:13 +0100
hero_image:
  path:   /assets/images/half-fish-half-bird.png
  alt:    "Crude drawing of a half-fish, half-bird animal."
---
Let's imagine we have the following TypeScript interfaces:

```ts
export interface Animal {
  weight: number;
}

export interface Bird extends Animal {
  wings: number;
  fly: Function;
}

export interface Fish extends Animal {
  fins: number;
  swim: Function;
}
```

Our code deals with all kinds of animals so all our functions look more or less like so:

```ts
function observe(animal: Animal) {
  // ...
}
```

There's an issue though. What if we need to know specifically whether we have a `Bird`? While checking for `animal.wings` is perfectly valid JavaScript, TypeScript errors out with `Property 'wings' does not exist on type 'Animal'`. Which makes sense: the `Animal` interface only declares a `weight` property.

The solution, then, is to use what's called a [Union Type]:

```ts
function observe(animal: Bird | Fish) {
  // ...
}
```

A union type describes a value that can be one of several types. Here animal can either be a `Bird` or a `Fish`. And since a `Bird` has `wings` TypeScript won't complain if we make a check for that property.

However, this has some drawbacks:

1. The type declaration is wider, affecting the shape of the code.
2. Adding a new animal classification like `Reptile` will potentially require changing a lot of type declarations.

What should we do then?

Well, we can hide (not export) the base interface and export `Animal` as a union of all animal classification types:

```ts
interface BaseAnimal {
  weight: number;
}

export interface Bird extends BaseAnimal {
  wings: number;
  fly: Function;
}

export interface Fish extends BaseAnimal {
  fins: number;
  swim: Function;
}

export type Animal = Bird | Fish;
```

Now to add `Reptile` we would only need to update the `Animal` export.

---

As an added benefit, this technique allows TypeScript to better infer types.

Whereas before we had to do this:

```ts
let animal: BaseAnimal;

if ('wings' in animal) {
  (animal as Bird).fly(); // TypeScript will throw an error unless animal is cast to Bird.
}
```

Now we can do this:

```ts
let animal: Animal;

if ('wings' in animal) {
  animal.fly(); // TypeScript already knows animal is a Bird!
}
```

[Pretty neat][Playground].

[Union Type]: https://www.typescriptlang.org/docs/handbook/advanced-types.html#union-types

[Playground]: https://www.typescriptlang.org/play#code/JYOwLgpgTgZghgYwgAgEJwM4QIImAWzgBtkBvAWACgBIAdwmAHMALMALmRAFd8AjaANxUAvlSqhIsRClTAoAE2QQAHpBDyMaTDjyESFSsiPJaoRhg7c+gqseQwiATw4AxLiARhgAexAixlBLQ8EjILsAYzEqqEOqa6Fi4BMRktsYwoBacPPxQQobGGKb4ru6ePiD5opRUYI4ADihJesgAvGhyigA+YRHM+VREEGDIcBzNxPlDI7wcCTrJRAOBMMgAFADkpiDmG8igowCUqQVGcAB0Do5rxwD0t8gAKg0QAMoIUMD1I8RQEHDyRzIADWIG8tE0cF0KQiow6CgAhP4ait1lszBg9gdeMcDHZeJcnDdkPcni93p9viZgEQSGBmFBwaMQEooIyoMh3EMMJDoSRYQhMCMwN54fJziIgA
