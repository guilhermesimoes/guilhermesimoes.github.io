---
layout:   post
title:    "Classes considered harmful when authoring a JavaScript library"
date:     2023-05-26 16:00:45 +0000
---

Let me start by saying I'm the biggest [OOP] fan. I love Ruby. I have a copy of [POODR] on my bookcase. I look back fondly to the times of `React.createClass({ mixins: [MyMixin], ... })`. I loathe HOCs and hooks and whatever patterns [FP] zealots have been trying to push for the past couple of years. However, classes and OOP may not always be the best approach.

Also, I'm aware of the ["Considered Harmful" Essays Considered Harmful] essay -- I'm being cheeky with the title.

So with that out of the way, let's go.

---

Performance is critical when writing a JavaScript library meant for the browser. There are two main aspects to performance on the web: the speed of the code -- the faster, the better -- and the size of the code -- the smaller, the better. The more code gets included in a website, the more time the browser will spend downloading, decompressing, parsing and executing it. So shipping less code to the browser is of the utmost importance.

The problem of using a class to build a service is that it causes the size of the code to be larger than it actually needs to be. There are two reasons for this, and they are both linked to the current state of JavaScript toolchains.

### Classes are not tree-shakable

That's right. If you import a class with 20 instance methods and you only use 1 method **everything gets bundled**.



https://marvinh.dev/blog/speeding-up-javascript-ecosystem-part-4/


A recurring problem in various js tools is that they are composed of a couple of big classes that pull in everything instead of only the code you need. Those classes always start out small and with good intentions to be lean, but somehow they just get bigger and bigger. It becomes harder and harder to ensure that you're only loading the code you need. This reminds me of this quote from Joe Armstrong (creator of the Erlang programming language):

> You wanted a banana but what you got was a gorilla holding the banana and the entire jungle.
>
> -- Joe Armstrong


What then happens is the following: new propositions are created, requirements change and new requirements are added. Then a new proposition needs a slightly different API, so they add a new instance method to that service class. Repeat ad eternum and we end up with 500 line classes filled with instance methods that cannot be tree-shaken that are bundled on all propositions, when each proposition only needs 1 method or 2 from that class. On Peacock, for example, we're bundling [this entire class](https://github.com/sky-uk/client-lib-js-ott/blob/master/packages/client-lib-js-ott-ovp/src/services/payments-manager/payments-manager-service.js) (as well as its dependencies) because we want to call this [one method](https://github.com/sky-uk/client-lib-js-ott/blob/master/packages/client-lib-js-ott-ovp/src/services/payments-manager/payments-manager-service.js#L388-L393).

### Class properties and methods are not minifiable\*

Minifiers / compressors such as [Terser] and [SWC] are unable to minify class properties and methods. In the following example:

```js
class Chirpy {
  constructor(options) {
    this._options = options;
  }

  chirp(message) {
    return fetch(`${this._options.endpoint}/chirp`, {
      method: 'POST',
      body: JSON.stringify(message),
    })
    .then(this._parseJson);
  }

  _parseJson(response) {
    return response.json();
  }
}
```

Neither `_options` nor `_parseJson` are minified. If a service class has lots of properties and private methods that could make quite the difference.

Using TypeScript we could mark these as `private` and then, using a TS transformer[^1], we could prefix them with `_private_`. `_options` would be renamed to `_private_options` and `_parseJson` to `_private_parseJson`. Then we could configure our minifier (let's use `terser` here) to minify any properties with that prefix:

```js
mangle: {
  properties: {
    regex: /^_private_/,
  }
}
```

But there's a certain degree of risk in doing this. If the class extends another class, for example, there's no garantee that a minified property won't clobber a property from the parent. For instance:

```ts
class Bar {
  private prop1: string;

  constructor(options) {
    this.prop1 = options.prop1;
  }
}

class Foo extends Bar {
  private prop2: string;

  constructor(options) {
    super(options)
    this.prop2 = options.prop2;
  }
}
```

It's possible that both `prop1` and `prop2` get minified to the same identifier:

```js
class Bar {
  constructor(options) {
    this.x = options.x;
  }
}

class Foo extends Bar {
  constructor(options) {
    super(options)
    this.x = options.x;
  }
}
```

This outcome is grim.

So while minifying private properties and methods _is_ possible, a lot can definitely go wrong.

---

What's the alternative then?

Well, current JavaScript toolchains are very good at tree-shaking unused exports.

However, if you import from a module that exports 20 functions and you only use 1 function, only that one gets bundled (if your bundler supports tree-shaking).


that exposes its API through public instance methods







Our main objective with this new architecture, then, is to encourage less code, code that is tree-shakeable, and code that leads to smaller app bundles.

The guidelines that we came up with are the following:
1. Prefer modules with exports to classes with instance methods

As for the impact on the API itself, we would go from the current:
```ts
import { PersonaService } from '@sky-uk-ott/some-package';

const service = new PersonaService(config);

service.getPersona();
```
to:
```ts
import { initialise, getPersona } from '@sky-uk-ott/some-package';

initialise(config);
getPersona();
```
A drawback of the proposed approach is that consumers of the package would no longer be able to create two different instances of the same class, like this:

```ts
import { PersonaService } from '@sky-uk-ott/some-package';

const service1 = new PersonaService(config);
const service2 = new PersonaService(config);

service1.getPersona();
service2.getPersona();
```

If a team somehow doesn't care at all about its app bundle size, they could still keep the previous API more or less intact by doing the following:
```ts
import * as personaService from '@sky-uk-ott/some-package';

personaService.initialise(config);
personaService.getPersona();
```
But I would advise against this.



[^1]: Like Timokhov’s [ts-transformer-minify-privates] and [ts-transformer-properties-rename], for example.

[OOP]: https://en.wikipedia.org/wiki/Object-oriented_programming
[POODR]: https://www.poodr.com/
[FP]: https://en.wikipedia.org/wiki/Functional_programming
["Considered Harmful" Essays Considered Harmful]: https://meyerweb.com/eric/comment/chech.html
[Terser]: https://try.terser.org/
[SWC]: https://play.swc.rs/?version=1.3.62&code=H4sIAAAAAAAAA6WSP2%2FCMBDFdyS%2Bww1ITiRkdqpONENpVSrBXtLkwK4c27JNIY3y3es4f0pFh9JOcd7de%2FdzcplIrYUF40aXUI1HAJmS1plD5pSJlHbcv8ZtBcAxbmknwi10p5umWI9Hwd0kRQVam%2B5x8Bl0ByNhhy5j0XZSnedQlLlWXLp6Fszbae8CKNAxlc%2BBPK%2FWGzLt5VeVl3NYrldP1KNyuee7cpjZddVx%2B6SOoYzCwBedGotLq2R8jmzwG%2FR9fi12F%2FBr8GHQH1Df0euL%2F%2FEG2tmkGgLqH9Hvksdkk5CrIb%2FkyKDVfvbFIvQ6fWu6BncICPsHmeAond8xicduPaOQkWr%2BgP4jklP50bL1F%2FMantJCC6SZKppa3ST7xJBF279MGAqh4KiMyElT%2FwS0ImtRAgMAAA%3D%3D&config=H4sIAAAAAAAAA1WPSw7DIAwF9zkF8rrbdtE79BAWdSIifrKJVBTl7iUE0maH3xsz8jooBbNoeKq1PMsQkYX4nEsi2Sf8lARIOxTNJia49XaWvRrRCtVoOxpIyBOluiX3hoMNQajjLXPGmzH%2FC3VwkUnkCu4o%2BsnSVTc0JbjwXmrZDkk50qF%2FwA%2FqsvNjMPLqm4kXGrYvhlQioBQBAAA%3D
[ts-transformer-minify-privates]: https://github.com/timocov/ts-transformer-minify-privates
[ts-transformer-properties-rename]: https://github.com/timocov/ts-transformer-properties-rename

https://cube.dev/blog/how-to-build-tree-shakeable-javascript-libraries
https://blog.theodo.com/2021/04/library-tree-shaking/
https://blog.kbdev.io/dev/2021/06/08/singleton-the-js-way.html
https://www.telerik.com/blogs/how-module-pattern-works-javascript
https://www.oreilly.com/library/view/learning-javascript-design/9781449334840/ch09s02.html
