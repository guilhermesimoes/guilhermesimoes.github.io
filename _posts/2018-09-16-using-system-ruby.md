---
layout: post
title:  "Using System Ruby"
subtitle: "Use the Ruby you already have, not rvm or rbenv"
date:     2018-09-16 15:35:53 +0100
---
I got a new computer for my new job in which, sadly, I won't have to use Ruby.
Still, I'd like to dabble with some Ruby in my spare time. Maybe I want to improve my Jekyll site or tweak some Sass library.
Even though [others] [want] [to] [disuade] me from using the Ruby that comes pre-installed with my operating system, I WANT TO USE THE ONE I ALREADY HAVE, DAMMIT!

[others]: https://robots.thoughtbot.com/psa-do-not-use-system-ruby
[want]: https://medium.com/@jules2689/homebrew-ruby-and-gems-78d6c26b89e
[to]: https://cbednarski.com/articles/installing-ruby/
[disuade]: https://chrisherring.co/posts/why-you-shouldn-t-use-the-system-ruby

Why should I have to install a Ruby version manager to install the latest Ruby when I already have a perfectly fine Ruby right here?

I'm going to use _this_ Ruby, install my gems and go on my merry way:
```terminal
$ gem install bundler
ERROR:  While executing gem ... (Gem::FilePermissionError)
    You don't have write permissions for the /Library/Ruby/Gems/2.3.0 directory.
```
Uh-oh. Guess I'll need to do some detective work. First I have to understand how this Ruby environment is set up:
```terminal
$ gem env
RubyGems Environment:
  - RUBYGEMS VERSION: 2.5.2
  - RUBY VERSION: 2.3.3 (2016-11-21 patchlevel 222) [universal.x86_64-darwin17]
  - INSTALLATION DIRECTORY: /Library/Ruby/Gems/2.3.0
  - USER INSTALLATION DIRECTORY: ~/.gem/ruby/2.3.0
  - RUBY EXECUTABLE: /System/Library/Frameworks/Ruby.framework/Versions/2.3/usr/bin/ruby
  - EXECUTABLE DIRECTORY: /usr/local/bin
  - SPEC CACHE DIRECTORY: ~/.gem/specs
  - SYSTEM CONFIGURATION DIRECTORY: /Library/Ruby/Site
  - RUBYGEMS PLATFORMS:
    - ruby
    - universal-darwin-17
  - GEM PATHS:
     - /Library/Ruby/Gems/2.3.0
     - ~/.gem/ruby/2.3.0
     - /System/Library/Frameworks/Ruby.framework/Versions/2.3/usr/lib/ruby/gems/2.3.0
  - GEM CONFIGURATION:
     - :update_sources => true
     - :verbose => true
     - :backtrace => false
     - :bulk_threshold => 1000
  - REMOTE SOURCES:
     - https://rubygems.org/
  - SHELL PATH:
     - ~/.gem/ruby/2.3.0/bin
     - /usr/local/bin
     - /usr/bin
     - /bin
     - /usr/sbin
     - /sbin
     - /usr/local/MacGPG2/bin
```
Lots of interesting information here. The lines most relevant to my current predicament are these:
```
INSTALLATION DIRECTORY: /Library/Ruby/Gems/2.3.0
USER INSTALLATION DIRECTORY: ~/.gem/ruby/2.3.0
```
The error said that I can't write to the `INSTALLATION DIRECTORY`. But with the [`--user-install` flag] I could try writing to the `USER INSTALLATION DIRECTORY`! Since it's inside the home directory ([`~`]) I should have the necessary write permissions:
```terminal
$ gem install bundler --user-install
WARNING:  You don't have ~/.gem/ruby/2.3.0/bin in your PATH,
          gem executables will not run.
Successfully installed bundler-1.16.2
Parsing documentation for bundler-1.16.2
Installing ri documentation for bundler-1.16.2
Done installing documentation for bundler after 25 seconds
1 gem installed
```
It works! There's some kind of warning but I'll ignore it for now and try my new command:
```terminal
$ bundle --version
bundle: command not found
```
Uh-oh. The warning was right, gem executables will not run this way.

To fix this I need to add the `USER INSTALLATION DIRECTORY` to the [`$PATH`]. While there are many ways to [add a directory to the `$PATH`], one solution is to create a `.profile` dotfile in the home directory with the following content:
```
export PATH=~/.gem/ruby/2.3.0/bin:$PATH
```
After [reloading the `.profile`] for the changes to take effect I can retry the previous command:
```terminal
$ bundle --version
Bundler version 1.16.2
```
It works!

Now, I don't want to have to specify the `--user-install` flag every time I install a gem.
Also, since it took so long to install the gem's documentation I want to skip that step as well.

Fortunately both problems can be solved by creating a [`.gemrc` dotfile] in the home directory with the following content:
```
gem: --user-install --no-document
```
Retrying the previous command, this time without the flag:
```terminal
$ gem install bundler
Successfully installed bundler-1.16.2
1 gem installed
```
And it works!

[`--user-install` flag]: https://guides.rubygems.org/command-reference/#gem-install
[`~`]: https://unix.stackexchange.com/questions/34196/why-was-chosen-to-represent-the-home-directory/34198#34198
[`$PATH`]: https://alistapart.com/article/the-path-to-enlightenment
[add a directory to the `$PATH`]: https://guides.rubygems.org/faqs/#user-install
[reloading the `.profile`]: https://askubuntu.com/questions/59126/reload-bashs-profile-without-logging-out-and-back-in-again/59127#59127
[`.gemrc` dotfile]: https://guides.rubygems.org/command-reference/#gem-environment

---

Admittedly, this took way longer to research, understand and fix than I was expecting.

But the gains are obvious:

1. I didn't have to download a third party's solution to manage multiple Ruby versions.
2. I now better understand how all this works.
3. Now YOU better understand how all this works.

---

Points worthy of note:

* Some operating systems (like Arch Linux) [prefer installing gems in the user directory over the system-wide directory]. In these systems the [`--user-install` flag] is unnecessary since it's the default. In fact, if we really want to install gems in the system-wide directory of these systems we have to use the opposite flag, `--no-user-install`.

* The [`gem env`] command returns a bunch of `GEM PATHS` where gems are installed. It's interesting to check these directories and see the gems that come pre-installed with the OS. My MacBook Pro came with these:

  ```terminal
  $ ls -1 /Library/Ruby/Gems/2.3.0/gems
  did_you_mean-1.0.0
  minitest-5.8.5
  net-telnet-0.1.1
  power_assert-0.2.6
  rake-10.4.2
  rdoc-4.2.1
  test-unit-3.1.5

  $ ls -1 /System/Library/Frameworks/Ruby.framework/Versions/2.3/usr/lib/ruby/gems/2.3.0/gems
  CFPropertyList-2.2.8
  libxml-ruby-2.9.0
  nokogiri-1.5.6
  sqlite3-1.3.11
  ```

* RubyGems gives access to the [`Gem` module]. Instead of using the [`gem env`] command we can call methods from this module to obtain more fine-grained information. For example, `Gem.default_dir` returns the `INSTALLATION DIRECTORY` and `Gem.user_dir` returns the `USER_INSTALLATION DIRECTORY`. These can be useful in scripting:

  ```diff
  - export PATH=~/.gem/ruby/2.3.0/bin:$PATH
  + export PATH="$(ruby -e 'puts Gem.user_dir')/bin:$PATH"
  ```

* Bundler tries to solve some of RubyGems' shortcomings. This means that it has its own ideas of where gems should be installed. Depending on your system the `bundle install` command may work right away... or not at all. We'll explore how to fix this in a future post.

[prefer installing gems in the user directory over the system-wide directory]: https://wiki.archlinux.org/index.php/ruby#Installing_gems_per-user_or_system-wide
[`gem env`]: https://guides.rubygems.org/command-reference/#gem-environment
[`Gem` module]: https://www.rubydoc.info/github/rubygems/rubygems/Gem
