import React from 'react';
import PropTypes from 'prop-types';

const COLORS = [
  [255, 0, 0, 255],
  [0, 255, 0, 255],
  [0, 0, 255, 255]
];

const SIZE = 10;
const LOOKAHEAD = 20;

class Big extends React.Component {
  static propTypes = {
    initialPosition: PropTypes.object,
    index: PropTypes.number,
    ctx: PropTypes.object
  };
  static defaultProps = {
    initialPosition: { x: 0, y: 0 }
  };
  constructor(props) {
    super(props);
    this.state = {
      position: props.initialPosition,
      angle: 0,
      speed: 1
    };
  }
  componentDidMount() {
    // window.requestAnimationFrame(this.step);
    const { x: cX, y: cY } = this.state.position;
    this.props.moveAgent({ index: this.props.index, cX, cY, angle: this.state.angle, width: SIZE, height: SIZE, color: [255, 150, 150, 255] });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.frame !== this.props.frame) {
      this.move();
    }
  }
  calculateView = (nextX, nextY, nextAngle) => {
    const angle = this.state.angle * Math.PI / 180;
    let frontEdge = [];
    for (let i = 0; i < SIZE; i++) {
      const x = nextX + SIZE / 2;
      const y = (nextY - SIZE / 2) + i;
      const rotatedX = (x - nextX) * Math.cos(angle) - (y - nextY) * Math.sin(angle) + nextX;
      const rotatedY = (x - nextX) * Math.sin(angle) + (y - nextY) * Math.cos(angle) + nextY;
      frontEdge.push([rotatedX, rotatedY]);
    }
    const renderedView = frontEdge.map(point => {
      let curPix = point;
      for (let rayLength = 0; rayLength < LOOKAHEAD; rayLength++) {
        // step one pixel down the ray
        curPix = [point[0] + rayLength * Math.cos(angle), point[1] + rayLength * Math.sin(angle)];
        // this.props.ctx.fillStyle = 'rgba(0, 0, 0, 255)';
        // this.props.ctx.fillRect(curPix[0], curPix[1], 1, 1);
        const pixData = this.props.ctx.getImageData(curPix[0], curPix[1], 1, 1).data;
        const curCol = COLORS[this.props.index];
        if ((pixData[0] || pixData[1] || pixData[2]) && (pixData[0] !== curCol[0] || pixData[1] !== curCol[1] || pixData[2] !== curCol[2])) { // if some color
          return {
            distance: rayLength,
            color: [pixData[0], pixData[1], pixData[2], pixData[3]]
          }; // this is what that ray hits
        }
      }
      return { distance: null, color: [0, 0, 0, 0] };
    });
    // console.log(this.props.index, renderedView);
    return renderedView;
    // this.props.ctx.beginPath();
    // this.props.ctx.moveTo(frontEdge[0][0], frontEdge[0][1]);
    // this.props.ctx.lineTo(frontEdge[0][0] + LOOKAHEAD * Math.cos(angle), frontEdge[0][1] + LOOKAHEAD * Math.sin(angle));
    // this.props.ctx.lineTo(frontEdge[frontEdge.length - 1][0] + LOOKAHEAD * Math.cos(angle), frontEdge[frontEdge.length - 1][1] + LOOKAHEAD * Math.sin(angle));
    // this.props.ctx.lineTo(frontEdge[frontEdge.length - 1][0], frontEdge[frontEdge.length - 1][1]);
    // this.props.ctx.fill();
  }
  move = () => {
    const { x: cX, y: cY } = this.state.position;
    const view = this.calculateView(cX, cY, this.state.angle);
    let angleChange = 0;
    if (view.some(pix => pix.distance && pix.distance < LOOKAHEAD)) {
      const half = Math.floor(view.length / 2);
      let leftScore = 0;
      let rightScore = 0;
      for (let i = 0; i < half; i++) {
        if (view[i].distance) {
          leftScore += view[i].distance;
        }
      }
      for (let i = half; i < view.length; i++) {
        if (view[i].distance) {
          rightScore += view[i].distance;
        }
      }
      console.log('r', rightScore, 'l', leftScore);
      if (rightScore < leftScore) {
        angleChange = 10;
      } else {
        angleChange = -10;
      }
    }
    const angle = (this.state.angle + angleChange) * Math.PI / 180;
    const xSpeed = this.state.speed * Math.cos(angle);
    const ySpeed = this.state.speed * Math.sin(angle);
    const nextX = Math.max(0 + SIZE / 2, Math.min(cX + xSpeed, 100 - SIZE / 2));
    const nextY = Math.max(0 + SIZE / 2, Math.min(cY + ySpeed, 100 - SIZE / 2));
    const positionChanged = nextX !== cX || nextY !== cY;
    // const viewClear = view.every(pix => pix.distance > 5);
    if (positionChanged) {
      this.setState({
        position: Object.assign({}, this.state.position, {
          x: nextX,
          y: nextY
        }),
        angle: this.state.angle + angleChange
      });
    }
    // With current setup, an agent will disappear if it doesn't report state every frame
    // Maybe this can be changed later
    this.props.moveAgent({
      index: this.props.index,
      cX: nextX,
      cY: nextY,
      angle: this.state.angle,
      width: SIZE,
      height: SIZE,
      color: COLORS[this.props.index]
    });
    // window.requestAnimationFrame(this.step);
  };
  render() {
    return null;
  }
}

export default Big;
