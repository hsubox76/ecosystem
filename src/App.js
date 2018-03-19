import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import Big from './Big';
// import Wall from './Wall';

const SIZE = 100;
const MAXFRAME = 50;

class App extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number
  };
  static defaultProps = {
    width: SIZE,
    height: SIZE
  };
  constructor(props) {
    super(props);
    this.state = {
      agents: [],
      frame: 0
    };
    this.tempAgents = [];
  }
  componentDidMount() {
    window.requestAnimationFrame(this.step);
    this.ctx = document.getElementById('mainCanvas').getContext('2d');
    let pixels = [];
    for (let i = 0; i < SIZE; i++) {
      pixels[i] = Array(SIZE);
    }
    this.setState({ pixels });
  }
  step = () => {
    this.setState({ agents: this.tempAgents }, () => {
      this.drawPixels();
      this.tempAgents = [];
    });
    if (this.state.frame < MAXFRAME) {
      this.setState({ frame: this.state.frame + 1 });
      window.requestAnimationFrame(this.step);
    }
  }
  fillRect = (cX, cY, width, height, color) => {
    const newPixels = this.state.pixels.slice();
    const xMax = Math.min(cX + width, this.props.width);
    const yMax = Math.min(cY + height, this.props.height);
    for (let y = cY; y < yMax; y++) {
      for (let x = cX; x < xMax; x++) {
        newPixels[y][x] = color;
      }
    }
    this.setState({ pixels: newPixels });
  };
  moveAgent = (agentData) => { //index, cX, cY, width, height, color
    const { index } = agentData;
    this.tempAgents[index] = agentData;
  };
  drawPixels = () => {
    this.ctx.clearRect(0, 0, this.props.width, this.props.height);
    this.state.agents.forEach(({cX, cY, angle, width, height, color}, index) => {
      this.ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]/255}`;
      this.ctx.save();
      this.ctx.translate(cX, cY);
      this.ctx.rotate(angle * Math.PI/180);
      this.ctx.translate(-cX, -cY);
      this.ctx.fillRect(cX - width / 2, cY - width / 2, width, height);
      this.ctx.restore();
    });
  }
  render() {
    if (!this.ctx) {
      return <div><canvas id="mainCanvas" /></div>;
    }
    const bigAgents = [0, 1, 2].map((num) => (
      <Big
        key={num}
        index={num}
        frame={this.state.frame}
        initialPosition={{ x: 10 + num * 15, y: 10 }}
        moveAgent={this.moveAgent}
        ctx={this.ctx}
      />
    ));
    return (
      <div>
        <canvas id="mainCanvas" height={this.props.height} width={this.props.width}>
          { bigAgents }
        </canvas>
        <div>{this.state.frame}</div>
      </div>
    );
  }
}

export default App;
