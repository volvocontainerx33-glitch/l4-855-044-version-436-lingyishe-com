(() => {
    const hlsUrl = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
    let hlsLoading = null;

    const loadHls = () => {
        if (window.Hls) {
            return Promise.resolve(true);
        }

        if (hlsLoading) {
            return hlsLoading;
        }

        hlsLoading = new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = hlsUrl;
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.head.appendChild(script);
        });

        return hlsLoading;
    };

    const activate = async (box) => {
        if (!box || box.dataset.ready === '1') {
            const current = box ? box.querySelector('video') : null;
            if (current) {
                current.play().catch(() => {});
            }
            return;
        }

        const video = box.querySelector('video');
        const stream = box.dataset.stream;

        if (!video || !stream) {
            return;
        }

        box.dataset.ready = '1';

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
        } else {
            const loaded = await loadHls();
            if (loaded && window.Hls && window.Hls.isSupported()) {
                const hls = new window.Hls({ enableWorker: true });
                hls.loadSource(stream);
                hls.attachMedia(video);
                box.hlsPlayer = hls;
            } else {
                video.src = stream;
            }
        }

        box.classList.add('is-playing');
        video.play().catch(() => {});
    };

    document.querySelectorAll('[data-player]').forEach((box) => {
        const trigger = box.querySelector('[data-play-trigger]');
        const video = box.querySelector('video');

        if (trigger) {
            trigger.addEventListener('click', () => activate(box));
        }

        if (video) {
            video.addEventListener('play', () => {
                box.classList.add('is-playing');
            });
        }
    });
})();
