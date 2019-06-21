import React, { Component } from "react";
import "./App.css";
import { task, timeout } from "./concurrency";

class TaskyComponent extends Component {
  state = {
    myTask: task({
      *perform(count) {
        while (count--) {
          this.setState({ count });
          yield timeout(20);
        }
      }
    })
      .trackState()
      .drop()
      .bind(this)
  };

  render() {
    return (
      <div>
        <p>
          Count is {this.state.count}
        </p>
        <p>
          <button onClick={() => this.state.myTask.perform(50)}>
            {
              this.state.myTask.isRunning ?
              "Please wait, counting..." :
              "Click Me"
            }
          </button>
        </p>
      </div>
    );
  }
}

export default TaskyComponent;
