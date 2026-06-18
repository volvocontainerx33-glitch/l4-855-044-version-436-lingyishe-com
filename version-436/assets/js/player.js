(function () {
  window.initMoviePlayer = function (videoId, coverId, source) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    var hls = null;
    var attached = false;

    if (!video || !source) return;

    function attachSource() {
      if (attached) return;
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function start() {
      attachSource();
      if (cover) cover.classList.add("is-hidden");
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener("click", start);
    }

    video.addEventListener("click", function () {
      if (!attached || video.paused) start();
    });

    video.addEventListener("play", function () {
      if (cover) cover.classList.add("is-hidden");
    });

    window.addEventListener("pagehide", function () {
      if (hls) hls.destroy();
    });
  };
})();
