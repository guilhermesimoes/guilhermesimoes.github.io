---
layout: default
---
<article class="post" itemscope itemtype="http://schema.org/BlogPosting">
  <link itemprop="mainEntityOfPage" href="{{ page.url | absolute_url }}" />

  <header class="post-header wrapper">
    <h1 class="post-title" itemprop="name headline">{{ page.title }}</h1>
  </header>

  <div class="bleed mb-1">
    <figure class="aspect-ratio-box ratio-16-9">
      <iframe class="aspect-ratio-box-content embedded-gist" id="js-embedded-gist" src="about:blank" sandbox="allow-scripts allow-forms" marginwidth="0" marginheight="0" scrolling="no"></iframe>
    </figure>
  </div>

  {{ content }}

  <div class="wrapper">
    {% include post-meta.html -%}
  </div>
</article>


<script type="text/javascript">
  var iframe = document.querySelector('iframe');
  var html = document.querySelector('.gist').textContent;
  iframe.src = "data:text/html," + encodeURIComponent(html);
</script>
