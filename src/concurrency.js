import { Task } from "./concurrency/task";
import {
  task,
  restartable,
  enqueued,
  drop,
  keepLatest,
  unbounded,
} from "./concurrency/task-builder";
import { useState, useRef } from 'react';

import { yieldableSymbol, YIELDABLE_CONTINUE } from "./concurrency/external/yieldables";

export function timeout(ms) {
  return {
    [yieldableSymbol](taskInstance, resumeIndex) {
      let id = setTimeout(() => {
        taskInstance.proceed(resumeIndex, YIELDABLE_CONTINUE, null);
      }, ms);

      return () => {
        clearInterval(id);
      };
    }
  };
}

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


export {
  Task,
  task,
  restartable,
  enqueued,
  drop,
  keepLatest,
  unbounded,
};
