(function () {
  window.startMoviePlayer = function (url) {
    var video = document.getElementById('movie-video');
    var overlay = document.getElementById('movie-play');
    if (!video || !overlay || !url) {
      return;
    }
    var started = false;
    var hls = null;

    function begin() {
      if (started) {
        video.play().catch(function () {});
        return;
      }
      started = true;
      overlay.classList.add('is-hidden');
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal || !hls) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
            return;
          }
          if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
            return;
          }
          hls.destroy();
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.play().catch(function () {});
      } else {
        video.src = url;
        video.play().catch(function () {});
      }
    }

    overlay.addEventListener('click', begin);
    video.addEventListener('click', function () {
      if (!started) {
        begin();
      }
    });
  };
})();
