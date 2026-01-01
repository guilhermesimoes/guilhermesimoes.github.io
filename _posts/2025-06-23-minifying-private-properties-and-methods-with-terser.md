---
layout:   post
title:    "Minifying private properties and methods with Terser"
date:     2025-06-23 20:29:12 +0100
image:
  hero:   true
  path:   /assets/images/giraffes.png
  alt:    "Drawing of two giraffes, a large one – an adult – and a tinier version – a child."
tags:
  - Perf
  - TypeScript
---

[As we saw last time], minifiers / compressors such as [Terser] do not minify class properties and methods by default. If a class has lots of properties and methods, their names can make quite the difference in the total size of an application. In the following example:

```js
export class Chirpy {
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

Neither `chirp` nor `_parseJson` nor `_options` are minified. We don't want to minify `chirp` because it's part of our public API. But we do want to minify the parts that we consider private. [Using TypeScript] we can mark them as such:

```ts
export class Chirpy {
  private options: ChirpyOptions;

  constructor(options: ChirpyOptions) {
    this.options = options;
  }

  public chirp(message: string) {
    return fetch(`${this.options.endpoint}/chirp`, {
      method: 'POST',
      body: JSON.stringify(message),
    })
    .then(this.parseJson);
  }

  private parseJson(response) {
    return response.json();
  }
}
```

Then, using a TypeScript transformer like [ts-transformer-minify-privates], we can prefix them with `_private_`. `options` is thus renamed to `_private_options` and `parseJson` to `_private_parseJson`. Next, we can configure Terser to minify all properties (and methods) with that prefix:

```js
mangle: {
  properties: {
    regex: /^_private_/,
  }
}
```

This is the final result (whitespace added in order to improve readibility):

```js
export class Chirpy {
  constructor(r) {
    this.t=r
  }

  chirp(r) {
    return fetch(`${this.t.endpoint}/chirp`, {
      method: 'POST',
      body: JSON.stringify(r)
    })
    .then(this.h)
  }

  h(r) {
    return r.json()
  }
}
```

Easy!

---

Or is it? Turns out, this kind of minification is dangerous, which is why it is not enabled by default. [Terser's documentation] even shouts at us:

> THIS WILL BREAK YOUR CODE. A good rule of thumb is not to use this unless you know exactly what you're doing. You should:
> 1. Control all the code you're mangling
> 2. Avoid using a module bundler, as they usually will call Terser on each file individually, making it impossible to pass mangled objects between modules.
> 3. Avoid calling functions like defineProperty or hasOwnProperty, because they refer to object properties using strings and will break your code if you don't know what you are doing.

For example, when a class extends another:

```ts
class A {
  private prop1: number;

  constructor() {
    this.prop1 = 1;
  }
}

class B extends A {
  private prop2: number;

  constructor() {
    super();
    this.prop2 = 2;
  }
}
```

Terser could minify both `prop1` and `prop2` to a single letter property like `a`. So at runtime `prop2` would override the value of `prop1`.

Our class `A` could also already have a single letter property like `a` and the minification of `prop2` to `a` would also override it.

So, how can we minify things responsibly? Well, in addition to Terser's recommendations, I would suggest:

1. Use Terser's [`nameCache`] to cache mangled variable names and property names across multiple invocations of Terser's `minify`.[^1][^2]

2. Add a linter rule to prevent your source code from including very small variable names and property names. This way Terser's minified names won't clash with the source code's names.[^3]

3. Avoid minification of classes that are extended or extend other classes.

---

In the end, we can see that this type of minification has a lot of restrictions and is not easy to do. So while minifying private properties and methods _is_ possible, a lot can definitely go wrong. The best way to avoid all this work is to avoid using classes!

[^1]: Just setting `nameCache` to any empty object in Terser's config should be enough. Like so: `{ nameCache: {} }`. To persist renames across multiple builds use a file.
[^2]: Bundlers (like Webpack) and its plugins try to speed things up by running things in parallel. When using `terser-webpack-plugin`, for example, [parallelisation should be turned off] if we want mangling to be as safe as possible since currently threads / workers don't share Terser's cache.

[^3]: Here's a quick custom ESLint rule:
    ```ts
    const meta = {
      docs: { description: 'Disallow property names that may overlap with mangled names.' },
      messages: { smallProp: 'Property is too small, it may clash with terser mangler.' },
      schema: [],
      type: 'problem',
    };

    function create(context) {
      function validateName(node) {
        if (node.key.name.length < 3) {
          context.report({ messageId: 'smallProp', node });
        }
      }
      return {
        'ClassBody PropertyDefinition': validateName,
        "MethodDefinition[kind='get']": validateName,
        "MethodDefinition[kind='set']": validateName,
      };
    }

    module.exports = { create, meta };
    ```


[As we saw last time]: 2023-05-16-service-class-vs-service-module.md
[Terser]: https://try.terser.org/
[Using TypeScript]: https://www.typescriptlang.org/docs/handbook/2/classes.html#private
[ts-transformer-minify-privates]: https://github.com/timocov/ts-transformer-minify-privates
[Terser's documentation]: https://terser.org/docs/cli-usage/#cli-mangling-property-names---mangle-props
[`nameCache`]: https://terser.org/docs/api-reference/#minify-options
[parallelisation should be turned off]: https://github.com/webpack-contrib/terser-webpack-plugin/issues/256#issuecomment-1230282316
