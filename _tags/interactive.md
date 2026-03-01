---
name:   Interactive
layout: default
---

<section itemscope itemtype="https://schema.org/ItemList" class="wrapper">
  {% assign tag = page %}
  <h1 itemprop="name">{{ tag.name }} posts</h1>

  <ol class="interactive-list">
    {% assign posts = site.posts | where_exp: "post", "post.tags contains page.name" %}
    {% for post in posts %}
      {%- if post.hidden != true -%}
        <li itemprop="itemListElement">
          <a href="{{ post.url | relative_url }}">
            <img src="{{ post.image.meta_path | default: post.image.path }}" alt="TODO" class="modern-ratio-16-9" itemprop="image" />
            <div class="details">
              <div itemprop="name">{{ post.title | strip_html }}</div>
              <div class="deemph">{%- include date.html date=post.date -%}</div>
            </div>
          </a>
        </li>
      {%- endif %}
    {% endfor %}
   </ol>

  <div class="post-meta deemph">
    <a href="/feed.xml">
      {%- include icons/rss.svg -%}<span>subscribe to RSS feed</span>
    </a>
    (<a href="https://www.lifewire.com/what-is-an-rss-feed-4684568">what is this?</a>)
  </div>
</section>
