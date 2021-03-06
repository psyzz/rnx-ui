/**
 * 遮罩层
 */
import React, {
  PropTypes,
  Component,
} from 'react';
import {
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const NOOP = () => {};

const styles = StyleSheet.create({
  all: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});

class Overlay extends Component {
  constructor(props) {
    super(props);

    const visible = props.visible;
    this.state = {
      visible,
      opacity: new Animated.Value(visible ? 1 : 0),
    };

    this.aniShow = Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: props.duration,
    });
    this.aniHide = Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 200,
    });
  }

  componentWillReceiveProps(props) {
    if (props.visible && !this.props.visible) {
      // 隐藏 -> 显示
      this.show();
    } else if (!props.visible && this.props.visible) {
      // 显示 -> 隐藏
      this.hide();
    }
  }

  // 显示
  show() {
    this.aniHide.stop();
    this.setState({
      visible: true,
    });
    this.aniShow.start();
  }

  // 隐藏
  hide() {
    this.aniShow.stop();
    this.aniHide.start(() => {
      this.setState({
        visible: false,
      });
    });
  }

  render() {
    if (!this.state.visible) {
      return null;
    }

    return (
      <TouchableWithoutFeedback
        onPress={this.props.onPress}
      >
        <Animated.View
          style={[styles.all, {
            opacity: this.state.opacity,
          }, this.props.style]}
          pointerEvents={this.props.pointerEvents}
        >
          {this.props.children}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

Overlay.propTypes = {
  // 显示开关
  visible: PropTypes.bool.isRequired,
  // 点击回调
  onPress: PropTypes.func,
  // 自定义样式
  style: View.propTypes.style,
  // 子元素
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  // 控制 Overlay 是否可以作为触控事件的目标
  pointerEvents: View.propTypes.pointerEvents,
  // 动画时长
  duration: PropTypes.number,
};
Overlay.defaultProps = {
  visible: false,
  onPress: NOOP,
  style: null,
  children: null,
  pointerEvents: 'auto',
  duration: 200,
};

export default Overlay;
