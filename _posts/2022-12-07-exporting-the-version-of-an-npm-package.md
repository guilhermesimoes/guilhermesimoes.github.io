---
layout:   post
title:    "Exporting the Version of an NPM package"
subtitle: "Avoid importing directly from package.json!"
date:     2022-12-18 14:25:14 +0000
image:
  hero:   true
  path:   /assets/images/npm-package.png
  alt:    "Drawing of a mail package, with a 'this side up' arrow and a label with the text 'v1.0.0' on one side."
---

We have a JavaScript package with this folder structure:

```
my-package
├── package.json
└── src
    ├── index.ts
    ├── ...
    └── version.ts
```

Our `package.json` contains this information:

```json
{
  "name": "my-package",
  "version": "1.0.0"
}
```

And we want to `export` our package version so that consumers of our package can `import` it and do stuff with it, like include it in their analytics, etc.

A first approach would be this:

```ts
// src/version.ts
export const version = '1.0.0';
```

But obviously we don't want to maintain two separate files. A developer could change the `package.json` and forget to change this file or vice versa.

The next approach would be this:

```ts
// src/version.ts
export { version } from '../package.json';
```

But this has the potential to be terrible from a security perspective! Depending on the bundler we use we can end up with this transpiled code:

```js
// dist/version.js
e.exports=JSON.parse('{"name":"my-package","version":"1.0.0",
"main":"dist/index.js","scripts":"...","dependencies":"..."}');
```

Notice how we're exposing our _entire_ `package.json`, scripts and dependencies included, to the outside world. This not only increases the bundle size of our application but it also makes us more vulnerable to [supply chain attacks through typosquatting] and other means.

There are ways to make this work safely[^1], but relying on a bundler's tree-shaking to hide sensitive data is just asking to get burned. We should always double-check (or test) the final transpilated code to make sure we're not making this blunder.

An alternate and simple approach is to use an [npm hook] to run a command before our `build` script:

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "scripts": {
    "prebuild": "echo \"export const version = '$npm_package_version';\" > ./src/version.ts",
    "build": "..."
  }
}
```

Now when we run the `build` command npm runs the `prebuild` command which updates the `version.ts` file. Neat!

---

Unfortunately this does not work on Windows. To support all OSes we need something a little more complicated:

```js
// scripts/generate-version.js
#!/usr/bin/env node

const fs = require('fs');

const content = `export const version = '${process.env.npm_package_version}';\n`
fs.writeFileSync('./src/version.ts', content);
```

And finally change the npm hook:

```json
"prebuild": "node ./scripts/generate-version.js"
```

Not as cool as the one-liner but still easy to understand and gets the job done! And no need for external dependencies!

[^1]: TypeScript's compiler `tsc` + [resolveJsonModule] is one such way.

[supply chain attacks through typosquatting]: https://thehackernews.com/2022/03/over-200-malicious-npm-packages-caught.html
[npm hook]: https://docs.npmjs.com/cli/v9/using-npm/scripts#pre--post-scripts
[resolveJsonModule]: https://www.typescriptlang.org/tsconfig#resolveJsonModule
