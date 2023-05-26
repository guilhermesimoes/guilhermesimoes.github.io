---
layout:   post
title:    "The problem with Bad Code"
date:     2023-05-25 16:00:45 +0000
image:
  hero:   true
  path:   /assets/images/patch-of-grass.png
  alt:    "A patch of grass."
---

The problem with bad code is not just that it's bad code. The problem with bad code is that it breeds / gives birth to more bad code.

Code that "is there" inspires new code. It's inevitable. It's even desirable. But if - and only if - the code is good. If the code is bad, well, the bad code will grow.

It's like a weed in a garden.

https://dangoslen.me/blog/writing-software-is-like-growing-a-garden/
https://dev.to/htissink/gardening-cultivating-better-software-4kll
https://fairtiq.com/de/tech/always-be-gardening

> For each desired change, make the change easy (warning: this may be hard), then make the easy change.
>
> -- [Kent Beck]


I've seen this countless times throughout my career.

* There's a bad service -- too slow, too complex, etc. A new service is needed. First, the bad service is copied over into a new file and then it's adapted to fit the new specifications. Now there are two bad services.

* There's a bad test -- mocking the subject under test, needlessly asserting internal calls of the subject under test, doesn't have a [good description], etc. A new test is needed. First, the bad test is copied to a few lines below and then it's changed to assert the new specs. Now there are two bad tests.

* There's a bad configuration field -- it's static and never changes and it could be inlined with the code that uses it. The code that uses that configuration field requires a new field. First, the configuration field is duplicated. Then it's renamed and given a proper value. Now there are two bad configuration fields.

* There are two bad functions -- each of them containing a hardcoded field (`fieldX`), that should be parameterized. The two functions should actually be a single function. New functionality is needed, but with a different `fieldX`. First, a copy of one of the functions is made. Then the hardcoded `fieldX` is changed to the necessary new value. Now there are three bad functions.[^1]








Even if you've been as organized as can be, business requirements change and suddenly your code organization is wrong. A good codebase can turn bad fast when people try to retain their original code model in the face of a changing real-world model. Changes become harder and harder, the code becomes more and more complicated, and you end up with a big ball of mud.

I suspect this is especially likely to happen when the original architects of the system are long gone. They knew why the system was structured the way it was and would have been able to recognize when the requirements evolved to the point where that design stopped making sense. But subsequent maintainers don't have that picture and either are afraid to make large structural changes or they don't know where the inflection points are that allow adaptation.


https://news.ycombinator.com/item?id=33059910



[^1]: There's the opposite problem, of course. There's a super flexible function that receives multiple parameters and handles a variety of use cases. One day, one of those use cases changes completely. The function should be broken into two, to reflect the separate concerns. But more often than not, the original structure of the code is kept. And so the function grows in complexity to handle a business requirement that shouldn't be its responsibility.


[good description]: 2020-09-14-writing-good-test-descriptions.md
[Kent Beck]: https://twitter.com/KentBeck/status/250733358307500032
