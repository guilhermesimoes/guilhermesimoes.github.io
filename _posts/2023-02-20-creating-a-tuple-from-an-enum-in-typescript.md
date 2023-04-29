---
layout:   post
title:    "Creating a tuple from the values of an enum in TypeScript"
subtitle: "Transforming a dictionary/object into an array in TypeScript"
date:     2023-02-20 19:39:34 +0000
image:
  hero:   true
  path:   /assets/images/dithered-record-player.png
  alt:    "A close-up of a vinyl turntable, playing a record."
---

We have a TypeScript package that uses and exports <sup id="reverse-footnote-1"><a href="#footnote-1" rel="footnote">[1]</a></sup> this enum:

```ts
export const enum AudioFormat {
    STEREO,
    SURROUND_5_1,
    SURROUND_7_1,
    ATMOS,
}
```

And we'd like to make available to consumers of our package an array containing _all_ the values of this enum. We could do the following:

```ts
export const ALL_AUDIO_FORMATS = Object.values(AudioFormat);
```

But this has several problems.

The first one is that it doesn't actually work. Since we're using a `const enum` (instead of a regular `enum`) we get the following error:

> 'const' enums can only be used in property or index access expressions or the right hand side of an import declaration or export assignment or type query.

But let's say we don't care about the inlining of `const enum`s in our package <sup id="reverse-footnote-2"><a href="#footnote-2" rel="footnote">[2]</a></sup>. Let's say we use a regular `enum`. In that case `Object.values` does work but:

1. We're not actually exporting an array. Consumers of our package are bundling code that _at runtime_ creates an array from the `AudioFormat` object and then exports _that_.

2. This calculation at runtime happens _for every user_ that visits a website that bundles our package. Seems kind of wasteful to be calculating the same thing over and over again.

3. `Object.values` does not exist on older devices so now consumers of our package may need to polyfill it.

All these disadvantages make this a no-go. The ideal solution would be to export an actual array containing all enum values. Basically this:

```ts
export const ALL_AUDIO_FORMATS = [0, 1, 2, 3];
```

To achieve this we could evaluate the TypeScript enum at build time and emit into the final JavaScript bundle this array <sup id="reverse-footnote-3"><a href="#footnote-3" rel="footnote">[3]</a></sup>. But this seems somewhat complex and we would likely need to add another dependency to our build toolchain.

There should be a way to use TypeScript types to guarantee that an array contains all the values of an enum. A naive approach would be the following:

```ts
export const ALL_AUDIO_FORMATS: Array<AudioFormat> = [0, 1, 2, 3];
```

But this doesn't actually do what we want. `Array<AudioFormat>` ensures that `ALL_AUDIO_FORMATS` only contains `AudioFormat`s but it doesn't ensure that it contains _all_ possible `AudioFormat`s. TypeScript would accept this:

```ts
export const ALL_AUDIO_FORMATS: Array<AudioFormat> = [1, 1, 1];
```

The code would also still compile if someone added a new value to our enum, but we want compilation to fail in that situation.

What can we do then? Some TypeScript magic:

```ts
type UnionToIntersection<U> = (U extends never ? never : (arg: U) => never) extends (arg: infer I) => void ? I : never;
type UnionToTuple<T> = UnionToIntersection<T extends never ? never : (t: T) => T> extends (_: never) => infer W
    ? [...UnionToTuple<Exclude<T, W>>, W]
    : [];
```

Some recursion <sup id="reverse-footnote-4"><a href="#footnote-4" rel="footnote">[4]</a></sup>, plus the spread operator and [infer]
and presto! This now works as expected:

```ts
export const ALL_AUDIO_FORMATS: UnionToTuple<AudioFormat> = [
    AudioFormat.STEREO,
    AudioFormat.SURROUND_5_1,
    AudioFormat.SURROUND_7_1,
    AudioFormat.ATMOS,
];
```

Removing any of these values from the array results in a compile error. Adding a new value to the enum without updating the array also results in a compile error.

This solution does require some manual work to keep the array up-to-date with the enum. But it's simple enough for most use-cases. [Give it a try][Playground]!

<div class="footnotes">
  <ol>
    <li class="footnote" id="footnote-1">
      <p markdown="1">To be able to export a `const enum` we need to use the tsconfig option [`preserveConstEnums`]. <a href="#reverse-footnote-1" class="reversefootnote">↩</a></p>
    </li>
    <li class="footnote" id="footnote-2">
      <p markdown="1">We should prefer `const enum` to `enum`. Generally [bundle size is reduced and runtime performance is improved when using `const enum`]. <a href="#reverse-footnote-2" class="reversefootnote">↩</a></p>
    </li>
    <li class="footnote" id="footnote-3">
      <p markdown="1">There are already some solutions for evaluating JavaScript at build time such as [Preval] and [Prepack] but I have not used any of them so I can't vouch for them. <a href="#reverse-footnote-3" class="reversefootnote">↩</a></p>
    </li>
    <li class="footnote" id="footnote-4">
      <p>Do note that older versions of TypeScript do not support recursive type aliases and throw the following error:<blockquote>Type alias 'UnionToTuple' circularly references itself.</blockquote>For the magic to work we must be using at least TypeScript v4.1.5. <a href="#reverse-footnote-4" class="reversefootnote">↩</a></p>
    </li>
  </ol>
</div>

[infer]: https://blog.logrocket.com/understanding-infer-typescript/
[Playground]: https://www.typescriptlang.org/play?ts=4.1.5#code/KYDwDg9gTgLgBAYwgOwM72MgrgWzgQSwBMBLCAMWhwEN4BvAKDmbgGUAVAUQCVOB5OABomLVgFVu3PmIByAEQD6AVgUBGYSzYSpsxQHY1GlvnYBZPq2EBfBgxgBPMMDhjkZZOwgBJZDGBRUYAQYdwAeMQA+OABeOAAKMThQP2QiVDhkYAA3fzgAfgzs3IAueOooAHNSsQBKGKjMnKg65Mw0ssrSkmQAM1yvOuiorIgSIny4LzhSxv8AbjtHZ1d3T3YsMAAbYFD2KNiVlE8fPwCgkJRdpJAU9tmoCfvp+JhS9kGovevb9LiFGaKzXqcG6fQeAHURMwCgBtAB0CMOHgg6y2O04IAQm2IO3Ygjg4IiEXx4IAulDnjDSQsGKBILBECh0AQADIshT4MRyLx8BTkPjcUwmVjVNxHFEbbahQikChUWj7OAwikysiUKA0GBwjg8fhGZiquUa2ja7TSeTKQwq4hq+Va8SSc36K2aQ3qzVwkzmSwMakMIA
[`preserveConstEnums`]: https://www.typescriptlang.org/tsconfig#preserveConstEnums
[bundle size is reduced and runtime performance is improved when using `const enum`]: https://ultimatecourses.com/blog/const-enums-typescript
[Preval]: https://github.com/kentcdodds/babel-plugin-preval#preval-file-comment--preval
[Prepack]: https://github.com/facebookarchive/prepack
