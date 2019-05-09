---
layout:   post
title:    "Simplifying TypeScript code with Union Types"
subtitle: "Reduce the size of your code and improve type inference with this technique."
date:     2019-05-11 19:52:13 +0100
image:
  path: /assets/images/half-fish-half-bird.png
  alt:  "Crude drawing of a half-fish, half-bird animal."
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

[Playground]: https://www.typescriptlang.org/play/#src=interface%20BaseAnimal%20%7B%0D%0A%09weight%3A%20number%3B%0D%0A%7D%0D%0A%0D%0Ainterface%20Bird%20extends%20BaseAnimal%20%7B%0D%0A%20%20%20%20wings%3A%20number%3B%0D%0A%20%20%20%20fly%3A%20Function%0D%0A%7D%0D%0A%0D%0Ainterface%20Fish%20extends%20BaseAnimal%20%7B%0D%0A%20%20%20%20fins%3A%20number%3B%0D%0A%20%20%20%20swim%3A%20Function%3B%0D%0A%7D%0D%0A%0D%0Atype%20Animal%20%3D%20Bird%20%7C%20Fish%3B%0D%0A%0D%0Alet%20a%3A%20Animal%3B%0D%0Alet%20b%3A%20BaseAnimal%3B%0D%0A%0D%0Aif%20('wings'%20in%20a)%20%7B%0D%0A%20%20%20%20a.fly()%20%2F%2F%20TypeScript%20already%20knows%20animal%20is%20a%20Bird!%0D%0A%7D%0D%0A%0D%0Aif%20('wings'%20in%20b)%20%7B%0D%0A%20%20%20%20b.fly()%20%2F%2F%20TypeScript%20will%20throw%20an%20error%20unless%20animal%20is%20cast%20to%20Bird.%0D%0A%7D
