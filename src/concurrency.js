import { Task } from "./concurrency/task";
import { task } from "./concurrency/task-builder";
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

export {
  Task,
  task,
};
