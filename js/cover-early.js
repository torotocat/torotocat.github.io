/**
 * 早期封面选择（在 <head> 中同步执行）
 *
 * 为什么需要它：
 *   Hexo 生成的 HTML 里，#web_bg 和 #page-header 带着内联样式
 *   background-image: url(/img/bg-cool-light.jpg)（主题写死的固定图）。
 *   如果等到 </body> 前的脚本再换图，浏览器会先画出那张固定图、再跳变成随机图，
 *   也就是肉眼看到的「开局闪一下」。
 *
 * 做法：
 *   在 head 阶段（此时 body 尚未解析、还没有任何绘制）就随机选好图，
 *   并写入一条带 !important 的样式规则覆盖内联样式。
 *   等 body 解析到 #web_bg 时，用的已经是随机图，不存在中间态。
 *
 * 依赖：cover-list.js 必须在本文件之前加载（它定义 window.__COVER_LIST__）。
 */
(function () {
  var list = window.__COVER_LIST__;
  if (!list || !list.length) {
    // 清单缺失时什么都不做，页面会保留主题的默认背景图
    return;
  }

  // 供后续脚本复用，避免二次随机导致背景再次跳变
  window.__pickCover = function () {
    return list[Math.floor(Math.random() * list.length)];
  };

  var url = window.__pickCover();
  window.__PICKED_COVER__ = url;

  var style = document.createElement('style');
  style.id = 'cover-early';
  style.textContent = [
    '#web_bg{background-image:url("' + url + '") !important;',
    'background-size:cover;background-position:center;background-repeat:no-repeat}',
    '#page-header.full_page{background-image:url("' + url + '") !important}'
  ].join('');
  document.head.appendChild(style);
})();
