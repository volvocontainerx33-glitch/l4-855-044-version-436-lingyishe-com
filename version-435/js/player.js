(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function initPlayer(wrapper) {
    var video = wrapper.querySelector('video[data-src]');
    var button = wrapper.querySelector('[data-play-button]');
    if (!video) {
      return;
    }
    var source = video.getAttribute('data-src');
    var loaded = false;
    var hlsInstance = null;

    function attachSource() {
      if (loaded || !source) {
        return;
      }
      loaded = true;
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        video.src = source;
      }
      wrapper.classList.add('is-ready');
    }

    function playMovie() {
      attachSource();
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', playMovie);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        playMovie();
      }
    });
    video.addEventListener('play', function () {
      wrapper.classList.add('is-playing');
    });
    video.addEventListener('pause', function () {
      wrapper.classList.remove('is-playing');
    });
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  ready(function () {
    document.querySelectorAll('[data-player]').forEach(initPlayer);
  });
})();
