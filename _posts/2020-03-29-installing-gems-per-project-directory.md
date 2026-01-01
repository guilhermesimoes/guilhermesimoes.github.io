---
layout:   post
title:    "Installing Gems per Project Directory"
subtitle: "Bundler can install gems in a project directory, just like NPM installs modules locally."
date:     2020-03-29 03:39:57 +0100
image:
  hero:   true
  path:   /assets/images/ruby-dresser.png
  alt:    "Drawing of a dresser with its drawers open, with rubies inside, compartmentalized."
tags:
  - Ruby
---

When Bundler complains about “not being allowed to install to the system RubyGems” we have two solutions:

1. [Configure Bundler to install gems in the user directory], where we have write permissions; or

2. Configure Bundler to install gems in the project directory, just like NPM installs modules locally.

Let's explore solution 2 this time.

Inside a project directory, we can check if gems are being installed locally:

```terminal
$ bundle config path
Settings for `path` in order of priority. The top value will be used
You have not configured a value for `path`
```

Here we can see that no `path` is configured. This means gems are installed in the default directory, according to [`$BUNDLE_PATH` and `$GEM_HOME`].

Let's configure this `path` then:

```terminal
$ bundle config path 'vendor/bundle' --local
```

This creates a `.bundle` folder with a single file named `config` inside.
Its contents are the following:

```markdown
---
BUNDLE_PATH: "vendor/bundle"
```

Now, when the run:

```terminal
$ bundle config path
Settings for `path` in order of priority. The top value will be used
Set for your local app (~/Projects/guilhermesimoes.github.io/.bundle/config): "vendor/bundle"
```

We can see that a `path` is configured. This makes it so that `bundle install` installs gems in the `vendor/bundle` folder.

Let's try it:

```terminal
$ bundle install
...
Fetching jekyll 3.7.0
Installing jekyll 3.7.0
...
Bundle complete! 4 Gemfile dependencies, 28 gems now installed.
Bundled gems are installed into `./vendor/bundle`
```

That's it! Done!

---

Points worthy of note:

* I recommend adding whatever you configure as your `path` (in this case `vendor/bundle`) to your [`.gitignore`] so that your gems are untracked by Git.

* `bundle install` can also receive a [`path` flag] but this is not remembered in subsequent commands.

* `bundle install` can also receive a [`deployment` flag] which does a bunch of funky things including changing where the gems are installed.


[Configure Bundler to install gems in the user directory]: 2019-12-15-using-bundler-with-system-ruby.md
[`$BUNDLE_PATH` and `$GEM_HOME`]: https://bundler.io/v2.0/bundle_install.html
[`.gitignore`]: https://git-scm.com/docs/gitignore
[`path` flag]: https://bundler.io/v2.0/man/bundle-config.1.html#REMEMBERING-OPTIONS
[`deployment` flag]: https://bundler.io/v2.0/man/bundle-install.1.html#DEPLOYMENT-MODE
