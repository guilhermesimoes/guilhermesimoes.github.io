var moviesList;
var seenMovies;

window.addEventListener('load', function onLoad() {
  try {
    seenMovies = JSON.parse(localStorage.getItem('seenMovies')) || {};
  } catch (_error) {
    seenMovies = {};
  }
  moviesList = document.querySelector('#movies-list');
  checkPreviouslySeenMovies();
  moviesList.addEventListener('click', toggleMovie);
});

function toggleMovie(event) {
  var target = find(event.target, 'movie');
  if (target) {
    var movieId = target.getAttribute('data-movie');
    var checked = target.getAttribute('aria-checked') === 'true';
    checked = !checked;
    target.setAttribute('aria-checked', checked);
    if (checked) {
      seenMovies[movieId] = checked;
    } else {
      delete seenMovies[movieId];
    }
    localStorage.setItem('seenMovies', JSON.stringify(seenMovies));
  }
}

async function checkPreviouslySeenMovies() {
  for (movieButton of moviesList.querySelectorAll('.movie')) {
    var movieId = movieButton.getAttribute('data-movie');
    if (seenMovies[movieId]) {
      await delay();
      movieButton.setAttribute('aria-checked', true);
    }
  }
}

function delay(timeMs = 100) {
  return new Promise(function (resolve, _reject) {
    setTimeout(resolve, timeMs);
  });
}

function find(el, className) {
  if (el.classList.contains(className)) return el;
  return el.querySelector('.' + className);
}
