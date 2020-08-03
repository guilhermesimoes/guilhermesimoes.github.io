---
layout:   post
title:    "My Top Movies of the 2010s"
subtitle: "Watch them and cross them off the list!"
date:     2020-08-04 14:19:49 +0100
---
These are my favourite movies of the past decade.
Watch them and cross them off the list!

<ol id="movies-list" class="movies-list">
  <li class="movie" data-movie="tt2267998">
    <span>Gone Girl</span>{% include imdb-link.html id="tt2267998" -%}
  </li>
  <li class="movie" data-movie="tt0993846">
    <span>The Wolf Of Wall Street</span>{% include imdb-link.html id="tt0993846" -%}
  </li>
  <li class="movie" data-movie="tt1375666">
    <span>Inception</span>{% include imdb-link.html id="tt1375666" -%}
  </li>
  <li class="movie" data-movie="tt1285016">
    <span>The Social Network</span>{% include imdb-link.html id="tt1285016" -%}
  </li>
  <li class="movie" data-movie="tt2582802">
    <span>Whiplash</span>{% include imdb-link.html id="tt2582802" -%}
  </li>
  <li class="movie" data-movie="tt1856101">
    <span>Blade Runner 2049</span>{% include imdb-link.html id="tt1856101" -%}
  </li>
  <li class="movie" data-movie="tt2562232">
    <span>Birdman</span>{% include imdb-link.html id="tt2562232" -%}
  </li>
  <li class="movie" data-movie="tt0790636">
    <span>Dallas Buyers Club</span>{% include imdb-link.html id="tt0790636" -%}
  </li>
  <li class="movie" data-movie="tt2209418">
    <span>Before Midnight</span>{% include imdb-link.html id="tt2209418" -%}
  </li>
  <li class="movie" data-movie="tt1392190">
    <span>Mad Max: Fury Road</span>{% include imdb-link.html id="tt1392190" -%}
  </li>
  <li class="movie" data-movie="tt0470752">
    <span>Ex Machina</span>{% include imdb-link.html id="tt0470752" -%}
  </li>
  <li class="movie" data-movie="tt1631867">
    <span>Edge Of Tomorrow</span>{% include imdb-link.html id="tt1631867" -%}
  </li>
  <li class="movie" data-movie="tt2096673">
    <span>Inside Out</span>{% include imdb-link.html id="tt2096673" -%}
  </li>
  <li class="movie" data-movie="tt3553976">
    <span>Captain Fantastic</span>{% include imdb-link.html id="tt3553976" -%}
  </li>
  <li class="movie" data-movie="tt3235888">
    <span>It Follows</span>{% include imdb-link.html id="tt3235888" -%}
  </li>
  <li class="movie" data-movie="tt0446029">
    <span>Scott Pilgrim vs. The World</span>{% include imdb-link.html id="tt0446029" -%}
  </li>
  <li class="movie" data-movie="tt0816692">
    <span>Interstellar</span>{% include imdb-link.html id="tt0816692" -%}
  </li>
  <li class="movie" data-movie="tt2582782">
    <span>Hell Or High Water</span>{% include imdb-link.html id="tt2582782" -%}
  </li>
  <li class="movie" data-movie="tt1291584">
    <span>Warrior</span>{% include imdb-link.html id="tt1291584" -%}
  </li>
  <li class="movie" data-movie="tt2692904">
    <span>Locke</span>{% include imdb-link.html id="tt2692904" -%}
  </li>
  <li class="movie" data-movie="tt2543164">
    <span>Arrival</span>{% include imdb-link.html id="tt2543164" -%}
  </li>
  <li class="movie" data-movie="tt7282468">
    <span>Burning</span>{% include imdb-link.html id="tt7282468" -%}
  </li>
  <li class="movie" data-movie="tt8075192">
    <span>Shoplifters</span>{% include imdb-link.html id="tt8075192" -%}
  </li>
  <li class="movie" data-movie="tt4901306">
    <span>Perfetti Sconosciuti</span>{% include imdb-link.html id="tt4901306" -%}
  </li>
  <li class="movie" data-movie="tt1675434">
    <span>The Intouchables</span>{% include imdb-link.html id="tt1675434" -%}
  </li>
  <li class="movie" data-movie="tt8991268">
    <span>Honeyland</span>{% include imdb-link.html id="tt8991268" -%}
  </li>
  <li class="movie" data-movie="tt6412452">
    <span>The Ballad Of Buster Scruggs</span>{% include imdb-link.html id="tt6412452" -%}
  </li>
  <li class="movie" data-movie="tt0359950">
    <span>The Secret Life Of Walter Mitty</span>{% include imdb-link.html id="tt0359950" -%}
  </li>
  <li class="movie" data-movie="tt2015381">
    <span>Guardians Of The Galaxy</span>{% include imdb-link.html id="tt2015381" -%}
  </li>
  <li class="movie" data-movie="tt1245492">
    <span>This Is The End</span>{% include imdb-link.html id="tt1245492" -%}
  </li>
</ol>

<script type="text/javascript">
  var moviesList = document.querySelector('#movies-list');
  var seenMovies;

  window.addEventListener('load', function onLoad() {
    try {
      seenMovies = JSON.parse(localStorage.getItem('seenMovies')) || {};
    } catch (_error) {
      seenMovies = {};
    }
    checkPreviouslySeenMovies();
    moviesList.addEventListener('click', toggleMovie);
  });

  function toggleMovie(event) {
    var target = event.target;
    if (target.nodeName === 'BUTTON') {
      target = closest(target, 'movie');
    }

    var movieId = target.getAttribute('data-movie');
    if (movieId) {
      var checked = target.classList.toggle('checked');
      if (checked) {
        seenMovies[movieId] = checked;
      } else {
        delete seenMovies[movieId];
      }
      localStorage.setItem('seenMovies', JSON.stringify(seenMovies));
    }
  }

  async function checkPreviouslySeenMovies() {
    for (li of moviesList.querySelectorAll('li')) {
      var movieId = li.getAttribute('data-movie');
      if (seenMovies[movieId]) {
        await delay();
        li.classList.add('checked');
      }
    }
  }

  function delay(timeMs = 100) {
    return new Promise(function (resolve, _reject) {
      setTimeout(resolve, timeMs);
    });
  }

  function closest(el, className) {
    while (el && el !== document) {
      if (el.classList.contains(className)) return el;
      el = el.parentNode;
    }
    return null;
  }
</script>
