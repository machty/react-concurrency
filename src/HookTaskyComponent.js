import React, { useState } from 'react';

import useTask, { timeout } from './use-task';;

export default function HookTaskyComponent() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  const [perform, state] = useTask(function * (n) {
    let i = 0;
    while (true) {
      yield timeout(100);
      ++i;
      setCount(i)
    }
  })

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Count++
      </button>
      <button onClick={() => perform(5)}>
        Perform ({ state.isRunning ? "running" : "idle" })
      </button>
    </div>
  );
}