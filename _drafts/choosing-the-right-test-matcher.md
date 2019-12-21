---
layout:   post
title:    "Choosing the right test matcher"
---

https://jestjs.io/docs/en/using-matchers
https://www.cypress.io/blog/2017/07/26/good-error-messages/

```
expect(getAllFlavors().includes('lime')).toBe(true);
```
vs
```
expect(getAllFlavors()).toContain('lime');
```
---
```
expect(/stop/.test('Christoph')).toBe(true)
```
vs
```
expect('Christoph').toMatch(/stop/);
```
