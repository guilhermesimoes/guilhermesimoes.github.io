if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-worker.js');
}

var root = document.documentElement;
var themeToggle = document.querySelector('.theme-toggle');
var themes = ['system', 'dark', 'light'];
var isSystemThemeDark = matchMedia('(prefers-color-scheme: dark)').matches;
var direction = isSystemThemeDark ? -1 : 1;

themeToggle.addEventListener('click', () => {
  var themeIndex = 0;
  for (let className of root.classList) {
    var match = className.match(/(.*)-theme/);
    var theme = match && match[1];
    if (theme) {
      themeIndex = themes.indexOf(theme);
      break;
    }
  }

  themeIndex = (themeIndex + direction) % themes.length;
  var nextTheme = themes.at(themeIndex);
  root.classList.remove('light-theme', 'dark-theme');
  if (nextTheme === 'system') {
    localStorage.removeItem('theme');
  } else {
    root.classList.add(`${nextTheme}-theme`);
    localStorage.setItem('theme', nextTheme);
  }
});
themeToggle.classList.remove('hidden');

self.addEventListener('pagehide', () => {
  // Page may be stored in the bfcache
  if (event.persisted) {
    var menuTrigger = document.querySelector('#nav-trigger');
    if (menuTrigger.checked) {
      menuTrigger.checked = false;
    }
  }
});

self.addEventListener('pageshow', (event) => {
  // Page was restored from the bfcache
  if (event.persisted) {
    var theme = localStorage.getItem('theme');
    var root = document.documentElement;
    root.classList.remove('light-theme', 'dark-theme', 'animatable');
    if (theme) {
      root.classList.add(`${theme}-theme`);
    }
    setTimeout(() => {
      root.classList.add('animatable');
    });
  }
});

// Screen real estate is precious on mobile, avoid turning on this feature on mobile
if (matchMedia('(hover: hover)').matches) {
  var hidingButton = true;
  var goTopButton = document.querySelector('#gotop-link');
  goTopButton.addEventListener('click', scrollToTop); // Not necessary, but prevents # from being added to the URL
  self.addEventListener('scroll', handleScroll);
}

function scrollToTop(event) {
  event.preventDefault();
  window.scrollTo({ top: 0 });
}

function handleScroll() {
  var userHasScrolledOneViewport = self.scrollY > self.innerHeight;
  if (userHasScrolledOneViewport) {
    if (hidingButton) {
      hidingButton = false;
      goTopButton.classList.remove('hidden');
    }
  } else {
    if (!hidingButton) {
      hidingButton = true;
      goTopButton.classList.add('hidden');
    }
  }
}
