import React, { Component } from "react";
import "./App.css";

class TaskyChildComponent extends Component {
  render() {
    return (
      <div>
        <p>
          I am a child component that is passed a task.
        </p>

        <p>
          <button onClick={() => this.props.task.perform(100)}>
            {this.props.task.isRunning ? "Performing..." : "Perform from Child"}
          </button>
        </p>
      </div>
    );
  }
}

export default TaskyChildComponent;
