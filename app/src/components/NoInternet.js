import React, {Component} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {View, Text} from 'native-base';
import CustomModal from "./elements/CustomModal";
import {observer} from "mobx-react";
import {translate} from "../utils";
import Icons from "./Icons";
import Styles from "../constants/Styles";

@observer
class NoInternet extends Component {
  animated = new Animated.Value(0);


  componentDidMount() {
    this.trigger()
  }

  componentWillUnmount() {
    this.stopTrigger()
  }

  stopTrigger = () => {
    Animated.timing(this.animated).stop();
  };

  trigger = (value = true) => {
    Animated.timing(this.animated, {
      toValue: Number(value),
      duration: 1500,
    }).start(() => this.trigger(!value));
  };

  render(){
    const {visible} = this.props;
    const interpolated = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.1]
    });
    return (
      <CustomModal visible={!visible} dark>
        <View style={styles.container}>
          <Animated.View style={{marginBottom: 32, opacity: interpolated}}>{Icons.no_inet()}</Animated.View>
          <Text style={[Styles.item_title, {textAlign: 'center'}]}>{translate('NO_INTERNET')}</Text>
        </View>
      </CustomModal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 16
  },
});

export default NoInternet;