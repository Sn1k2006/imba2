import React, {Component} from 'react';
import {StyleSheet, Image, Animated} from 'react-native';
import {View} from 'native-base';
import confetti from '../assets/images/confetti3.png';

class RepeatImage extends Component {
  animate = new Animated.Value(0);
  constructor(props) {
    super(props);
    this.state = {
      contentSize: {width: 0, height: 0},
      imagesViewHeight: 0
    }
  }

  triggerAnimate = (value = true) => {
    Animated.sequence([
      Animated.delay(100),
      Animated.timing(
        this.animate,
        {
          toValue: Number(value),
          duration: 1500,
          useNativeDriver: true
        })
      ]).start(() => this.triggerAnimate(!value))
  };

  setWidth = (event) => {
    let {width, height} = event.nativeEvent.layout;
    this.setState({contentSize: {width, height}});
  };
  setImagesViewHeight = (event) => {
    let {height} = event.nativeEvent.layout;
    this.setState({imagesViewHeight: height});
  };

  componentDidMount() {
    this.triggerAnimate();
  }


  render() {
    const {style, small} = this.props;
    const images = []
    const interpolated_1 = this.animate.interpolate({
      inputRange: [0, 0.48,0.51, 1],
      outputRange: [1, 0, 0, 1]
    });
    const interpolated_2 = this.animate.interpolate({
      inputRange: [0, 0.49, 0.50, 1],
      outputRange: [0, 0, 0.15, 0.15]
    });
    return (
      <>
      <Animated.View style={[styles.container, style, {
        opacity: interpolated_1,
        transform: [
          // {translateX: interpolated_2},
          {rotate: interpolated_2},
          ]
      }]} onLayout={this.setWidth}>
        <Image style={[{width: small ? 550 : 789, height: small ? 240 : 800}]}
               source={confetti}/>
      </Animated.View>
        </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: -20,
    right: 0,
    bottom: 0,
    // overflow: 'hidden'
  },
  image: {
    resizeMode: 'repeat',
  }
});

export default RepeatImage;