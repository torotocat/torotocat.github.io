(function () {
  function applyBg() {
    var root = (window.GLOBAL_CONFIG && GLOBAL_CONFIG.root) || '/';
    var path = location.pathname.replace(root, '');
    var isHome = document.body.classList.contains('home') || path === '';
    var homeBg = window.HOME_BG || 'https://w.wallhaven.cc/full/6l/wallhaven-6ld1xw.jpg';
    var postBg = window.POST_BG || 'https://w.wallhaven.cc/full/1q/wallhaven-1qp11g.jpg';
    var webBg = document.getElementById('web_bg');
    if (!webBg) return;
    webBg.style.backgroundImage = 'url(' + (isHome ? homeBg : postBg) + ')';
    webBg.style.backgroundSize = 'cover';
    webBg.style.backgroundPosition = 'center';
    webBg.style.backgroundRepeat = 'no-repeat';
  }
  applyBg();
  document.addEventListener('pjax:complete', applyBg);
})();