---
layout:   post
title:    "The most important ESLint rule if you're using TypeScript"
date:     2023-07-20 18:48:45 +0000
---

It may seem like changing obj.prop to obj?.prop isn’t that big a deal. In terms of code that actually runs on the device, the change is actually from obj.prop to obj === null || obj === void 0 ? void 0 : obj.prop. We want smaller bundles and less code to run, not more.
If you know that something may be undefined / null but the type does not say that, then that means that the type is wrong! Fix the type! Then you can use your condition. The advantage of fixing the type is that not only do we get actual type safety (instead of you knowing that the type is undefined / null) but then other people also get to use correct types.


if you declare that something is required / mandatory / is initialized and then write code accordingly but that something really is optional or is not initialized, the code is going to blow up
that’s why our types must match reality

that rule is super important and it’s what guarantees that our types match reality



without that rule, here’s what would happen:
interface SomeBackendResponse {
  // this is wrong, the backend sometimes may not return `foo`, so it's really optional
  foo: {
    bar: string
  }
}

// somewhere in the code
logic1(response.foo.bar);

// somewhere else in the code
logic2(response.foo.bar);
an INC occurs because logic1 sometimes breaks. The person that goes on to fix it does this:
// somewhere in the code
if (response.foo) {
  logic1(response.foo.bar);
}

// somewhere else in the code
logic2(response.foo.bar);
later, another INC occurs at logic2


with no-unnecessary-condition, if someone knows that a property is optional, and wants to validate it at runtime, they need to change the type to make it optional, and that will force other parts of the code to deal with that optionality



https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/docs/rules/no-unnecessary-condition.md
