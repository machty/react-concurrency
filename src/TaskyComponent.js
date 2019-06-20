import React, { Component } from 'react';
import './App.css';
import { task, timeout } from './concurrency';

class TaskyComponent extends Component {
  constructor() {
    super();
    this.state = {};
  }

  myTask = task({
    *perform(count) {
      while (count--) {
        this.setState({ count })
        yield timeout(16);
      }
    }
  }).enqueued().bind(this);

  render() {
    return (
      <div>
        <p>
          Count is {this.state.count}
        </p>
        <p>
          <button onClick={() => this.myTask.perform(50)}>Click Me</button>
        </p>
      </div>
    );
  }
}

export default TaskyComponent;
