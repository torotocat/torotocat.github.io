/**
 * 随机封面 / 背景（body 阶段）
 *
 * 分工：
 *   - cover-early.js（<head>）负责「首次加载」的整页背景与首页顶部大图，
 *     在首次绘制前就写好样式，避免开局闪一下固定图。
 *   - 本文件负责首页卡片的封面随机，以及 PJAX 切换后的重新随机。
 *
 * 为什么不在这里再设一遍背景：
 *   首次加载时如果这里也换一次，背景会先随机成 A、再跳成 B，等于制造第二次闪烁。
 *   所以首次加载只处理卡片，背景交给 head 脚本。
 *
 * 为什么不用 element.style.backgroundImage：
 *   HTML 里的内联样式被 head 脚本以 !important 规则覆盖了，
 *   普通的内联赋值优先级不够，改不动。因此统一通过 <style id="cover-early"> 来更新。
 */
(function () {
  var FALLBACK = '/img/bg-cool-light.jpg';

  var CONFIG = {
    randomBackground: true,   // 整页背景随机
    randomHero: true,         // 首页顶部大图随机
    randomCardCover: true     // 首页卡片封面各自随机
  };

  function pick(list) {
    if (window.__pickCover) return window.__pickCover();
    if (!list || !list.length) return null;
    return list[Math.floor(Math.random() * list.length)];
  }

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

  function applyCardCovers(list) {
    var cards = document.querySelectorAll('#recent-posts .recent-post-item .post_cover img');
    for (var i = 0; i < cards.length; i++) {
      var url = pick(list);
      cards[i].setAttribute('src', url);
      if (cards[i].hasAttribute('data-src')) {
        cards[i].setAttribute('data-src', url);
      }
      cards[i].style.objectFit = 'cover';
    }
  }

  function apply(isFirstLoad) {
    var list = window.__COVER_LIST__;

    if (!list || !list.length) {
      // 清单缺失：保留主题默认背景，不做任何改动
      return;
    }

    // 首次加载时背景已在 head 阶段设好，不再重复随机
    if (!isFirstLoad && (CONFIG.randomBackground || CONFIG.randomHero)) {
      setEarlyStyle(pick(list));
    }

    if (CONFIG.randomCardCover) {
      applyCardCovers(list);
    }
  }

  try {
    apply(true);
  } catch (e) {
    // 静默失败，不影响页面其它功能
  }

  document.addEventListener('pjax:complete', function () {
    try {
      apply(false);
    } catch (e) {
      // 同上
    }
  });
})();
