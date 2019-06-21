import React from 'react';

import useTask, { timeout } from './use-task';;
import { useTracked } from './concurrency';

export default function HookTaskyComponent() {
  const state = useTracked({
    count: 0,
    name: "Alex",
  });

  const [perform, taskState] = useTask(function * (n) {
    state.count = 0;
    while(state.count < n) {
      state.count++;
      yield timeout(10);
    }
    state.name = reverse(state.name);
  })

  return (
    <div>
      <p>Hello {state.name}</p>
      <p>You clicked {state.count} times</p>
      <button onClick={() => perform(50)}>
        Perform ({ taskState.isRunning ? "running" : "idle" })
      </button>
    </div>
  );
}

function reverse(str) {
  return str.split('').reverse().join('');
}
