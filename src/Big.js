import React from 'react';
import PropTypes from 'prop-types';

const COLORS = [
  [255, 0, 0, 255],
  [0, 255, 0, 255],
  [0, 0, 255, 255]
];

const SIZE = 10;
class Big extends React.Component {
  static propTypes = {
    initialPosition: PropTypes.object,
    index: PropTypes.number
  };
  static defaultProps = {
    initialPosition: { x: 0, y: 0 }
  };
  constructor(props) {
    super(props);
    this.state = {
      position: props.initialPosition,
      angle: 20,
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
  move = () => {
    const { x: cX, y: cY } = this.state.position;
    const xSpeed = this.state.speed * Math.sin(this.state.angle);
    const ySpeed = this.state.speed * Math.cos(this.state.angle);
    const nextX = Math.min(cX + xSpeed, 60);
    const nextY = Math.min(cY + ySpeed, 60);
    if (nextX !== cX || nextY !== cY) {
      this.setState({
        position: Object.assign({}, this.state.position, {
          x: nextX,
          y: nextY
        })
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
