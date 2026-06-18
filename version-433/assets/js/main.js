(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  if (slides.length > 1) {
    var activeIndex = 0;
    var setSlide = function (nextIndex) {
      activeIndex = nextIndex % slides.length;
      slides.forEach(function (slide, index) {
        slide.classList.toggle('active', index === activeIndex);
      });
      dots.forEach(function (dot, index) {
        dot.classList.toggle('active', index === activeIndex);
      });
    };
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        setSlide(index);
      });
    });
    window.setInterval(function () {
      setSlide(activeIndex + 1);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-card-search]');
  var yearSelect = document.querySelector('[data-year-filter]');
  var regionSelect = document.querySelector('[data-region-filter]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var emptyState = document.querySelector('[data-empty-state]');

  var applyFilters = function () {
    if (!cards.length) {
      return;
    }
    var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var year = yearSelect ? yearSelect.value : '';
    var region = regionSelect ? regionSelect.value : '';
    var visible = 0;
    cards.forEach(function (card) {
      var searchText = (card.getAttribute('data-search') || '').toLowerCase();
      var cardYear = card.getAttribute('data-year') || '';
      var cardRegion = card.getAttribute('data-region') || '';
      var matchedKeyword = !keyword || searchText.indexOf(keyword) !== -1;
      var matchedYear = !year || cardYear === year;
      var matchedRegion = !region || cardRegion.indexOf(region) !== -1;
      var show = matchedKeyword && matchedYear && matchedRegion;
      card.style.display = show ? '' : 'none';
      if (show) {
        visible += 1;
      }
    });
    if (emptyState) {
      emptyState.classList.toggle('show', visible === 0);
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  if (yearSelect) {
    yearSelect.addEventListener('change', applyFilters);
  }
  if (regionSelect) {
    regionSelect.addEventListener('change', applyFilters);
  }
})();
