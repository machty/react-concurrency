import React, { Component } from 'react';
import './App.css';
import TaskyComponent from './TaskyComponent';
import HookTaskyComponent from './HookTaskyComponent';

class App extends Component {
  state = { isShowing: true }

  toggleComponent = () => {
    this.setState({ isShowing: !this.state.isShowing });
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.toggleComponent}>
          {this.state.isShowing ? "Hide (test that task cancels on unrender)" : "Show"}
        </button>
        {
          this.state.isShowing &&
            <div>
              <h2>Tasks on class-based components</h2>
              <TaskyComponent />

              <h2>Tasks via useTask hook</h2>
              <HookTaskyComponent />
            </div>
        }
      </div>
    );
  }
}

export default App;
