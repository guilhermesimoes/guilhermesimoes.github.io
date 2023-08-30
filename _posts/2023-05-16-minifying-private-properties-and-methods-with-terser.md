---
layout:   post
title:    "Minifying private properties and methods with Terser"
date:     2023-05-17 23:22:19 +0100
image:
  hero:   true
  path:   /assets/images/giraffes.png
  alt:    "Drawing of two giraffes, a large one – an adult – and a tinier version – a child."
---

[As we saw last time], minifiers / compressors such as [Terser] do not minify class properties and methods. If a class has lots of properties and methods, their names can make quite the difference in the total size of an app bundle. In the following example:

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

Neither `chirp` nor `_parseJson` nor `_options` are minified. We don't want to minify `chirp` because it's part of our public API. But we do want to minify the parts that we consider private. [Using TypeScript] we can mark them as such:

```ts
class Chirpy {
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

Then, using a TypeScript transformer like [ts-transformer-minify-privates], we can prefix them with `_private_`. `options` is thus renamed to `_private_options` and `parseJson` to `_private_parseJson`. Finally, we can configure Terser to minify all properties (and methods) with that prefix:

```js
mangle: {
  properties: {
    regex: /^_private_/,
  }
}
```

And that's it!

---

Or is it? Turns out, this kind of minification carries a high degree of risk. As per [Terser's documentation]:

> THIS WILL BREAK YOUR CODE. A good rule of thumb is not to use this unless you know exactly what you're doing. You should:
> 1. Control all the code you're mangling
> 2. Avoid using a module bundler, as they usually will call Terser on each file individually, making it impossible to pass mangled objects between modules.
> 3. Avoid calling functions like defineProperty or hasOwnProperty, because they refer to object properties using strings and will break your code if you don't know what you are doing.

This kind of minification is dangerous, which is why it isn't enabled by default.

But there's a couple of things we can do to be extra-safe:

1. We can use `{ nameCache: {} }` to cache mangled variable and property names across multiple invocations of Terser's `minify`.[^1]






Here's some of the stuff you can do to fix these issues.



We can fix this by guaranteeing that property and method names are minified consistently across files.


Also, since Terser operates at the file level, it doesn't even know what class extending another class means. There's no garantee that a minified property won't clobber a property from the parent. For instance, here:

Minifiers operate at the file level, they are unware of the dynamic nature of JavaScript.

This outcome is grim.

So while minifying private properties and methods _is_ possible, a lot can definitely go wrong.

If you can avoid classes, you should do so.



[As we saw last time]: 2023-05-16-service-class-vs-service-module.md
[Terser]: https://try.terser.org/
[Using TypeScript]: https://www.typescriptlang.org/docs/handbook/2/classes.html#private
[ts-transformer-minify-privates]: https://github.com/timocov/ts-transformer-minify-privates
[Terser's documentation]: https://terser.org/docs/cli-usage/#cli-mangling-property-names---mangle-props

https://lihautan.com/reduce-minified-code-size-by-property-mangling/
https://cube.dev/blog/how-to-build-tree-shakeable-javascript-libraries
https://blog.theodo.com/2021/04/library-tree-shaking/

[^1]: Like Timokhov’s [ts-transformer-minify-privates] and [ts-transformer-properties-rename], for example.
(and if we're using Webpack's TerserPlugin we'll have to set `parallel: false` for now).
