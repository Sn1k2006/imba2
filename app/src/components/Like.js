import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Icon} from 'native-base';
import Icons from "./Icons";
import Colors from "../constants/Colors";

class Like extends Component {
  render(){
    const {active, onPress, fontSize = 27, border = true} = this.props;
    return (
      <TouchableOpacity
        hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
        onPress={onPress}>
      <View style={styles.container}>
        {!active
          ?
          <Icon name={'heart'} type='FontAwesome5' style={[styles.icon, {fontSize}]}/>
          :
          border
          ?
          <View style={styles.heart_wrap}>
            <Icon name={'heart'} type='FontAwesome5' style={[styles.heart_absolute, {fontSize}]}/>
            <Icon name={'heart'} type='FontAwesome' style={[styles.icon, {color: Colors.thirdColor, fontSize: fontSize - 2}]}/>
          </View>
            :
            <Icon name={'heart'} type='FontAwesome' style={[styles.icon, {color: Colors.thirdColor, fontSize}]}/>
        }
      </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  heart_wrap: {
    flex: 0,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30

  },
  heart_absolute: {
    position: 'absolute',
    zIndex: 1,
    color: '#fff',
    fontSize: 30
  },
  icon: {
    color: 'rgba(36, 40, 62, 0.32)',
  }
});

export default Like;