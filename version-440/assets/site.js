(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const nav = document.querySelector("[data-site-nav]");
    const search = document.querySelector(".header-search");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
      if (search) {
        search.classList.toggle("open");
      }
    });
  }

  function setupHero() {
    const hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    const prev = hero.querySelector("[data-hero-prev]");
    const next = hero.querySelector("[data-hero-next]");
    let current = 0;
    let timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === current);
      });
    }

    function play() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        play();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        play();
      });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", play);
    show(0);
    play();
  }

  function setupFilters() {
    const grids = Array.from(document.querySelectorAll("[data-filter-grid]"));
    if (!grids.length) {
      return;
    }
    const input = document.querySelector("[data-filter-input]");
    const category = document.querySelector("[data-filter-category]");
    const type = document.querySelector("[data-filter-type]");
    const year = document.querySelector("[data-filter-year]");
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q");

    if (input && initialQuery) {
      input.value = initialQuery;
    }

    function valueOf(element) {
      return element ? element.value.trim().toLowerCase() : "";
    }

    function apply() {
      const queryValue = valueOf(input);
      const categoryValue = valueOf(category);
      const typeValue = valueOf(type);
      const yearValue = valueOf(year);
      grids.forEach(function (grid) {
        const cards = Array.from(grid.querySelectorAll("[data-card]"));
        cards.forEach(function (card) {
          const search = (card.dataset.search || "").toLowerCase();
          const cardCategory = (card.dataset.category || "").toLowerCase();
          const cardType = (card.dataset.type || "").toLowerCase();
          const cardYear = (card.dataset.year || "").toLowerCase();
          const matched = (!queryValue || search.indexOf(queryValue) !== -1)
            && (!categoryValue || cardCategory === categoryValue)
            && (!typeValue || cardType === typeValue)
            && (!yearValue || cardYear === yearValue);
          card.classList.toggle("is-hidden", !matched);
        });
      });
    }

    [input, category, type, year].forEach(function (element) {
      if (element) {
        element.addEventListener("input", apply);
        element.addEventListener("change", apply);
      }
    });
    apply();
  }

  function initMoviePlayer(stream) {
    function mount() {
      const video = document.getElementById("movie-player");
      const cover = document.querySelector("[data-player-cover]");
      if (!video || !stream) {
        return;
      }
      let attached = false;

      function attach() {
        if (attached) {
          return;
        }
        attached = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          const hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
      }

      function start() {
        attach();
        if (cover) {
          cover.classList.add("hidden");
        }
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {});
        }
      }

      attach();
      if (cover) {
        cover.addEventListener("click", start);
      }
      video.addEventListener("play", function () {
        if (cover) {
          cover.classList.add("hidden");
        }
      });
    }
    ready(mount);
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });

  window.initMoviePlayer = initMoviePlayer;
})();
