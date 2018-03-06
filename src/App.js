import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './App.css';
import Big from './Big';
// import Wall from './Wall';

const SIZE = 100;

// function initPixels(width, height) {
//   let pixels = [];
//   for (let i = 0; i < height; i++) {
//     pixels[i] = Array(width);
//   }
//   return pixels;
// }
// function drawRect(pixels, agentData) {
//   const { cX, cY, width, height, color } = agentData;
//   const xMax = Math.min(cX + width / 2, pixels[0].length);
//   const yMax = Math.min(cY + height / 2, pixels.length);
//   for (let y = cY - height / 2; y < yMax; y++) {
//     for (let x = cX - width / 2; x < xMax; x++) {
//       pixels[y][x] = color;
//     }
//   }
// };

// function arrayToImageData(array, ctx) {
//   const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
//   let idIndex = 0;
//   for (let row = 0; row < array.length; row++) {
//     for (let col = 0; col < array[row].length; col++) {
//       if (array[row][col]) {
//         imageData.data[idIndex] = array[row][col][0];
//         imageData.data[idIndex + 1] = array[row][col][1];
//         imageData.data[idIndex + 2] = array[row][col][2];
//         imageData.data[idIndex + 3] = array[row][col][3];
//       }
//       idIndex += 4;
//     }
//   }
//   return imageData;
// }

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
      agents: []
    };
  }
  componentDidMount() {
    this.ctx = ReactDOM.findDOMNode(this).getContext('2d');
    let pixels = [];
    for (let i = 0; i < SIZE; i++) {
      pixels[i] = Array(SIZE);
    }
    this.setState({ pixels });
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
    console.log('before setState agents', this.state.agents);
    this.setState({
      agents: this.state.agents.slice(0, index)
                .concat(agentData)
                .concat(this.state.agents.slice(index + 1))
    }, () => console.log(this.state.agents));
  };
  drawPixels = () => {
    this.ctx.clearRect(0, 0, this.props.width, this.props.height);
    this.state.agents.forEach(({cX, cY, direction, width, height, color}) => {
      this.ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]/255}`;
      this.ctx.save();
      this.ctx.translate(cX, cY);
      this.ctx.rotate(direction * Math.PI/180);
      this.ctx.translate(-cX, -cY);
      this.ctx.fillRect(cX - width / 2, cY - width / 2, width, height);
      this.ctx.restore();
    });
  }
  render() {
    if (!this.ctx) {
      return <canvas />;
    }
    this.drawPixels();
    const bigAgents = [0, 1, 2].map(num => (
      <Big
        key={num}
        index={num}
        initialPosition={{ x: 0, y: 5 + num * 12 }}
        moveAgent={this.moveAgent}
      />
    ));
    return (
      <canvas height={this.props.height} width={this.props.width}>
        { bigAgents }
      </canvas>
    );
  }
}

export default App;
