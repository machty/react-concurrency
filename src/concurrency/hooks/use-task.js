import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { task } from '../task-builder';

let SEQ = 0;
export function useTask(taskDefinition) {
  let rerender = useState(null)[1];
  let taskObject = useMemo(() => {
    let context = {
      setState: () => rerender(++SEQ),
    };
    return task(taskDefinition).bind(context);
  }, []);

  useEffect(() => {
    return () => {
      taskObject.onHostTeardown();
    };
  }, [])

  return taskObject;
}
