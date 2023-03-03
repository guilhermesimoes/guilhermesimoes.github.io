---
layout:   post
title:    "Classes considered harmful when authoring a JavaScript library"
date:     2023-05-26 16:00:45 +0000
---

Let me start by saying I'm the biggest [OOP] fan. I love Ruby. I have a copy of [POODR] on my bookcase. I look back fondly to the times of `React.createClass({ mixins: [MyMixin], ... })`. I loathe HOCs and hooks and whatever patterns [FP] zealots have been trying to push for the past couple of years. However, classes and OOP may not always be the best approach.

Also, I'm aware of the ["Considered Harmful" Essays Considered Harmful] essay -- I'm being cheeky with the title.

So with that out of the way, let's go.

---

Performance is critical when writing a JavaScript library meant for the browser. There are two main aspects to performance on the web: the speed of the code -- the faster, the better -- and the size of the code -- the smaller, the better.



The biggest drawback of the current approach is the use of classes. Most of our services are classes that expose their APIs through instance methods.

If you import a class with 30 instance methods and you only use 1 method **everything gets bundled**.
However, if you import from a module that exports 30 functions and you only use 1 function, only that one gets bundled (if your bundler supports tree-shaking).


https://marvinh.dev/blog/speeding-up-javascript-ecosystem-part-4/


A recurring problem in various js tools is that they are composed of a couple of big classes that pull in everything instead of only the code you need. Those classes always start out small and with good intentions to be lean, but somehow they just get bigger and bigger. It becomes harder and harder to ensure that you're only loading the code you need. This reminds me of this quote from Joe Armstrong (creator of the Erlang programming language):

> You wanted a banana but what you got was a gorilla holding the banana and the entire jungle.
>
> -- Joe Armstrong


What then happens is the following: new propositions are created, requirements change and new requirements are added. Then a new proposition needs a slightly different API, so they add a new instance method to that service class. Repeat ad eternum and we end up with 500 line classes filled with instance methods that cannot be tree-shaken that are bundled on all propositions, when each proposition only needs 1 method or 2 from that class. On Peacock, for example, we're bundling [this entire class](https://github.com/sky-uk/client-lib-js-ott/blob/master/packages/client-lib-js-ott-ovp/src/services/payments-manager/payments-manager-service.js) (as well as its dependencies) because we want to call this [one method](https://github.com/sky-uk/client-lib-js-ott/blob/master/packages/client-lib-js-ott-ovp/src/services/payments-manager/payments-manager-service.js#L388-L393).

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





[OOP]: https://en.wikipedia.org/wiki/Object-oriented_programming
[POODR]: https://www.poodr.com/
[FP]: https://en.wikipedia.org/wiki/Functional_programming
["Considered Harmful" Essays Considered Harmful]: https://meyerweb.com/eric/comment/chech.html

https://blog.kbdev.io/dev/2021/06/08/singleton-the-js-way.html
https://www.telerik.com/blogs/how-module-pattern-works-javascript
https://www.oreilly.com/library/view/learning-javascript-design/9781449334840/ch09s02.html
