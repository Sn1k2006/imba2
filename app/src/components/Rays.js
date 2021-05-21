import React from 'react';
import {StyleSheet, Animated, Easing} from 'react-native';
import Icons from "./Icons";

class Rays extends React.Component {
  animate = new Animated.Value(0);

  state = {
    count: 1
  };

  componentDidMount() {
    this.triggerAnimate()
  }

  componentWillUnmount() {
    Animated.timing(this.animate).stop();
  }


  triggerAnimate = (value = true) => {
    this.animate.setValue(0);
    Animated.timing(this.animate, {
      toValue: 1,
      duration: 15000,
      useNativeDriver: true,
      easing: Easing.linear
    }).start(this.triggerAnimate)
  };

  render() {
    const {size} = this.props;
    const interpolated = this.animate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '361deg']
    });
    return (
      <Animated.View style={[styles.container, {
        width: size, height: size,
        transform: [{rotate: interpolated}]
      }]}>
        {Icons.rays()}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    paddingVertical: 8,
    alignItems: 'center',
    paddingLeft: 16,
    justifyContent: 'center',
    top: 50
  },
});

export default Rays;