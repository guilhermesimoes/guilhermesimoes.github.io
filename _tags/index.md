---
layout:       default
title:        Tags
permalink:    /tags/
---

<section class="blog-index wrapper">
  <h1>Tags</h1>

  <table>
    <tbody>
      {% for tag in site.tags %}
        {%- if tag.name != page.name -%}
          <tr>
            <td><a href="{{ tag.url | relative_url }}">{{ tag.name | strip_html }}</a></td>
          </tr>
        {%- endif %}
      {% endfor %}
    </tbody>
  </table>

  <div class="post-meta deemph">
    <a href="/feed.xml">
      {%- include icons/rss.svg -%}<span>subscribe to RSS feed</span>
    </a>
    (<a href="https://www.lifewire.com/what-is-an-rss-feed-4684568">what is this?</a>)
  </div>
</section>
