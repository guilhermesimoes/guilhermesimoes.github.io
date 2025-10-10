---
layout:   post
title:    "Debugging a PS4 application"
date:     2025-10-10 16:00:45 +0000
---

[A lot can go wrong on a PlayStation]. Luckily, Sony gives developers a lot of ways to debug their applications. You can debug a PlayStation application at these levels:

{toc}

# Browser Level
If you are familiar with the developer tools in other WebKit based web browsers like Safari or Google Chrome, you should be familiar with WebMAF's remote debugger. This tool allows you to:

- Debug Javascript, HTML and CSS
- View some network requests and responses
- View occupied storage (cookies, local storage)

To debug at this level, two things are required:

- Create a package[^1] with the setting `EnableDebugger` set to `true`
- Find your PS4's IP address, which can be done on the main screen

<img src="/assets/images/ps4-ip-address.png" />

Then, connect to your PS4 by entering its IP in the URL bar of your browser, plus the port :1900.

You should now be able to debug your PS4 pretty much like any other device.

<img src="/assets/images/ps4-web-inspector.png" />

For more information, check out Sony's [Remote Web Inspector User's Guide].

# Network Level
1. Get Charles certificate
2. Create .pem file containing Charles certificate
3. Create a package[^1] with the setting `ServerCertificateFile` pointing to the .pem file
4. On a PS4 go to Settings → Network → Set Up Internet Connection → Use a LAN Cable → Custom → Keep pressing X until configuration for Proxy Server → Use → Set the Address to your PC's IP address and the Port Number to 8888
5. Open the application you wish to debug
6. On Charles enable SSL with a Sony host, otherwise the application cannot start

# C++ Level
After Installing Sony's Tools (SDK Manager)[^1], you should have access to a wide array of [Target Manager UI (TMUI) applications]. There are [several ways to open] these TMUI applications.

One of these TMUI applications, Console Output, allows you to view the C++ logs of your PS4. This is mostly useful when trying to debug PS4 crashes.

For more information, check out Sony's [Console Output Users Guide].

# User Level
When a WebMAF application crashes no JavaScript runs, which means that none of the usual JS analytics will detect and report these crashes. Luckily, Sony gathers crash reports from consumer PS4 hardware units, which can be downloaded for examination in a debugger via the Crash Reporting System (CRS). You need DevNet access to be able to use this tool.

Going through these logs is hard and you'll see a lot of [WTFs] but you'll get some clues as to what may be causing issues:

<img src="/assets/images/css-calc-crash.png" />

The CSS `calc` function consumes a large amount of memory.

Filtering all crashes by the property "Comments" and clicking "Exporting As CSV" is also... illuminating:

<img src="/assets/images/humanity.png" />

For more information, check out Sony's [Crash Reporting System Overview].

[A lot can go wrong on a PlayStation]: https://ps4.siedev.net/resources/documents/SDK/7.500/ErrorCode-Table/__toc.html
[Remote Web Inspector User's Guide]: https://ps4.siedev.net/resources/documents/SDK/7.500/Remote_Web_Inspector-Users_Guide/__toc.html
[Target Manager UI (TMUI) applications]: https://wiki.at.sky/display/CC/Debugging+a+PS4+Application#:~:text=Target%20Manager%20UI%20(TMUI)%20applications
[several ways to open]: https://ps4.siedev.net/resources/documents/SDK/7.500/TM_Applications_UI-Overview/0002.html
[Console Output Users Guide]: https://ps4.siedev.net/resources/documents/SDK/7.500/Console_Output-Users_Guide/__document_toc.html
[WTFs]: https://stackoverflow.com/questions/834179/wtf-is-wtf-in-webkit-code-base
[Crash Reporting System Overview]: https://ps4.siedev.net/resources/documents/SDK/7.500/Crash_Reporting_System-Overview/__toc.html

[^1]: This used to be a link that pointed to an internal doc on how to create a PS4 app


This was written on Sep 29, 2020 21:00
