import React, {
  Component,
  PropTypes,
} from 'react';
import {
  StyleSheet,
  View,
  Animated,
} from 'react-native';

import Overlay from '../Overlay';

const NOOP = () => {};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 0,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});

class Sheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overlayVisible: props.visible,
      animDistance: new Animated.Value(0),
    };

    this.height = null;

    this.aniShow = this.makeAnimation(this.height || 0);
    this.aniHide = this.makeAnimation(0);

    this.getHeight = this.getHeight.bind(this);
  }

  componentWillMount() {
    if (this.props.visible) {
      this.show();
    }
  }

  componentWillReceiveProps(props) {
    if (props.visible && !this.props.visible) {
      // 隐藏 -> 显示
      this.setState({
        overlayVisible: true,
      });
      this.show();
    } else if (!props.visible && this.props.visible) {
      // 显示 -> 隐藏
      this.hide();
    }
  }

  getHeight(e) {
    const { height } = e.nativeEvent.layout;

    if (height !== this.height) {
      this.height = height;
      this.aniShow = this.makeAnimation(-height);
    }
  }

  makeAnimation(toValue) {
    return Animated.timing(this.state.animDistance, {
      toValue,
      duration: this.props.duration,
    });
  }

  // 显示
  show() {
    if (this.height === null) {
      // 如果组件还未渲染，等待，再次尝试
      setTimeout(() => {
        this.show();
      }, 10);
      return;
    }

    this.aniHide.stop();
    this.aniShow.start();
  }
  // 隐藏
  hide() {
    this.aniShow.stop();
    this.aniHide.start(() => {
      this.setState({
        overlayVisible: false,
      });
      this.props.onClose();
    });
  }

  render() {
    return (
      <Overlay
        visible={this.state.overlayVisible}
        style={this.props.overlayStyle}
        onPress={this.props.onPressOverlay}
      >
        <View style={styles.container}>
          <Animated.View
            style={[styles.sheet, {
              top: this.state.animDistance,
            }, this.props.style]}
            onLayout={this.getHeight}
          >
            {this.props.children}
          </Animated.View>
        </View>
      </Overlay>
    );
  }
}

Sheet.propTypes = {
  // 自定义样式
  style: View.propTypes.style,
  // 显示开关
  visible: PropTypes.bool.isRequired,
  // 遮罩层样式
  overlayStyle: View.propTypes.style,
  // 关闭回调（动画结束时）
  onClose: PropTypes.func,
  // 遮罩点击事件
  onPressOverlay: PropTypes.func,
  // 子元素
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  // 动画时长
  duration: PropTypes.number,
};
Sheet.defaultProps = {
  style: null,
  visible: false,
  overlayStyle: null,
  onClose: NOOP,
  onPressOverlay: NOOP,
  children: null,
  duration: 200,
};

export default Sheet;
