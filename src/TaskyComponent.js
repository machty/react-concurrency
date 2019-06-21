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
        return Math.floor(Math.random() * 100);
      }
    }),

    defaultTask: task(this, {
      *perform() {
        // by default, tasks are `.drop()` and they are stateless.
        // In order to access .isRunning/etc, you need to do `trackState: true`,
        // (if you don't, it throws an error when you access that property)
        yield timeout(500);
        return Math.floor(Math.random() * 100);
      }
    }),

  };

  render() {
    let lastSuccessful = this.state.myTask.lastSuccessful;

    return (
      <div>
        <p>
          Count is {this.state.count}
        </p>
        {
          lastSuccessful &&
          <p>
            The last value returned was {lastSuccessful.value}
          </p>
        }
        <p>
          <button onClick={() => this.state.myTask.perform(50)}>
            {this.state.myTask.isRunning
              ? "Performing..."
              : "Perform from Parent"}
          </button>
          <br/>
          <button onClick={() => this.state.myTask.cancelAll()}>
            myTask.cancelAll()
          </button>
        </p>
        <TaskyChildComponent task={this.state.myTask} />
      </div>
    );
  }
}

export default TaskyComponent;
