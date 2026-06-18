(() => {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', () => {
            mobileNav.classList.toggle('is-open');
        });
    }

    const hero = document.querySelector('[data-hero]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        const prev = hero.querySelector('[data-hero-prev]');
        const next = hero.querySelector('[data-hero-next]');
        let index = 0;
        let timer = null;

        const show = (nextIndex) => {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach((slide, current) => {
                slide.classList.toggle('is-active', current === index);
            });
            dots.forEach((dot, current) => {
                dot.classList.toggle('is-active', current === index);
            });
        };

        const restart = () => {
            window.clearInterval(timer);
            timer = window.setInterval(() => show(index + 1), 5200);
        };

        dots.forEach((dot, current) => {
            dot.addEventListener('click', () => {
                show(current);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener('click', () => {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', () => {
                show(index + 1);
                restart();
            });
        }

        restart();
    }

    document.querySelectorAll('[data-search-area]').forEach((area) => {
        const keyword = area.querySelector('[data-filter-keyword]');
        const category = area.querySelector('[data-filter-category]');
        const year = area.querySelector('[data-filter-year]');
        const scope = area.parentElement || document;
        const cards = Array.from(scope.querySelectorAll('[data-card]'));

        const normalize = (value) => String(value || '').toLowerCase().trim();

        const apply = () => {
            const q = normalize(keyword ? keyword.value : '');
            const selectedCategory = category ? category.value : '';
            const selectedYear = year ? year.value : '';

            cards.forEach((card) => {
                const text = normalize([
                    card.dataset.title,
                    card.dataset.category,
                    card.dataset.year,
                    card.dataset.tags
                ].join(' '));
                const okKeyword = !q || text.includes(q);
                const okCategory = !selectedCategory || card.dataset.category === selectedCategory;
                const okYear = !selectedYear || card.dataset.year === selectedYear;
                card.classList.toggle('is-hidden', !(okKeyword && okCategory && okYear));
            });
        };

        [keyword, category, year].filter(Boolean).forEach((control) => {
            control.addEventListener('input', apply);
            control.addEventListener('change', apply);
        });
    });
})();
