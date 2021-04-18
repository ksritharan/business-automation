window.addEventListener("beforeunload", function (e) {
  navigator.sendBeacon('/videofeed/stop');
});
document.addEventListener('DOMContentLoaded', (event) => {
  navigator.sendBeacon('/videofeed/start');
});
