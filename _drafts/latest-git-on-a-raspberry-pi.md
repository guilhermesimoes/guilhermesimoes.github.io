---
layout:   post
title:    "Latest Git on a Raspberry Pi"
---

```bash
$ cat /etc/debian_version
9.4
```

Mapping between Debian version and Ubuntu version.

Debian name | Debian version | Ubuntu name | Ubuntu version
----------- | -------------- | ----------- | --------------
buster      | 10             | bionic      |  18.04
stretch     | 9              | artful      |  17.10
"           |                | zesty       |  17.04
"           |                | yakkety     |  16.10
"           |                | xenial      |  16.04
jessie      | 8              | wily        |  15.10
"           |                | vivid       |  15.04
"           |                | utopic      |  14.10
"           |                | trusty      |  14.04
wheezy      | 7              | saucy       |  13.10
"           |                | raring      |  13.04
"           |                | quantal     |  12.10
"           |                | precise     |  12.04
"           |                | oneiric     |  11.10
squeeze     | 6              | natty       |  11.04
"           |                | maverick    |  10.10
"           |                | lucid       |  10.04


https://raspberrypi.stackexchange.com/questions/44622/how-to-add-ppa-entries-manually-on-raspberry-pi
https://launchpad.net/~git-core/+archive/ubuntu/ppa

Click "Technical details about this PPA"

Signing key
Follow link
Click "pub" key

Something like KEY_URL = https://keyserver.ubuntu.com/pks/lookup?op=get&search=0xA1715D88E1DF1F24

```
$ sudo wget -O - "KEY_URL" | sudo apt-key add -
$ sudo apt-get update
$ sudo apt-get install git-core
```
