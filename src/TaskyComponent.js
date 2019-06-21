import React, { Component } from "react";
import "./App.css";
import { task, timeout } from "./concurrency";

class TaskyComponent extends Component {
  state = { isLoading: false };

  myTask = task({
    *perform(count) {
      while (count--) {
        this.setState({ count });
        yield timeout(20);
      }
    }
  })
    .drop()
    .onState((a, b) => { b.context.setState({ isLoading: a.isRunning })})
    .bind(this);

  render() {
    return (
      <div>
        <p>
          isLoading: {this.state.isLoading}
        </p>
        <p>
          Count is {this.state.count} and foo={this.state.foo}
        </p>
        <p>
          <button onClick={() => this.myTask.perform(50)}>Click Me</button>
        </p>
      </div>
    );
  }
}

export default TaskyComponent;
