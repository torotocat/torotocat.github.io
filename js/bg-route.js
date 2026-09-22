/**
 * PJAX 切换后的背景恢复（body 阶段）
 *
 * 分工：
 *   - cover-early.js（<head>）负责「首次加载」的整页背景与首页顶部大图，
 *     并把选定的图存在 window.__PICKED_COVER__。
 *   - 本文件只负责一件事：PJAX 切换后把背景恢复成首次加载时选定的那张图。
 *
 * 为什么不再随机：
 *   首页卡片封面由构建脚本 scripts/random-cover.js 按文章链接 hash 稳定分配，
 *   服务端渲染结果就是稳定封面，前端不再二次随机；
 *   背景 likewise 在会话内保持稳定——PJAX 返回首页时，新渲染的 #page-header
 *   带着主题写死的默认图，这里用首次选定的图覆盖回去，避免 hero 闪回默认图。
 *
 * 为什么用 <style id="cover-early"> 而不是 element.style.backgroundImage：
 *   HTML 里的内联样式被 head 脚本以 !important 规则覆盖了，
 *   普通的内联赋值优先级不够，改不动。因此统一通过该 <style> 来更新。
 */
(function () {
  var CONFIG = {
    randomBackground: true,   // 整页背景（恢复为首次选定的图）
    randomHero: true,         // 首页顶部大图（同上）
    randomCardCover: false    // 卡片封面由构建脚本按 hash 稳定分配，前端不碰
  };

  function setEarlyStyle(url) {
    var el = document.getElementById('cover-early');
    if (!el) {
      el = document.createElement('style');
      el.id = 'cover-early';
      document.head.appendChild(el);
    }
    var css = '';
    if (CONFIG.randomBackground) {
      css += '#web_bg{background-image:url("' + url + '") !important;' +
        'background-size:cover;background-position:center;background-repeat:no-repeat}';
    }
    if (CONFIG.randomHero) {
      css += '#page-header.full_page{background-image:url("' + url + '") !important}';
    }
    el.textContent = css;
  }

  // 首次加载的背景由 head 阶段的 cover-early.js 设定，这里无需处理；
  // 只需在 PJAX 完成后，把新页面里的默认图恢复成会话内选定的那一张。
  document.addEventListener('pjax:complete', function () {
    try {
      var url = window.__PICKED_COVER__;
      if (!url) return;
      if (CONFIG.randomBackground || CONFIG.randomHero) {
        setEarlyStyle(url);
      }
    } catch (e) {
      // 静默失败，不影响页面其它功能
    }
  });
})();
