import React from 'react';

import useTask, { timeout } from './use-task';;
import { useTracked } from './concurrency';

function buildTask(state) {
  return function * (n) {
    state.count = 0;
    while(state.count < n) {
      state.count++;
      yield timeout(10);
    }
    state.name = reverse(state.name);
  }
}

export default function HookTaskyComponent() {
  const state = useTracked({
    count: 0,
    name: "Alex",
  });

  let [count, setCount] = state.for('count');
  let [name,  setName]  = state.for('name');

  const [perform, taskState] = useTask(buildTask(state));

  return (
    <div>
      <p>Hello {state.name}</p>
      <p>You clicked {state.count} times</p>
      <button onClick={() => perform(50)}>
        Perform ({ taskState.isRunning ? "running" : "idle" })
      </button>

      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

function reverse(str) {
  return str.split('').reverse().join('');
}
