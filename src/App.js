import React, { Component } from 'react';
import './App.css';
import TaskyComponent from './TaskyComponent';
import HookTaskyComponent from './HookTaskyComponent';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TaskyComponent />
        <HookTaskyComponent />
      </div>
    );
  }
}

export default App;
