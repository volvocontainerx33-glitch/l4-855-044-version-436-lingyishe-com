(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  function initMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      var opened = panel.classList.toggle('open');
      button.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  function initHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('.hero-dot'));
    var prev = root.querySelector('[data-hero-prev]');
    var next = root.querySelector('[data-hero-next]');
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function play() {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      play();
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        restart();
      });
    });

    show(0);
    play();
  }

  function initSearchForms() {
    var forms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));
    forms.forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input');
        var keyword = input ? input.value.trim() : '';
        if (keyword) {
          window.location.href = './search.html?q=' + encodeURIComponent(keyword);
        }
      });
    });
  }

  function initLiveFilter() {
    var input = document.querySelector('[data-live-filter]');
    var select = document.querySelector('[data-category-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var empty = document.querySelector('[data-empty-state]');
    if (!cards.length) {
      return;
    }

    function paramsKeyword() {
      var params = new URLSearchParams(window.location.search);
      return params.get('q') || '';
    }

    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var category = select ? select.value : '';
      var visible = 0;
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-text') || '').toLowerCase();
        var cardCategory = card.getAttribute('data-category') || '';
        var okText = !keyword || text.indexOf(keyword) !== -1;
        var okCategory = !category || cardCategory === category;
        var ok = okText && okCategory;
        card.classList.toggle('hidden-card', !ok);
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }

    if (input && !input.value) {
      input.value = paramsKeyword();
    }
    if (input) {
      input.addEventListener('input', apply);
    }
    if (select) {
      select.addEventListener('change', apply);
    }
    apply();
  }

  ready(function () {
    initMenu();
    initHero();
    initSearchForms();
    initLiveFilter();
  });
})();
