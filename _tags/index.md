---
layout:       default
title:        Tags
permalink:    /tags/
---

<section itemscope itemtype="https://schema.org/ItemList" class="wrapper">
  <h1 itemprop="name">Tags</h1>

  <ul class="mosaic mosaic--stacks">
    {% for tag in site.tags %}
      {%- if tag.name != page.name -%}
        {% assign posts = site.posts | where_exp: "post", "post.tags contains tag.name" %}
        {% capture images %}
          {% assign image_count = 0 %}
          {% for post in posts %}
            {% if post.hidden != true and post.image.path != nil and post.image.path != empty %}
              <img src="{{ post.image.path | relative_url | escape }}" alt="" loading="lazy" />
              {% assign image_count = image_count | plus: 1 %}
              {% if image_count == 3 %}{% break %}{% endif %}
            {% endif %}
          {% endfor %}
        {% endcapture %}
        {% if image_count == 3 %}
          <li itemprop="itemListElement">
            <a href="{{ tag.url | relative_url }}" class="ratio-16-9">{{ images }}<span itemprop="name">{{ tag.name | strip_html }}</span></a>
          </li>
        {% endif %}
      {%- endif %}
    {% endfor %}
  </ul>

{%- include rss-hint.html -%}

</section>
