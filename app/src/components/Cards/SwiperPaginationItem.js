import React, {Component} from 'react';
import {StyleSheet, Animated} from 'react-native';
import Colors from "../../constants/Colors";

class SwiperPaginationItem extends Component {
  animated = new Animated.Value(Number(this.props.active));

  triggerWidth = () => {
    Animated.timing(this.animated, {
      toValue: Number(this.props.active),
      duration: 100
    }).start();
  };
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.active !== this.props.active) {
      this.triggerWidth();
    }
  }

  componentDidMount() {
    this.triggerWidth();
  }

  render(){
    const {active} = this.props;
    const interpolatedWidth = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [6, 32]
    });
    return (
      <Animated.View style={[styles[active ? 'pagination_item_active' : 'pagination_item'], {width: interpolatedWidth}]} />
    );
  }
}

const styles = StyleSheet.create({
  pagination_item_active: {
    marginHorizontal: 4,
    height: 6,
    backgroundColor: Colors.secondColor,
  },
  pagination_item: {
    marginHorizontal: 4,
    backgroundColor: Colors.text_muted,
    height: 6,
  }
});

export default SwiperPaginationItem;
