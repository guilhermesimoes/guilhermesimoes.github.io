---
layout:       default
title:        Tags
permalink:    /tags/
---

<section itemscope itemtype="https://schema.org/ItemList" class="wrapper">
  <h1 itemprop="name">Tags</h1>

  <table>
    <tbody>
      {% for tag in site.tags %}
        {%- if tag.name != page.name -%}
          <tr itemprop="itemListElement">
            <td><a href="{{ tag.url | relative_url }}" itemprop="name">{{ tag.name | strip_html }}</a></td>
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
