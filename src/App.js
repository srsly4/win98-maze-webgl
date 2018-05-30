import React, { Component } from 'react';
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
    window.addEventListener('resize', engine.onWindowResize, false);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <strong>Maze demo</strong>
          <button onClick={() => engine.toggleCamera()}>Toggle camera</button>
          <button onClick={() => engine.toggleWaypoints()}>Toggle waypoints</button>
        </header>
        <div className="canvas-container">
          { this.canvas }
        </div>
      </div>
    );
  }
}

export default App;
