export function debounce(func, wait = 300) {
  let timeoutId;
  
  return function debounced(...args) {
    const context = this;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

export function debounceWithImmediate(func, wait = 300) {
  let timeoutId;
  
  return function debounced(...args) {
    const context = this;
    const callNow = !timeoutId;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      timeoutId = null;
    }, wait);
    
    if (callNow) {
      func.apply(context, args);
    }
  };
}

export function throttle(func, wait = 300) {
  let inThrottle;
  let lastFunc;
  let lastTime;
  
  return function throttled(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          func.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
}
