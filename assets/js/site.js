(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) return;
    toggle.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero]");
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) return;
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    }

    function start() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        start();
      });
    });

    show(0);
    start();
  }

  function setupFilters() {
    var areas = Array.prototype.slice.call(document.querySelectorAll("[data-search-area]"));
    areas.forEach(function (area) {
      var input = area.querySelector("[data-search-input]");
      var select = area.querySelector("[data-filter-select]");
      var cards = Array.prototype.slice.call(area.querySelectorAll("[data-card]"));
      var empty = area.querySelector("[data-empty-state]");

      function matchYear(card, mode) {
        var year = parseInt(card.getAttribute("data-year") || "0", 10);
        if (!mode || mode === "all") return true;
        if (mode === "new") return year >= 2025;
        if (mode === "recent") return year >= 2020 && year <= 2024;
        if (mode === "classic") return year > 0 && year < 2020;
        return true;
      }

      function apply() {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        var mode = select ? select.value : "all";
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = (card.getAttribute("data-search") || "").toLowerCase();
          var ok = (!keyword || haystack.indexOf(keyword) !== -1) && matchYear(card, mode);
          card.style.display = ok ? "" : "none";
          if (ok) visible += 1;
        });
        if (empty) empty.classList.toggle("is-visible", visible === 0);
      }

      if (input) input.addEventListener("input", apply);
      if (select) select.addEventListener("change", apply);
      apply();
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
