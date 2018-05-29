import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import engine from './engine';

class App extends Component {

  constructor(props) {
    super(props);

    this.canvasElement = React.createRef();
    this.canvas = (<canvas ref={this.canvasElement} id="mainCanvas" />);
  }

  componentDidMount() {
    engine.initialize(this.canvasElement.current);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="canvas-container">
          { this.canvas }
        </div>
      </div>
    );
  }
}

export default App;
