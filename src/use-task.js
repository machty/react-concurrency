import { useState, useMemo, useRef, useCallback } from 'react';
import useWillUnmount from '@rooks/use-will-unmount';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

class Deferred {
  constructor() {
    this[Symbol.toStringTag] = "Defferred";
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  then(onfulfilled, onrejected) {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch(onrejected) {
    return this.promise.catch(onrejected);
  }

  finally(onfinally) {
    return this.promise.finally(onfinally);
  }

}

class CancellationError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, CancellationError.prototype);
  }

}

function perform(_x, _x2) {
  return _perform.apply(this, arguments);
}

function _perform() {
  _perform = _asyncToGenerator(function* (task, args) {
    task.begin();
    let result = task.fn(...args);

    if (result && typeof result.next === "function") {
      let isFinished = false,
          lastResolvedValue;
      const generator = task.fn(...args);

      while (!isFinished) {
        // Is the task has been cancelled, we can stop consuming from the
        // generator
        if (task.isCancelled) {
          break;
        } // Advance the generator with the last resolved value, so that
        // a user can treat the `yield` like `async/await` and get the
        // last value out of it. We can also use this for nested tasks


        const _generator$next = generator.next(lastResolvedValue),
              value = _generator$next.value,
              done = _generator$next.done;

        lastResolvedValue = yield value;
        isFinished = done;
      }

      result = lastResolvedValue;
    } else {
      // If a non-Generator function is provided, user is opting out of correct
      // cancellation behavior. At least for now, we don't want to prevent that
      result = yield result;
    }

    if (!task.isCancelled) {
      task.complete(result);
    }
  });
  return _perform.apply(this, arguments);
}

class TaskInstance extends Deferred {
  constructor(fn) {
    super();
    this.isCancelled = false;
    this.isRunning = false;
    this.isComplete = false;
    this[Symbol.toStringTag] = "TaskInstance";
    this.fn = fn;
  }

  begin() {
    this.isRunning = true;
  }

  complete(result) {
    this.isRunning = false;
    this.isComplete = true;
    this.result = result;
    this.resolve(result);
  }

  cancel() {
    const error = new CancellationError("Task Cancelled");
    this.isCancelled = true;
    this.reject(error);
  }

}

const TASK_POOL = new Set();
function addRunningTask(_x) {
  return _addRunningTask.apply(this, arguments);
}
/**
 * @param {number} interval how frequently to check if all tasks have completed
 */

function _addRunningTask() {
  _addRunningTask = _asyncToGenerator(function* (task) {
    TASK_POOL.add(task);
    yield task;
    TASK_POOL.delete(task);
  });
  return _addRunningTask.apply(this, arguments);
}

function timeout() {
  let delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

function cancelAllInstances(instances) {
  instances.filter(i => i.isRunning).forEach(i => i.cancel());
}

function useTask(taskDefinition) {
  let _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    keep: "all"
  },
      _ref$keep = _ref.keep,
      keep = _ref$keep === void 0 ? "all" : _ref$keep;

  const _useState = useState({
    keep,
    instances: [],
    lastSuccessful: undefined
  }),
        _useState2 = _slicedToArray(_useState, 2),
        taskState = _useState2[0],
        setTaskState = _useState2[1];

  if (keep !== taskState.keep) {
    throw new Error("Cannot dynamically change how to handle concurrent tasks");
  }

  const derivedState = useMemo(() => ({
    isRunning: taskState.instances.some(t => t.isRunning),
    performCount: taskState.instances.length,
    lastSuccessful: taskState.lastSuccessful
  }), [taskState.instances, taskState.lastSuccessful]); // Use a `ref` so that we cancel on the latest state, not the initial state

  const stateRef = useRef(taskState);
  stateRef.current = taskState;
  useWillUnmount(() => {
    cancelAllInstances(stateRef.current.instances);
  });
  const runCallback = useCallback(function () {
    const instance = new TaskInstance(taskDefinition);
    setTaskState(state => Object.assign({}, state, {
      instances: [...state.instances, instance]
    }));

    if (keep === "first" && derivedState.isRunning) {
      instance.cancel();
      return instance;
    }

    if (keep === "last" && derivedState.isRunning) {
      cancelAllInstances(taskState.instances);
    }

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    const promiseToResult = perform(instance, args);
    addRunningTask(promiseToResult);
    promiseToResult.then(() => {
      if (!instance.isCancelled) {
        setTaskState(state => Object.assign({}, state, {
          lastSuccessful: instance
        }));
      }
    });
    return instance;
  }, [derivedState.isRunning, keep, taskDefinition, taskState.instances]);
  return [runCallback, derivedState];
}

export default useTask;
export { timeout };
