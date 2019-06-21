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
          this.state.isShowing ? <TaskyComponent /> : null
        }

        <HookTaskyComponent />
      </div>
    );
  }
}

export default App;
