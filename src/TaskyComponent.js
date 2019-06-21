import React, { Component } from "react";
import "./App.css";
import { task, timeout } from "./concurrency";

function forwardTo(name) {
  return (state, task) => {
    let component = task.context;
    component.setState({
      [name]: state
    });
  };
}

class TaskyComponent extends Component {
  state = {

  };

  myTask = task({
    *perform(count) {
      while (count--) {
        this.setState({ count });
        yield timeout(20);
      }
    }
  })
    .drop()
    .onState(forwardTo('myTaskState'))
    .bind(this);

  render() {
    return (
      <div>
        <p>
          {this.state.myTaskState.isLoading ? "Loading" : "Idle"}
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
