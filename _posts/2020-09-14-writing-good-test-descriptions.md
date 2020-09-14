---
layout:   post
title:    "Writing Good Test Descriptions"
subtitle: "TL;DR test descriptions should form full sentences!"
date:     2020-09-14 13:59:09 +0100
image:
  path:   /assets/images/watch-underwater.png
  alt:    "Drawing of a watch underwater, surrounded by fish."
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
      placeWatchUnderWater() // setup common to all tests inside this context
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

For example, using [rspec's format option], when all the tests pass:

```terminal
$ rspec -fd watch.rb
Watch
  should tell the time
  when under water
    should still tell the time
    should measure depth

Finished in 0.00237 seconds
3 examples, 0 failures
```

And when some tests fail:

```terminal
$ rspec -fd watch.rb
Watch
  should tell the time
  when under water
    should still tell the time (FAILED - 1)
    should measure depth (FAILED - 2)

Failures:

  1) Watch when under water should still tell the time
     Failure/Error: expect(watch.time).to eq '12:00'

       expected: "12:00"
            got: "0"

       (compared using ==)

  2) Watch when under water should measure depth
     Failure/Error: expect(watch.depth).to eq 10

       expected: 10
            got: 0

       (compared using ==)

Finished in 0.02115 seconds
3 examples, 2 failures

Failed examples:

rspec ./watch.rb:22 # Watch when under water should still tell the time
rspec ./watch.rb:26 # Watch when under water should measure depth
```

Notice how the test descriptions can be read as full sentences. We can immediately tell what went wrong.

It's not a diver's watch after all!


[rspec's format option]: https://relishapp.com/rspec/rspec-core/v/2-6/docs/command-line/format-option
[BDD]: https://en.wikipedia.org/wiki/Behavior-driven_development#Behavioral_specifications
[rubocop-rspec]: https://github.com/rubocop-hq/rubocop-rspec
