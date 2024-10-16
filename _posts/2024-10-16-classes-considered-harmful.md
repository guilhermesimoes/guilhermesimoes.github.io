---
layout:   post
title:    "Classes considered harmful when authoring a JavaScript library"
date:     2023-10-16 14:00:45 +0000
image:
  hero:   true
  path:   /assets/images/class-system.png
  alt:    "Drawing representing the class system of a feudal society. There's a king, a queen, a bishop, and some nobles."
---

Let me start by saying I'm the biggest [OOP] fan. I love Ruby. I have a copy of [POODR] on my bookcase. I look back fondly to the times of `React.createClass({ mixins: [MyMixin], ... })`. I loathe HOCs and hooks and whatever patterns [FP] zealots have been trying to push for the past couple of years. However, classes and OOP may not always be the best approach.

Also, I'm aware of the ["Considered Harmful" Essays Considered Harmful] essay -- I'm being cheeky with the title.

So with that out of the way, let's go.

---

Performance is critical when writing a JavaScript library meant for the browser. There are two main aspects to performance on the web: the speed of the code -- the faster, the better -- and the size of the code -- the smaller, the better. The more code gets included in a website, the more time the browser spends downloading, decompressing, parsing and executing it. So shipping less code to the browser is of the utmost importance.

The problem of using a class to build a JavaScript library is that it leads to the code being larger than it actually needs to be, for two reasons.

### 1. Classes are not tree-shakeable

That's right. If you import a class with 20 instance methods and you only use 1 method **everything gets bundled**.

Minifiers / compressors such as [Terser], [SWC] and [esbuild] (which I will simply call "bundlers") do not tree-shake unused class methods because it is dangerous to do so. For example, our code could be checking if a class has a certain static method with `ServiceClass.hasOwnProperty(methodName)`. Or our code could be dynamically calling `classInstance[dynamicMethodName]()`. There's no way bundlers can (easily) determine whether a certain method is used or not and so they do not tree-shake methods.

### 2. Class properties and methods are not (easily) minifiable

For the same reasons that bundlers cannot remove properties or methods, they also cannot rename them.
Our code could be calling `Object.keys(classInstance)` to get the names of its properties. Or our code could be using `classInstance.hasOwnProperty(prop)` to check if a class instance has a certain property. So bundlers can't rename these properties and methods willy-nilly.

The same is true even for _private_ properties and methods. [And while there are ways to minify those], a lot can definitely go wrong.


---

This is a huge issue in the JavaScript tooling ecosystem, [as Marvin Hagemeister brilliantly explains]:

> A recurring problem in various js tools is that they are composed of a couple of big classes that pull in everything instead of only the code you need. Those classes always start out small and with good intentions to be lean, but somehow they just get bigger and bigger. It becomes harder and harder to ensure that you're only loading the code you need. This reminds me of this quote from Joe Armstrong (creator of the Erlang programming language):
>
> > You wanted a banana but what you got was a gorilla holding the banana and the entire jungle.

And this problem isn't exclusive to npm. Many companies' codebases have the same issue. As initial requirements change and new requirements are added, inevitably their classes mutate and grow. Thus leading to huge websites being served to users worldwide.

So what can we do about this? Is there an alternative, better way to author a JavaScript library?

Well, bundlers are already very good at tree-shaking unused exports. If we import and use 1 function from a module that exports 20 functions, only that one function gets bundled.

So when writing a JavaScript library we should avoid exposing its API through public instance methods and instead expose it through named exports!

Instead of this:

```js
import { Chirpy } from 'chirpy';

const service = new Chirpy(config);
service.chirp('hello');
```

We can do this:

```js
import { initialise, chirp } from 'chirpy';

initialise(config);
chirp('hello');
```

If we somehow don't care at all about our bundle size, we can still keep the previous API more or less intact by doing the following:

```js
import * as Chirpy from 'chirpy';

Chirpy.initialise(config);
Chirpy.chirp('hello');
```

But we should avoid using `import * as Something` since it's not tree-shakeable.

I call this pattern a **Service Module**, which I compare to the widely used **Service Class** in the post ["Service Class vs Service Module"].

A drawback of this Service Module pattern is that consumers are no longer able to create two different instances of the same class:

```js
import { Chirpy } from 'chirpy';

const service1 = new Chirpy(config);
const service2 = new Chirpy(anotherConfig);

service1.chirp('hello');
service2.chirp('hey');
```

But if creating multiple instances of the same class doesn't make sense for your JavaScript library, then this isn't an issue.

Go on and give this pattern a try.


[OOP]: https://en.wikipedia.org/wiki/Object-oriented_programming
[POODR]: https://www.poodr.com/
[FP]: https://en.wikipedia.org/wiki/Functional_programming
["Considered Harmful" Essays Considered Harmful]: https://meyerweb.com/eric/comment/chech.html
[as Marvin Hagemeister brilliantly explains]: https://marvinh.dev/blog/speeding-up-javascript-ecosystem-part-4/
[Terser]: https://try.terser.org/
[SWC]: https://play.swc.rs/
[esbuild]: https://esbuild.github.io/try/
[And while there are ways to minify those]: 2023-05-16-minifying-private-properties-and-methods-with-terser.md
["Service Class vs Service Module"]: 2023-05-16-service-class-vs-service-module.md

https://cube.dev/blog/how-to-build-tree-shakeable-javascript-libraries
https://blog.theodo.com/2021/04/library-tree-shaking/
https://blog.kbdev.io/dev/2021/06/08/singleton-the-js-way.html
https://www.telerik.com/blogs/how-module-pattern-works-javascript
https://www.oreilly.com/library/view/learning-javascript-design/9781449334840/ch09s02.html
