import React from 'react';
import { task, timeout, useTracked, useTask } from './concurrency';

export default function HookTaskyComponent() {
  const state = useTracked({
    count: 0,
    name: "Alex",
  });

  const countTask = useTask({
    trackState: true,

    *perform(n) {
      state.count = 0;
      while(state.count < n) {
        state.count++;
        yield timeout(100);
      }
      state.name = reverse(state.name);
    }
  });

  return (
    <div>
      <p>Hello {state.name}</p>
      <p>You clicked {state.count} times</p>
      <button onClick={() => countTask.perform(50)}>
        Perform ({ countTask.isRunning ? "running" : "idle" })
      </button>
    </div>
  );
}

function reverse(str) {
  return str.split('').reverse().join('');
}
