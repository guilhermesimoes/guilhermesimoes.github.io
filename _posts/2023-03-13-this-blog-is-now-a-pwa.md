---
layout:   post
title:    "This blog is now a Progressive Web App!"
subtitle: "It's not really an App, but it's certainly Progressive Web!"
date:     2023-03-13 19:43:56 +0000
image:
  hero:   true
  path:   /assets/images/offline-dinosaur.png
  alt:    "The lonely T-Rex, the dinosaur from the Google Chrome game. This game starts when a user is offline and attempts to navigate to a web page on Google Chrome."
---

Now, [PWA is a marketing term]. But generally, a PWA consists of:

1. HTTPS,
2. A web app manifest, and
2. A service worker

This blog has all 3! To be honest, I'm not doing much with all this stuff. [HTTPS is super important for security], even if this is a static site. But this is all courtesy of GitHub, I didn't do anything.

The web app manifest allows this site to be installable on Windows and iOS and Android but 1. [it's hard to install] and 2. it's not that useful so I doubt anyone will make use of it.

The [service worker]... Now that is a different beast. It's allowed me to add [offline support] to this site, which is pretty cool. Not super high impact but I do hope my offline page brings some joy to anyone who bumps into it.

---

One neat trick I came up with was to add the following snippet at the end of the offline page:

```html
<script>
  addEventListener('online', () => location.reload());
</script>
```

If suddenly the device connects to the network it automatically reloads the page! From my testing this did not always work on mobile though. This might be because [being connected to a network is not the same as being online]. Maybe if I added a timeout the experience would be better? From my limited testing this current solution is already slower than refreshing the page so a timeout would only make the waiting worse. It's likely there's a better way to do this.

---

I did hit this snag when using [`cache.addAll`] to cache my offline page. It does cache everything correctly. But when the user is offline and tries to navigate somewhere and the worker returns the offline page this error occurs:

> The FetchEvent for "http://page-the-user-was-trying-to-access"
> resulted in a network error response: a redirected response was
> used for a request whose redirect mode is not "follow".

Apparently this is due to a [new security restriction] but I don't get it. It all seems so cryptic to me. [StackOverflow came to my rescue] though. So now I'm just calling `fetch` for each of the pages that I want to cache. All tutorials that I saw did use [`cache.addAll`] so either I'm doing something wrong or they're already out of date. If you bump into the same problem now you know!

---

All in all it was a great learning opportunity. There's not a lot of code but pretty much every single line of code lead me to learn something new. Now that I look at the final solution, it doesn't seem like it was hard at all!

<div class="block-source">
  {% highlight js linenos %}
    {%- root_include /service-worker.js -%}
  {% endhighlight %}
</div>

[PWA is a marketing term]: https://adactio.com/journal/13098
[HTTPS is super important for security]: https://www.troyhunt.com/heres-why-your-static-website-needs-https/
[it's hard to install]: https://adactio.com/journal/18772
[service worker]: https://web.dev/service-worker-lifecycle/
[offline support]: https://hacks.mozilla.org/2015/11/offline-service-workers/
[being connected to a network is not the same as being online]: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
[`cache.addAll`]: https://developer.mozilla.org/en-US/docs/Web/API/Cache/addAll
[new security restriction]: https://bugs.chromium.org/p/chromium/issues/detail?id=669363
[StackOverflow came to my rescue]: https://stackoverflow.com/questions/51158687/service-worker-w-offline-html-backup-page/51162311#51162311
