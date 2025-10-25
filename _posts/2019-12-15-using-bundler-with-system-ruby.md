---
layout:   post
title:    "Using Bundler with System Ruby"
subtitle: "Use Bundler with the Ruby you already have."
date:     2019-12-15 14:22:13 +0100
image:
  hero:   true
  path:   /assets/images/ruby-box.png
  alt:    "Drawing of a cardboard box with a ruby label on one side."
---
[I just fixed][in using System Ruby] my system configuration so that `gem install` works. I install Bundler with `gem install bundler`. I then go to my project directory and use Bundler to install my project's dependencies:

```terminal
$ bundle
Fetching gem metadata from https://rubygems.org/...........
Following files may not be writable, so sudo is needed:
  /Library/Ruby/Gems/2.3.0
  /Library/Ruby/Gems/2.3.0/build_info
  /Library/Ruby/Gems/2.3.0/cache
  /Library/Ruby/Gems/2.3.0/doc
  /Library/Ruby/Gems/2.3.0/extensions
  /Library/Ruby/Gems/2.3.0/gems
  /Library/Ruby/Gems/2.3.0/specifications
Fetching public_suffix 3.0.3


Your user account isn't allowed to install to the system RubyGems.
  You can cancel this installation and run:

      bundle install --path vendor/bundle

  to install the gems into ./vendor/bundle/, or you can enter your password
  and install the bundled gems to RubyGems using sudo.

  Password:
```

What the?... But I had just fixed the problem!
Apparently Bundler has its own ideas about where to install gems.

It's interesting (read: completely dangerous and irresponsible) that Bundler tells me to install gems using `sudo`. It's even in [its documentation][concerning using Bundler with sudo]! And yet, Bundler places me at the password prompt! Fortunately I already know I shouldn't do this.

Bundler also suggests the `path` option to [install gems in the local folder], like `node_modules`. But let's skip this for now. Let's fix Bundler so that gems are installed in a common folder and shared between projects.

In my previous post on [using System Ruby][in using System Ruby], I used `gem env` to understand my Ruby environment. Now, I can use a similar command to understand my Bundler environment:

```terminal
$ bundle env

## Environment

Bundler       2.0.2
  Platforms   ruby, universal-darwin-17
Ruby          2.3.7p456 (2018-03-28 revision 63024) [universal.x86_64-darwin17]
  Full Path   /System/Library/Frameworks/Ruby.framework/Versions/2.3/usr/bin/ruby
  Config Dir  /Library/Ruby/Site
RubyGems      2.5.2.3
  Gem Home    /Library/Ruby/Gems/2.3.0
  Gem Path    ~/.gem/ruby/2.3.0:/Library/Ruby/Gems/2.3.0:/System/Library/Frameworks/Ruby.framework/Versions/2.3/usr/lib/ruby/gems/2.3.0
  User Path   ~/.gem/ruby/2.3.0
  Bin Dir     /usr/local/bin
Tools
  Git         2.24.1
  RVM         not installed
  rbenv       not installed
  chruby      not installed

## Bundler Build Metadata

Built At          2019-12-15
Git SHA           2760d72d3
Released Version  true

## Gemfile

Some output omitted for brevity

PLATFORMS
  ruby

BUNDLED WITH
   2.0.2
```

Lots of interesting information here. The lines most relevant to my current predicament are these:

```
Gem Home    /Library/Ruby/Gems/2.3.0
User Path   ~/.gem/ruby/2.3.0
```

Notice that these are exactly the same paths that gave me trouble previously. Once again, something is complaining that it can't write to `/Library/Ruby/`. But [as we saw last time][in using System Ruby], I have the necessary write permissions inside the home directory ([`~`]). And just like there was a way to tell Ruby to always use the user directory, there's also a way to tell Bundler the same. There are two environment variables that can be used for this effect: [`$BUNDLE_PATH` and `$GEM_HOME`]. All that I need then is to create a `.profile` dotfile in the home directory with the following content:

```
export GEM_HOME=~/.gem/ruby/2.3.0/
```

After [reloading the `.profile`] for the changes to take effect I can retry the previous command:

```terminal
$ bundle
Fetching gem metadata from https://rubygems.org/...........
Bundle complete! 4 Gemfile dependencies, 28 gems now installed.
Use `bundle info [gemname]` to see where a bundled gem is installed.
```

And it works!

---

At this point my `.profile` looks like this:

```
export GEM_HOME=~/.gem/ruby/2.3.0/
export PATH=~/.gem/ruby/2.3.0/bin:$PATH
```

The repetition can be fixed with some basic bash interpolation:

```
export GEM_HOME=~/.gem/ruby/2.3.0/
export PATH=$GEM_HOME/bin:$PATH
```

And the final solution can be made dynamic with some Ruby magic:

```
export GEM_HOME="$(ruby -e 'puts Gem.user_dir')"
export PATH="$GEM_HOME/bin:$PATH"
```


[concerning using Bundler with sudo]: https://bundler.io/v2.0/man/bundle-install.1.html#SUDO-USAGE
[install gems in the local folder]: 2020-03-29-installing-gems-per-project-directory.md
[in using System Ruby]: 2018-09-16-using-system-ruby.md
[`~`]: https://unix.stackexchange.com/questions/34196/why-was-chosen-to-represent-the-home-directory/34198#34198
[`$BUNDLE_PATH` and `$GEM_HOME`]: https://bundler.io/v2.0/bundle_install.html
[reloading the `.profile`]: https://askubuntu.com/questions/59126/reload-bashs-profile-without-logging-out-and-back-in-again/59127#59127
