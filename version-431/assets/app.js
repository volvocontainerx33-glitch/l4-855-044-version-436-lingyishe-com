(function() {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function() {
    var header = document.querySelector('.site-header');
    var navToggle = document.querySelector('.nav-toggle');
    if (header && navToggle) {
      navToggle.addEventListener('click', function() {
        header.classList.toggle('nav-open');
      });
    }

    document.querySelectorAll('.site-search').forEach(function(form) {
      form.addEventListener('submit', function(event) {
        var input = form.querySelector('input[name="q"]');
        if (!input) {
          return;
        }
        var query = input.value.trim();
        if (!query) {
          event.preventDefault();
          window.location.href = './all.html';
          return;
        }
        event.preventDefault();
        window.location.href = './all.html?q=' + encodeURIComponent(query);
      });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function(slide, slideIndex) {
          slide.classList.toggle('active', slideIndex === current);
        });
        dots.forEach(function(dot, dotIndex) {
          dot.classList.toggle('active', dotIndex === current);
        });
      }

      function next() {
        show(current + 1);
      }

      function startTimer() {
        stopTimer();
        timer = window.setInterval(next, 5000);
      }

      function stopTimer() {
        if (timer) {
          window.clearInterval(timer);
        }
      }

      var prevButton = hero.querySelector('[data-hero-prev]');
      var nextButton = hero.querySelector('[data-hero-next]');
      if (prevButton) {
        prevButton.addEventListener('click', function() {
          show(current - 1);
          startTimer();
        });
      }
      if (nextButton) {
        nextButton.addEventListener('click', function() {
          show(current + 1);
          startTimer();
        });
      }
      dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
          show(Number(dot.getAttribute('data-slide')) || 0);
          startTimer();
        });
      });
      hero.addEventListener('mouseenter', stopTimer);
      hero.addEventListener('mouseleave', startTimer);
      show(0);
      startTimer();
    }

    var filterList = document.querySelector('.filter-list');
    var filterPanel = document.querySelector('.filter-panel');
    if (filterList && filterPanel) {
      var cards = Array.prototype.slice.call(filterList.querySelectorAll('.movie-card'));
      var input = filterPanel.querySelector('.filter-input');
      var year = filterPanel.querySelector('.filter-year');
      var type = filterPanel.querySelector('.filter-type');
      var category = filterPanel.querySelector('.filter-category');
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get('q') || '';
      if (input && initialQuery) {
        input.value = initialQuery;
      }

      function normalize(value) {
        return String(value || '').trim().toLowerCase();
      }

      function applyFilters() {
        var query = normalize(input && input.value);
        var yearValue = year ? year.value : '';
        var typeValue = type ? type.value : '';
        var categoryValue = category ? category.value : '';
        cards.forEach(function(card) {
          var matchesQuery = !query || normalize(card.getAttribute('data-search')).indexOf(query) !== -1;
          var matchesYear = !yearValue || card.getAttribute('data-year') === yearValue;
          var matchesType = !typeValue || card.getAttribute('data-type') === typeValue;
          var matchesCategory = !categoryValue || card.getAttribute('data-main-cat') === categoryValue;
          card.classList.toggle('is-hidden', !(matchesQuery && matchesYear && matchesType && matchesCategory));
        });
      }

      [input, year, type, category].forEach(function(control) {
        if (control) {
          control.addEventListener('input', applyFilters);
          control.addEventListener('change', applyFilters);
        }
      });
      applyFilters();
    }
  });
})();
