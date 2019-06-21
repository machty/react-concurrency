import { useState, useRef } from 'react';

let RENDER_SEQUENCE = 0;
export function useTracked(initialValues) {
  let rerender = useState(null)[1];
  let ref = useRef(null);
  if (!ref.current) {
    ref.current = createTrackedObject(initialValues, rerender);
  }
  return ref.current;
}

function createTrackedObject(original, rerender) {
  let obj = Object.create(original);
  Object.keys(original).forEach(k => installTrackedProperty(obj, k, rerender));

  obj.for = (key) => {
    return [
      obj[key],
      (newValue) => { obj[key] = newValue; }
    ];
  }

  return obj;
}

function installTrackedProperty(target, key, rerender) {
  let value = target[key];

  Object.defineProperty(target, key, {
    configurable: true,

    get() {
      return value;
    },

    set(newValue) {
      value = newValue;
      rerender(++RENDER_SEQUENCE);
      return value;
    },
  });
}
