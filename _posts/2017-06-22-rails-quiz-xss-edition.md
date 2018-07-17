---
layout:   post
title:    "Rails Quiz: XSS Edition"
subtitle: "Think you know all about protecting Rails apps from XSS attacks? Test yourself!"
date:     2017-06-22 07:42:04 +0100
published:
  publication: "Runtime Revolution blog"
  url: https://revs.runtime-revolution.com/rails-quiz-xss-edition-6ace80dc9515
---
Cross-site scripting (XSS) is a type of computer security vulnerability that enables an attacker to inject code into a web page. When a user later visits that web page the code is executed in that user's browser. The attacker can then steal the user's session cookie and log into the site with that user's account.
Think you know all about XSS? Test your knowledge with this mini-quiz!

---

### Question 1
Which of the following examples are secure from XSS attacks?

1. `<%= @user.comment %>`

2. `<%= html_escape @user.comment %>`

4. `<%= sanitize @user.comment %>`

5. `<%= raw @user.comment %>`

6. `<%= @user.comment.html_safe %>`

---

Got it?

---

You sure?

---

Ok, answer:

The first three options are secure.
[Rails 3 added XSS protection by default] which means that all strings passed into `<%= %>` are automatically escaped.
Option 2 unnecessarily escapes the comment twice.
Option 3 uses [`sanitize`] to strip all HTML tags and attributes that aren't whitelisted, and the result is escaped afterwards.

The last two options use [`raw`] and [`html_safe`] to mark the comment as safe so that it is not escaped.
This means they're vulnerable to XSS attacks.

---

### Question 2
We want to create the following view helper:

```ruby
module ApplicationHelper
  def strong(content)
    # Render content inside a `strong` tag
  end
end
```

To be later used in a view like this:

```erb
<%= strong(@user.name) %>
```

Which of the following implementations render the strong tag *and* are secure from XSS attacks?

1. `content_tag(:strong, content)`

2. `"<strong>#{html_escape content}</strong>"`

3. `"<strong>#{content}</strong>".html_safe`

4. `raw("<strong>#{content}</strong>")`

---

Done?

---

You certain?

---

Ok, answer:

Only option 1 is correct. [`content_tag`] (as well as [`tag`]) escapes the content but does not escape the `strong` tag.

Option 2 escapes the content with [`html_escape`].
However, as we saw in the first question, Rails automatically escapes all strings so the `strong` tag is then also escaped.

The last two options correctly mark the string as safe so that the `strong` tag is not escaped. However, they do not escape the content with `html_escape`. This means they're vulnerable to XSS attacks.

---

### Final question

An often overlooked XSS attack vector is the `href` value of an `a` tag.
If it starts with [`javascript:`] or [`data:`] it is executed when the link is clicked.

Which of the following examples are secure from XSS attacks?

1. `<a href='<%= @user.website %>'>Personal Website</a>`

2. `<%= link_to 'Personal Website', @user.website %>`

3. `<%= link_to 'Personal Website', sanitize(@user.website) %>`

4. `<%= sanitize link_to 'Personal Website', @user.website %>`

---

Finished?

---

No doubts?

---

Ok, answer:

Only the last option is secure.
The tricky part of this question is that [`sanitize`] works with HTML — not with URLs.
This means that you should `sanitize` the whole `a` tag instead of just the `href` value.
And that's it!

---

### Conclusions

* Rails protects you when rendering user input with `<%= %>`…

* Unless you use `raw` or `html_safe` to render HTML. In that case use [`html_escape`] (or its handy alias `h`) to escape user input.

* Rails does not protect you when passing user input to the URL part of `link_to`. In that case use [`sanitize`] to clean the `a` tag.

To detect these types of vulnerabilities and more I recommend using [brakeman], *the* static analysis security vulnerability scanner for Ruby on Rails applications.



[Rails 3 added XSS protection by default]: http://yehudakatz.com/2010/02/01/safebuffers-and-rails-3-0/
[`sanitize`]: http://api.rubyonrails.org/classes/ActionView/Helpers/SanitizeHelper.html#method-i-sanitize
[`raw`]: http://api.rubyonrails.org/classes/ActionView/Helpers/OutputSafetyHelper.html#method-i-raw
[`html_safe`]: http://api.rubyonrails.org/classes/String.html#method-i-html_safe
[`content_tag`]: http://api.rubyonrails.org/classes/ActionView/Helpers/TagHelper.html#method-i-content_tag
[`tag`]: http://api.rubyonrails.org/classes/ActionView/Helpers/TagHelper.html#method-i-tag
[`html_escape`]: http://api.rubyonrails.org/classes/ERB/Util.html#method-c-html_escape
[`javascript:`]: http://blog.codeclimate.com/blog/2013/03/27/rails-insecure-defaults/#linkto-xss
[`data:`]: https://cubalo.github.io/blog/2014/01/04/bypassing-xss-filters-using-data-uris/
[brakeman]: https://github.com/presidentbeef/brakeman
