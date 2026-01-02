var moviesList;
var seenMovies;
var strikeThroughTemplate;

self.addEventListener('load', function onLoad() {
  try {
    seenMovies = JSON.parse(localStorage.getItem('seenMovies')) || {};
  } catch (_error) {
    seenMovies = {};
  }
  moviesList = document.querySelector('#movies-list');
  strikeThroughTemplate = document.getElementById('template').content;
  checkPreviouslySeenMovies();
  moviesList.addEventListener('click', toggleMovie);
});

function toggleMovie(event) {
  var movieButton = find(event.target, 'movie');
  if (movieButton) {
    var movieId = movieButton.getAttribute('data-movie');
    var checked = movieButton.getAttribute('aria-checked') === 'true';
    checked = !checked;
    toggleStrikeThrough(movieButton, checked);
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
      await delay(100);
      toggleStrikeThrough(movieButton, true);
    }
  }
}

function toggleStrikeThrough(target, checked) {
  if (!target.querySelector('.rough-strike-through')) {
    var strikeThrough = document.importNode(strikeThroughTemplate, true);
    target.appendChild(strikeThrough);
  }
  delay(10).then(() => target.setAttribute('aria-checked', checked));
}

function delay(timeMs) {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeMs);
  });
}

function find(el, className) {
  if (el.classList.contains(className)) return el;
  return el.querySelector('.' + className);
}
