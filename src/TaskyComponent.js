import React, { Component } from "react";
import "./App.css";
import { task, timeout, drop, unbounded, restartable } from "./concurrency";
import TaskyChildComponent from "./TaskyChildComponent";

class TaskyComponent extends Component {
  state = {
    myTask: task(this, {
      trackState: true,
      policy: restartable,

      *perform(count) {
        while (count--) {
          this.setState({ count });
          yield timeout(20);
        }
      }
    })
  };

  render() {
    return (
      <div>
        <p>Count is {this.state.count}</p>
        <p>
          <button onClick={() => this.state.myTask.perform(50)}>
            {this.state.myTask.isRunning
              ? "Performing..."
              : "Perform from Parent"}
          </button>
        </p>
        <TaskyChildComponent task={this.state.myTask} />
      </div>
    );
  }
}

export default TaskyComponent;
