/**
 * Simple browser feature detection utilities
 */

export const browserSupport = {
  // Check for Canvas support
  canvas: (() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext && canvas.getContext('2d'));
    } catch (e) {
      return false;
    }
  })(),

  // Check for CSS transforms support
  transforms: (() => {
    const testEl = document.createElement('div');
    const transforms = [
      'transform',
      'webkitTransform',
      'mozTransform',
      'msTransform',
      'oTransform'
    ];
    
    for (const transform of transforms) {
      if (testEl.style[transform] !== undefined) {
        return true;
      }
    }
    return false;
  })(),

  // Check for CSS transitions support
  transitions: (() => {
    const testEl = document.createElement('div');
    const transitions = [
      'transition',
      'webkitTransition',
      'mozTransition',
      'msTransition',
      'oTransition'
    ];
    
    for (const transition of transitions) {
      if (testEl.style[transition] !== undefined) {
        return true;
      }
    }
    return false;
  })(),

  // Check for touch support
  touch: (() => {
    return 'ontouchstart' in window || 
           navigator.maxTouchPoints > 0 || 
           navigator.msMaxTouchPoints > 0;
  })(),

  // Check for reduced motion preference
  reducedMotion: (() => {
    return window.matchMedia && 
           window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  })(),

  // Check for high DPI display
  highDPI: (() => {
    return window.devicePixelRatio && window.devicePixelRatio > 1;
  })(),

  // Check for requestAnimationFrame support
  raf: (() => {
    return !!(window.requestAnimationFrame || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame || 
              window.msRequestAnimationFrame);
  })()
};

// Add feature detection classes to document element
export const addFeatureClasses = () => {
  const classes = [];
  
  Object.keys(browserSupport).forEach(feature => {
    classes.push(browserSupport[feature] ? feature : `no-${feature}`);
  });
  
  document.documentElement.classList.add(...classes);
};

// Get vendor prefix for CSS properties
export const getVendorPrefix = () => {
  const styles = window.getComputedStyle(document.documentElement, '');
  const pre = (Array.prototype.slice
    .call(styles)
    .join('') 
    .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
  )[1];
  
  return {
    dom: pre === 'ms' ? 'MS' : pre,
    lowercase: pre,
    css: `-${pre}-`,
    js: pre === 'ms' ? pre : pre[0].toUpperCase() + pre.substr(1)
  };
};
