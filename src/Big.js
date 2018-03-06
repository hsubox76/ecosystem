import React from 'react';
import PropTypes from 'prop-types';

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
      direction: 20,
      speed: 1
    };
  }
  componentDidMount() {
    window.requestAnimationFrame(this.step);
    const { x: cX, y: cY } = this.state.position;
    this.props.moveAgent({ index: this.props.index, cX, cY, direction: this.state.direction, width: SIZE, height: SIZE, color: [255, 150, 150, 255] });
  }
  step = () => {
    const { x: cX, y: cY } = this.state.position;
    const xSpeed = this.state.speed * Math.sin(this.state.direction);
    const ySpeed = this.state.speed * Math.cos(this.state.direction);
    const nextX = Math.min(cX + xSpeed, 60);
    const nextY = Math.min(cY + ySpeed, 60);
    if (nextX !== cX || nextY !== cY) {
      this.setState({
        position: Object.assign({}, this.state.position, {
          x: nextX,
          y: nextY
        })
      });
      this.props.moveAgent({ index: this.props.index, cX: nextX, cY: nextY, direction: this.state.direction, width: SIZE, height: SIZE, color: [255, 150, 150, 255] });
    }
    window.requestAnimationFrame(this.step);
  };
  render() {
    return null;
  }
}

export default Big;
