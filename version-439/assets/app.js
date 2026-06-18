(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
      });
    });

    window.setInterval(function () {
      showSlide(index + 1);
    }, 5200);
  }

  var lists = Array.prototype.slice.call(document.querySelectorAll('[data-card-list]'));
  var input = document.querySelector('[data-search-input]');
  var chipWrap = document.querySelector('[data-filter-chips]');
  var activeFilter = 'all';

  function normalizedText(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  function cardText(card) {
    return [
      card.getAttribute('data-title'),
      card.getAttribute('data-genre'),
      card.getAttribute('data-year'),
      card.getAttribute('data-region'),
      card.getAttribute('data-type'),
      card.textContent
    ].join(' ').toLowerCase();
  }

  function applySearch() {
    var query = input ? normalizedText(input.value) : '';
    lists.forEach(function (list) {
      var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card, .ranking-row'));
      cards.forEach(function (card) {
        var haystack = cardText(card);
        var matchesQuery = !query || haystack.indexOf(query) !== -1;
        var matchesFilter = activeFilter === 'all' || haystack.indexOf(activeFilter.toLowerCase()) !== -1;
        card.classList.toggle('is-hidden', !(matchesQuery && matchesFilter));
      });
    });
  }

  if (input) {
    input.addEventListener('input', applySearch);
  }

  if (chipWrap) {
    chipWrap.addEventListener('click', function (event) {
      var button = event.target.closest('[data-filter-value]');
      if (!button) {
        return;
      }
      activeFilter = button.getAttribute('data-filter-value') || 'all';
      Array.prototype.slice.call(chipWrap.querySelectorAll('button')).forEach(function (item) {
        item.classList.toggle('is-active', item === button);
      });
      applySearch();
    });
  }

  var player = document.querySelector('[data-player]');
  if (player) {
    var video = player.querySelector('video');
    var playButton = player.querySelector('[data-play-button]');
    var stream = player.getAttribute('data-stream');
    var hasAttached = false;
    var hlsInstance = null;

    function attachStream() {
      if (!video || !stream || hasAttached) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        hasAttached = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 60
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        hasAttached = true;
        return;
      }

      video.src = stream;
      hasAttached = true;
    }

    function startPlayback() {
      attachStream();
      if (playButton) {
        playButton.classList.add('is-hidden');
      }
      video.setAttribute('controls', 'controls');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          if (playButton) {
            playButton.classList.remove('is-hidden');
          }
        });
      }
    }

    if (playButton) {
      playButton.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        startPlayback();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }
})();
