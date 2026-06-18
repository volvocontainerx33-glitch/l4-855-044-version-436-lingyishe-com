(function () {
  function selectAll(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function setupMenu() {
    var button = document.querySelector('[data-menu-button]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }
    var slides = selectAll('[data-hero-slide]', root);
    var dots = selectAll('[data-hero-dot]', root);
    var prev = root.querySelector('[data-hero-prev]');
    var next = root.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, current) {
        slide.classList.toggle('is-active', current === index);
      });
      dots.forEach(function (dot, current) {
        dot.classList.toggle('is-active', current === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupFilters() {
    var root = document.querySelector('[data-filter-root]');
    if (!root) {
      return;
    }
    var searchInput = root.querySelector('[data-search-input]');
    var resetButton = root.querySelector('[data-filter-reset]');
    var selects = selectAll('[data-filter-select]', root);
    var cards = selectAll('[data-movie-list] .movie-card');

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function apply() {
      var query = normalize(searchInput && searchInput.value);
      var filters = {};
      selects.forEach(function (select) {
        filters[select.getAttribute('data-filter-select')] = normalize(select.value);
      });
      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags')
        ].join(' '));
        var matchedQuery = !query || text.indexOf(query) !== -1;
        var matchedFilters = Object.keys(filters).every(function (key) {
          return !filters[key] || normalize(card.getAttribute('data-' + key)) === filters[key];
        });
        card.classList.toggle('is-hidden', !(matchedQuery && matchedFilters));
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', apply);
    }
    selects.forEach(function (select) {
      select.addEventListener('change', apply);
    });
    if (resetButton) {
      resetButton.addEventListener('click', function () {
        if (searchInput) {
          searchInput.value = '';
        }
        selects.forEach(function (select) {
          select.value = '';
        });
        apply();
      });
    }
  }

  function setupPlayers() {
    selectAll('[data-player]').forEach(function (player) {
      var video = player.querySelector('video');
      var cover = player.querySelector('.player-cover');
      var source = video ? video.getAttribute('data-src') : '';
      var hls = null;
      var ready = false;

      function attach() {
        if (!video || !source || ready) {
          return;
        }
        ready = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else {
          video.src = source;
        }
      }

      function play() {
        attach();
        player.classList.add('is-playing');
        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {
            player.classList.remove('is-playing');
          });
        }
      }

      if (cover) {
        cover.addEventListener('click', function (event) {
          event.preventDefault();
          play();
        });
      }
      player.addEventListener('click', function (event) {
        if (event.target === video && ready) {
          return;
        }
        if (event.target.closest && event.target.closest('.player-cover')) {
          return;
        }
        if (!ready) {
          play();
        }
      });
      if (video) {
        video.addEventListener('play', function () {
          player.classList.add('is-playing');
        });
        video.addEventListener('pause', function () {
          if (!video.currentTime) {
            player.classList.remove('is-playing');
          }
        });
      }
      window.addEventListener('beforeunload', function () {
        if (hls && typeof hls.destroy === 'function') {
          hls.destroy();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupPlayers();
  });
}());
