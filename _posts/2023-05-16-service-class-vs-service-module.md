---
layout:   post
title:    "Service Class vs Service Module"
subtitle: "One is heavy, the other is light."
date:     2023-05-16 23:22:19 +0100
image:
  hero:   true
  path:   /assets/images/heavy-vs-light.png
  alt:    "Drawing of two objects side by side: a dumbbell and a feather. One is heavy, the other is light."
---

This is just a quick post to get this out of my system. I will further explore this subject in a follow-up post.

This is a very simple service class:

```js
export class Chirpy {
  constructor(options) {
    this.options = options;
  }

  chirp(message) {
    return fetch(`${this.options.endpoint}/chirp`, {
      method: 'POST',
      body: JSON.stringify(message),
    })
    .then(this._parseJson);
  }

  rechirp(messageId) {
    return fetch(`${this.options.endpoint}/rechirp`, {
      method: 'POST',
      body: messageId,
    })
    .then(this._parseJson);
  }

  reverseChirp(messageId) {
    return fetch(`${this.options.endpoint}/chirp/${messageId}`, {
      method: 'DELETE',
    })
    .then(this._parseJson);
  }

  _parseJson(response) {
    return response.json();
  }
}

const client = new Chirpy({
  apiKey: 'xyz',
  endpoint: 'example.com',
});

client.chirp('hello world');
```

This service has a size of 737 bytes.

Going through the [terser] minifier[^1] we get this:

```js
export class Chirpy{constructor(e){this.options=e}chirp(e){return fetch(`${this.options.endpoint}/chirp`,{method:"POST",body:JSON.stringify(e)}).then(this._parseJson)}rechirp(e){return fetch(`${this.options.endpoint}/rechirp`,{method:"POST",body:e}).then(this._parseJson)}reverseChirp(e){return fetch(`${this.options.endpoint}/chirp/${e}`,{method:"DELETE"}).then(this._parseJson)}_parseJson(e){return e.json()}}new Chirpy({apiKey:"xyz",endpoint:"example.com"}).chirp("hello world");
```
{: .wrap-code}

It's now reduced to 482 bytes. 255 bytes fewer. A 34.6% reduction.

It's worth pointing out the things that do not get minified:

* Strings: `"POST"`, `"DELETE"`, `"xyz"`, `"example.com"`, `"hello world"`

* Object keys: `method`, `apiKey`, `endpoint`

* Standard built-in objects like `JSON` and native functions like `fetch`

* Native keywords / operators: `export`, `class`, `new`, `this`

* Object / Class properties and methods: `then`, `stringify`, `options`, `constructor`, `chirp`, `rechirp`, `reverseChirp`, `_parseJson`

This last point is important as we'll see later.

Let's now look at the same service implemented as a module:

```js
let options;

export function initialiseChirpy(opts) {
  options = opts;
}

export function chirp(message) {
  return fetch(`${options.endpoint}/chirp`, {
    method: 'POST',
    body: JSON.stringify(message),
  })
  .then(parseJson);
}

export function rechirp(messageId) {
  return fetch(`${options.endpoint}/rechirp`, {
    method: 'POST',
    body: messageId,
  })
  .then(parseJson);
}

export function reverseChirp(messageId) {
  return fetch(`${options.endpoint}/chirp/${messageId}`, {
    method: 'DELETE',
  })
  .then(parseJson);
}

function parseJson(response) {
  return response.json();
}

initialiseChirpy({
  apiKey: 'xyz',
  endpoint: 'example.com',
});

chirp('hello world');
```

Very similar to the class-based approach. And equal in terms of functionality, except it won't let you instantiate two different versions of the service.

This module has a size of 692 bytes, a tad smaller than the class's 737 bytes. Let's see what happens when we pass it through terser:

```js
let e;export function initialiseChirpy(t){e=t}export function chirp(i){return fetch(`${e.endpoint}/chirp`,{method:"POST",body:JSON.stringify(i)}).then(t)}export function rechirp(i){return fetch(`${e.endpoint}/rechirp`,{method:"POST",body:i}).then(t)}export function reverseChirp(i){return fetch(`${e.endpoint}/chirp/${i}`,{method:"DELETE"}).then(t)}function t(e){return e.json()}initialiseChirpy({apiKey:"xyz",endpoint:"example.com"}),chirp("hello world");
```
{: .wrap-code}

It's now reduced to 456 bytes. 236 bytes fewer. A 34.1% reduction, similar to the size reduction of the service class. So it seems like there's not that much of a difference between both approaches.

But notice that:

* The variable `options` was minified to `e`

* The "private" function `parseJson` was minified to `t`

When these were class properties / methods they weren't minified.[^2] If your service classes have lots of properties and private methods that could make quite the difference.

---

Any self-respectable bundler will tree-shake any unused exports. That's the two unused functions -- `rechirp` and `reverseChirp`. By tree-shaking the service module we get this:

```js
let i;export function initialiseChirpy(n){i=n}export function chirp(e){return fetch(`${i.endpoint}/chirp`,{method:"POST",body:JSON.stringify(e)}).then(n)}function n(i){return i.json()}initialiseChirpy({apiKey:"xyz",endpoint:"example.com"}),chirp("hello world");
```
{: .wrap-code}

It's now reduced to 261 bytes. 431 bytes fewer than the initial 692 bytes. A 62.3% reduction.

Let's encapsulate what we learned in a table format:

| size / service | Class  | Module  |
|:---------------|-------:|--------:|
| initial        |  737 B |   692 B |
| minified       |  482 B |   456 B |
| tree-shaked\*  |  482 B |   261 B |
{: .post-table .simple-centered-h }

\*Assuming only one method / function of the service is used

I plan to make a more compelling argument in a follow-up post. But I hope this is enough to at least make you think about your own services.

[^1]: I used the [terser] minifier because its [REPL] is very easy to use and shows the total size of the code.

[^2]: There _are_ ways to minify private properties and methods (see Timokhov's [ts-transformer-minify-privates] and [ts-transformer-properties-rename], for example). But they are [fraught with peril].

[terser]: https://terser.org/
[REPL]: https://try.terser.org/
[ts-transformer-minify-privates]: https://github.com/timocov/ts-transformer-minify-privates
[ts-transformer-properties-rename]: https://github.com/timocov/ts-transformer-properties-rename
[fraught with peril]: 2025-06-23-minifying-private-properties-and-methods-with-terser.md
