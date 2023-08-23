---
layout:   post
title:    "Making code tree-shakable"
date:     2023-05-27 16:00:45 +0000
---

```ts
import * as Collection from './some-path'
```


```ts
function a () { /* ... */ }

function b () { /* ... */ }

function c () { /* ... */ }

export obj = {
  a,
  b,
  c,
}
```

instead:


```ts
export function a () { /* ... */ }

export function b () { /* ... */ }

export function c () { /* ... */ }
```

https://blog.theodo.com/2021/04/library-tree-shaking/
