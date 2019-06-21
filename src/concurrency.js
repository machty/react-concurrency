import { Task } from "./concurrency/task";
import {
  task,
  restartable,
  enqueued,
  drop,
  keepLatest,
  unbounded,
} from "./concurrency/task-builder";

import { yieldableSymbol, YIELDABLE_CONTINUE } from "./concurrency/external/yieldables";
import { useTracked } from "./concurrency/hooks/use-tracked";
import { useTask } from "./concurrency/hooks/use-task";

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

export {
  Task,
  task,
  restartable,
  enqueued,
  drop,
  keepLatest,
  unbounded,
  useTask,
  useTracked,
};
