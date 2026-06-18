(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function normalize(text) {
    return String(text || '').toLowerCase().trim();
  }

  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
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
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initLocalFilters() {
    var panels = document.querySelectorAll('[data-filter-panel]');
    panels.forEach(function (panel) {
      var input = panel.querySelector('[data-filter-input]');
      var region = panel.querySelector('[data-filter-region]');
      var type = panel.querySelector('[data-filter-type]');
      var year = panel.querySelector('[data-filter-year]');
      var scopeSelector = panel.getAttribute('data-filter-target') || 'body';
      var scope = document.querySelector(scopeSelector) || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));

      function apply() {
        var query = normalize(input && input.value);
        var regionValue = normalize(region && region.value);
        var typeValue = normalize(type && type.value);
        var yearValue = normalize(year && year.value);
        cards.forEach(function (card) {
          var text = normalize([
            card.dataset.title,
            card.dataset.region,
            card.dataset.type,
            card.dataset.year,
            card.dataset.tags
          ].join(' '));
          var ok = true;
          if (query && text.indexOf(query) === -1) {
            ok = false;
          }
          if (regionValue && normalize(card.dataset.region).indexOf(regionValue) === -1) {
            ok = false;
          }
          if (typeValue && normalize(card.dataset.type).indexOf(typeValue) === -1) {
            ok = false;
          }
          if (yearValue && normalize(card.dataset.year) !== yearValue) {
            ok = false;
          }
          card.classList.toggle('hidden', !ok);
        });
      }

      [input, region, type, year].forEach(function (el) {
        if (el) {
          el.addEventListener('input', apply);
          el.addEventListener('change', apply);
        }
      });
    });
  }

  function cardTemplate(movie) {
    var tags = (movie.tags || []).slice(0, 2).map(function (tag) {
      return '<span class="tag-pill">' + escapeHtml(tag) + '</span>';
    }).join('');
    return [
      '<article class="movie-card">',
      '  <a class="poster-link" href="detail/' + movie.id + '.html" aria-label="查看 ' + escapeHtml(movie.title) + '">',
      '    <span class="poster-frame">',
      '      <img src="' + movie.image + '.jpg" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '      <span class="poster-shade"></span>',
      '      <span class="play-mark">▶</span>',
      '      <span class="category-badge">' + escapeHtml(movie.category) + '</span>',
      '    </span>',
      '  </a>',
      '  <div class="card-body">',
      '    <h3><a href="detail/' + movie.id + '.html">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p class="card-desc">' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="card-meta"><span>' + escapeHtml(movie.yearText) + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function initSearchPage() {
    var root = document.querySelector('[data-search-page]');
    if (!root || !window.MOVIE_DATA) {
      return;
    }
    var input = root.querySelector('[data-global-search]');
    var region = root.querySelector('[data-global-region]');
    var type = root.querySelector('[data-global-type]');
    var year = root.querySelector('[data-global-year]');
    var form = root.querySelector('[data-search-form]');
    var results = root.querySelector('[data-search-results]');
    var count = root.querySelector('[data-search-count]');

    function render(list) {
      var limited = list.slice(0, 120);
      count.textContent = '匹配 ' + list.length + ' 部，当前显示 ' + limited.length + ' 部';
      if (!limited.length) {
        results.innerHTML = '<div class="empty-state">没有找到匹配影片</div>';
        return;
      }
      results.innerHTML = limited.map(cardTemplate).join('\n');
    }

    function search() {
      var query = normalize(input.value);
      var regionValue = normalize(region.value);
      var typeValue = normalize(type.value);
      var yearValue = normalize(year.value);
      var list = window.MOVIE_DATA.filter(function (movie) {
        var text = normalize([
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.yearText,
          movie.genre,
          (movie.tags || []).join(' '),
          movie.oneLine
        ].join(' '));
        if (query && text.indexOf(query) === -1) {
          return false;
        }
        if (regionValue && normalize(movie.region).indexOf(regionValue) === -1) {
          return false;
        }
        if (typeValue && normalize(movie.type).indexOf(typeValue) === -1) {
          return false;
        }
        if (yearValue && normalize(movie.year) !== yearValue) {
          return false;
        }
        return true;
      });
      render(list);
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      search();
    });
    [input, region, type, year].forEach(function (el) {
      el.addEventListener('input', search);
      el.addEventListener('change', search);
    });
    render(window.MOVIE_DATA.slice(0, 60));
  }

  ready(function () {
    initMenu();
    initHero();
    initLocalFilters();
    initSearchPage();
  });
})();
