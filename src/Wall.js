import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Wall extends Component {
  static propTypes = {
    position: PropTypes.object,
    height: PropTypes.number,
    width: PropTypes.number,
    fillRect: PropTypes.func
  };
  componentDidMount() {
    this.props.fillRect(this.props.position.x,
      this.props.position.y, this.props.width, this.props.height);
  }
  render() {
    const style = {
      height: this.props.height,
      width: this.props.width,
      left: this.props.position.x,
      top: this.props.position.y
    };
    return (
      <div
        className="wall"
        style={style}
      />
    );
  }
}

export default Wall;
