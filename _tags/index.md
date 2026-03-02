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

  {%- include rss-hint.html -%}
</section>
