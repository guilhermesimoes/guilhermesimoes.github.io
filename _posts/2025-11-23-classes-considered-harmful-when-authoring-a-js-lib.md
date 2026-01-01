---
layout:   post
title:    "Classes considered harmful when authoring a JavaScript library"
date:     2025-11-23 19:53:58 +0000
image:
  hero:   true
  path:   /assets/images/class-system.png
  alt:    "Drawing representing the class system of a feudal society. There's a king, a queen, a bishop, and some nobles."
tags:
  - Perf
  - JavaScript
---

Let me start by saying I'm the biggest [OOP] fan. I love Ruby. I have a copy of [POODR] on my bookcase. I look back fondly to the times of `React.createClass({ mixins: [MyMixin], ... })`. I loathe HOCs and hooks and whatever patterns [FP] zealots have been trying to push for the past couple of years. However, classes and OOP may not always be the best approach.

Also, I'm aware of the ["Considered Harmful" Essays Considered Harmful] essay -- I'm being cheeky with the title.

So with that out of the way, let's go.

---

Performance is critical when writing a JavaScript library meant for the browser. There are two main aspects to performance on the web: the speed of the code -- the faster, the better -- and the size of the code -- the smaller, the better. The more code gets included in a website, the more time the browser spends downloading, decompressing, parsing and executing it. So shipping less code to the browser is of the utmost importance.

The problem of using a class to build a JavaScript service is that it leads to the code being larger than it actually needs to be, for two reasons.

### 1. Classes are not tree-shakeable

That's right. If we import a class with 20 methods and we only use 1 method **everything gets bundled**.

Minifiers / compressors such as [Terser], [SWC] and [esbuild] (which I will simply call "bundlers") do not tree-shake unused class methods because it is dangerous to do so. For example, a bundler could remove a class method, believing it to be unused, that some code could be calling dynamically with `classInstance[dynamicMethodName]()`. But that would result in the code blowing up with an `Uncaught TypeError: classInstance.dynamicMethodName is not a function`.
Since bundlers cannot determine whether a certain method is used or not, they do not take risks and do not tree-shake class methods.

### 2. Class properties and methods are not minifiable

For the same reasons that bundlers cannot remove properties and methods, they also cannot rename them.
Some code could be calling `Object.keys(classInstance)` to get the names of its properties. Or the code could be using `classInstance.hasOwnProperty(propertyName)` to check for a certain property. So bundlers simply can't rename these properties and methods as they wish.

The same is true even for _private_ properties and methods. [And while there are ways to minify those], a lot can definitely go wrong.


---

This is a huge issue in the JavaScript tooling ecosystem, [as Marvin Hagemeister brilliantly explains]:

> A recurring problem in various js tools is that they are composed of a couple of big classes that pull in everything instead of only the code you need. Those classes always start out small and with good intentions to be lean, but somehow they just get bigger and bigger. It becomes harder and harder to ensure that you're only loading the code you need. This reminds me of this quote from Joe Armstrong (creator of the Erlang programming language):
>
> > You wanted a banana but what you got was a gorilla holding the banana and the entire jungle.

And this problem isn't exclusive to packages published on NPM. Many companies' internal codebases have the same issue. As initial requirements change and new requirements are added, these classes mutate and grow. Inevitably this leads to huge (and slow) websites being served to users worldwide.

So what can we do about this? Is there an alternative, better way to author a JavaScript library?

Well, bundlers are already very good at [tree-shaking unused exports]. If we import and use 1 function from a module that exports 20 functions, only that one function gets bundled.

So when writing a JavaScript service we should avoid exposing its API through classes and public methods. Instead, expose it through named exports!

Instead of this:

```js
// lib
export class Chirpy {
  constructor(options) {
    this.options = options;
  }

  chirp(message) {
    return fetch(`${this.options.endpoint}/chirp`, {
      method: 'POST',
      body: JSON.stringify(message),
    })
    .then(this.parseJson);
  }

  parseJson(response) {
    return response.json();
  }
}
```
```ts
// usage
import { Chirpy } from 'chirpy';

const client = new Chirpy(config);
client.chirp('hello');
```

We can do this[^1][^2]:

```js
// lib
let options;

export function initialise(opts) {
  options = opts;
}

export function chirp(message) {
  return fetch(`${options.endpoint}/chirp`, {
    method: 'POST',
    body: JSON.stringify(message),
  })
  .then(parseJson);
}

function parseJson(response) {
  return response.json();
}
```
```ts
// usage
import { initialise, chirp } from 'chirpy';

initialise(config);
chirp('hello');
```

This pattern [results in a reduced bundle size] due to the two reasons we observed previously. First, "private" functions like `parseJson` and "private" variables like `options` are untouchable from outside the module, so bundlers can minify them. And second, module exports that are unused can be tree-shaken by bundlers.

This pattern also gives us the freedom to increase the public API of our library (by adding more exported functions to the module) without having to worry about it affecting our consumers' bundle sizes. The functions are only included in consumers' bundles if they get imported, otherwise they are tree-shaken.

I call this pattern the **Service Module**. Use it whenever possible instead of service classes, classes with static methods or singletons. You know, it's funny, I remember the [Module Pattern] being discussed a long, long time ago as a way to isolate and organize JavaScript modules, way before the keywords `import` and `export` were even part of modern JavaScript. Time to bring it back!


[^1]: With this pattern we can still keep the previous API more or less intact by doing the following:

    ```js
    // usage
    import * as Chirpy from 'chirpy';

    Chirpy.initialise(config);
    Chirpy.chirp('hello');
    ```

    But `import * as Something` is not tree-shakeable, so we should avoid using it if we care about our bundle size.

[^2]: A drawback of this pattern is that consumers are no longer able to create two different instances of the same class:

    ```js
    // usage
    import { Chirpy } from 'chirpy';

    const client1 = new Chirpy(config);
    const client2 = new Chirpy(anotherConfig);

    client1.chirp('hello');
    client2.chirp('hey');
    ```

    But if creating multiple instances of the same service doesn't make sense for your JavaScript library, then this isn't an issue.

[OOP]: https://en.wikipedia.org/wiki/Object-oriented_programming
[POODR]: https://www.poodr.com/
[FP]: https://en.wikipedia.org/wiki/Functional_programming
["Considered Harmful" Essays Considered Harmful]: https://meyerweb.com/eric/comment/chech.html
[as Marvin Hagemeister brilliantly explains]: https://marvinh.dev/blog/speeding-up-javascript-ecosystem-part-4/
[Terser]: https://try.terser.org/
[SWC]: https://play.swc.rs/
[esbuild]: https://esbuild.github.io/try/
[And while there are ways to minify those]: 2025-06-23-minifying-private-properties-and-methods-with-terser.md
[tree-shaking unused exports]: https://cube.dev/blog/how-to-build-tree-shakeable-javascript-libraries
[results in a reduced bundle size]: 2023-05-16-service-class-vs-service-module.md
[Module Pattern]: https://web.archive.org/web/20190210024925/https://www.oreilly.com/library/view/learning-javascript-design/9781449334840/ch09s02.html
