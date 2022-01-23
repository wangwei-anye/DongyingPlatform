/*
 * 用来调整视图
 * 1. UI 设计稿基于 1920 * 1080
 * 2. 页面视图基于 1920 * 1080 固定布局
 * 3. 页面呈现基于 SuitableView 进行缩放
 * 4. SuitableView 可能是浏览器 viewport, 也可能是重新计算的新容器, 这取决于 threshold
 * 5. 新容器总是与 1920 * 1080 等比的, 如果是新容器, 其左右(或上下)会出现多余背景(默认白色) 
 * 6. 参数说明:
 *    selector  -> 需要缩放的元素选择器
 *    threshold -> 阈值, 确定缩放比率差的区间
 *    open      -> 是否启用缩放
 */
import Vue from 'vue'

export const UIWidth = 1920,
      UIHeight = 1080;

function resizeViewport(open, selector, threshold) {
  var efficientScale = () => throttle(scale, 100)(open, selector, getSuitableView(selector, threshold));

  efficientScale();
  window.addEventListener('resize', efficientScale);
}

function getViewportSize(w) {
  var w = w || window;
  if (w.innnerWidth !== null) return {w: w.innerWidth, h: w.innerHeight};
  var d = w.document;
  if (document.compatMode == "CSS1Compat") {
    return {
      w: d.documentElement.clientWidth,
      h: d.documentElement.clientHeight
    };
  }
  return {w: d.body.clientWidth, h: d.body.clientHeight};
}

function getSuitableView(selector, threshold) {
  var viewport = getViewportSize();
  var margin = '0',
      width = viewport.w,
      height = viewport.h,
      ratio = width / height,
      UIRatio = UIWidth / UIHeight,
      ratioGap = Math.abs(ratio - UIRatio),
      element = document.querySelector(selector);

  if (ratioGap > threshold) {
    if (ratio > UIRatio) {
      margin = '0 0 0 ' + (width - height * UIRatio) / 2 + 'px';
      return {w: height * UIRatio, h: height, m: margin};
    }
    margin = (height - width / UIRatio) / 2 + 'px 0 0 0';
    return {w: width, h: width / UIRatio, m: margin};
  } else {
    return {w: width, h: height, m: margin};
  }
}

function scale(open, selector, view){
  var wRatio = view.w / UIWidth,
      hRatio = view.h / UIHeight,
      element = document.querySelector(selector),
      scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

  element.style.display = 'inline-block';

  if (open) {
    scrollTop != 0 ? window.scrollTo(0, 0) : '';
    document.body.style.overflow = 'hidden';
    element.style.width = UIWidth + 'px';
    element.style.height = UIHeight + 'px';
    element.style.transformOrigin = "0 0";
    element.style.margin = view.m;
    element.style.transform = 'scale('+ wRatio +', '+ hRatio +')';
  } else {
    document.body.style.overflow = 'visible';
    element.style.width = 'auto';
    element.style.height = 'auto';
    element.style.transformOrigin = 'none';
    element.style.transform = 'none';
    element.style.margin = 0;
  }
}

function throttle(c, a) { var d = null; return function b() { var e = this, args = arguments; clearTimeout(d); d = setTimeout(function () { c.apply(e, args) }, a) } };

export default resizeViewport;
