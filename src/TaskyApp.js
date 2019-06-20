import React, { Component } from 'react';
import './App.css';
import { task } from './concurrency';

class TaskyApp extends Component {
  myTask = task({
    *perform() {
      alert('hey');
    }
  }).restartable().bind(this);

  render() {
    return (
      <div>
        <p>
          I am the tasky app {this.myTask.isRunning ? 'running' : 'idle'}.
        </p>
        <p>
          <button onClick={() => this.myTask.perform(1,2,3) }>Click Me</button>
        </p>
      </div>
    );
  }
}

export default TaskyApp;
