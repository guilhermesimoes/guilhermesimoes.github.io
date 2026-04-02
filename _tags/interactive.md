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
            <figure>
              <img src="{{ post.image.path }}" alt="{{ post.image.alt }}" class="ratio-16-9" itemprop="image" />
            </figure>
            <div class="details">
              <div itemprop="name">{{ post.title | strip_html }}</div>
              <div class="deemph">{%- include date.html date=post.date -%}</div>
            </div>
          </a>
        </li>
      {%- endif %}
    {% endfor %}
  </ol>

  {%- include rss-hint.html -%}
</section>
