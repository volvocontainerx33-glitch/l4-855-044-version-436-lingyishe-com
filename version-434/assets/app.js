(function() {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function() {
            mobileNav.classList.toggle('is-open');
        });
    }

    const hero = document.querySelector('[data-hero]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        const prev = hero.querySelector('[data-hero-prev]');
        const next = hero.querySelector('[data-hero-next]');
        let current = 0;
        let timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function restartTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function() {
                showSlide(current + 1);
            }, 5000);
        }

        if (prev) {
            prev.addEventListener('click', function() {
                showSlide(current - 1);
                restartTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function() {
                showSlide(current + 1);
                restartTimer();
            });
        }

        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                restartTimer();
            });
        });

        showSlide(0);
        restartTimer();
    }

    const searchInput = document.querySelector('[data-site-search]');
    const filterControls = Array.from(document.querySelectorAll('[data-filter]'));
    const cards = Array.from(document.querySelectorAll('[data-search-card]'));
    const resultCount = document.querySelector('[data-result-count]');

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function cardMatches(card, query) {
        if (!query) {
            return true;
        }

        const text = [
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-category'),
            card.getAttribute('data-tags'),
            card.textContent
        ].join(' ').toLowerCase();

        return text.indexOf(query) !== -1;
    }

    function cardPassesFilters(card) {
        return filterControls.every(function(control) {
            const key = control.getAttribute('data-filter');
            const value = normalize(control.value);
            if (!value) {
                return true;
            }
            return normalize(card.getAttribute('data-' + key)) === value;
        });
    }

    function updateCards() {
        const query = normalize(searchInput ? searchInput.value : '');
        let visible = 0;

        cards.forEach(function(card) {
            const isVisible = cardMatches(card, query) && cardPassesFilters(card);
            card.classList.toggle('is-hidden', !isVisible);
            if (isVisible) {
                visible += 1;
            }
        });

        if (resultCount) {
            resultCount.textContent = '共 ' + visible + ' 部影片';
        }
    }

    if (searchInput || filterControls.length) {
        if (searchInput) {
            searchInput.addEventListener('input', updateCards);
        }
        filterControls.forEach(function(control) {
            control.addEventListener('change', updateCards);
        });
        updateCards();
    }
}());
