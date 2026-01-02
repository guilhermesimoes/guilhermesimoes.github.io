---
layout:   post
title:    "Writing Good Test Descriptions"
subtitle: "TL;DR test descriptions should form full sentences!"
date:     2020-09-14 13:59:09 +0100
image:
  hero:   true
  path:   /assets/images/watch-underwater.png
  alt:    "Drawing of a watch underwater, surrounded by fish."
hidden:   true
tags:
  - Testing
  - Code Quality
  - JavaScript
---

Anyone can write a decent test description. But by paying attention to this little detail you can write _great_ test descriptions:

_Block descriptions should start with a word that forms a **readable sentence** in conjunction with the block function name._

That's it! It doesn't matter if you're using JavaScript, Ruby or any other language. Test descriptions that can be read as plain English are _better_ than test descriptions that cannot.

But what does this really mean in practice? Let's find out.

### describe

`describe` defines the subject under test:

```js
describe('Watch', () => {
  // ...
});
```

Here we are testing the `Watch` class.

`describe` should be followed by the class, function or object that we want to test.

### it

`it` lays out the test case — the behaviour and outcome we expect. But linguistically, `it` refers to the actual thing we are testing:

```js
describe('Watch', () => {
  it('should tell the time', () => {
    // ...
  });
});
```

We are meant to read the test description as if it were a sentence.

> It should tell the time.

or

> The watch should tell the time.

That is why `it` should be followed by the words "should" or "must".

An alternative is to write test descriptions in the present tense:

```js
describe('Watch', () => {
  it('tells the time', () => {
    // ...
  });
});
```

This still works as a sentence:

> It tells the time.

or

> The watch tells the time.

### context

`context` groups tests that are made under the same circumstances:

```js
describe('Watch', () => {
  context('when under water', () => {
    beforeEach(() => {
      placeWatchUnderWater(); // setup common to all tests inside this context
    });

    it('should still tell the time', () => { // it's a diver's watch!
      // ...
    });

    it('should measure depth', () => {
      // ...
    });
  });
});
```

Once again we are meant to read the test description as if it were a sentence.

> When under water, it should still tell the time.

or

> The watch, when under water, should still tell the time.

That is why `context` should be followed by the words "when", "with", "without" or "if".

By adopting this simple guideline you can make your test descriptions easier to read and comprehend.

---

An added bonus is that many testing frameworks can be configured to output their results in a [BDD] format.

For example, using [Mocha's spec reporter], when all the tests pass:

```terminal
$ npx mocha watch.spec.js
Watch
  ✓ should tell the time
  when under water
    ✓ should still tell the time
    ✓ should measure depth

3 passing (4ms)
```

And when some tests fail:

```terminal
$ npx mocha watch.spec.js
Watch
  ✓ should tell the time
  when under water
    1) should still tell the time
    2) should measure depth


1 passing (6ms)
2 failing

1) Watch
     when under water
       should still tell the time:

    AssertionError: expected '12:00' to equal '0'

2) Watch
     when under water
       should measure depth:

    AssertionError: expected 10 to equal 0

npm ERR! Test failed.  See above for more details.
```

Notice how the test descriptions can be read as full sentences. We can immediately tell what went wrong.

It's not a diver's watch after all!


[rspec's format option]: https://relishapp.com/rspec/rspec-core/v/2-6/docs/command-line/format-option
[BDD]: https://en.wikipedia.org/wiki/Behavior-driven_development#Behavioral_specifications
[rubocop-rspec]: https://github.com/rubocop-hq/rubocop-rspec
[Mocha's spec reporter]: https://mochajs.org/#spec

<script type="text/javascript">
  if (location.pathname.includes('writing-good-test-descriptions-js')) {
    self.location = "writing-good-test-descriptions?js"
  }
</script>
