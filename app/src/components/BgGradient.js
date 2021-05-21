import React from 'react';
import {ImageBackground, StyleSheet} from 'react-native';
import {View} from 'native-base';
import LinearGradient from "react-native-linear-gradient";
import x_green from '../assets/images/x_green.png';
import bg from '../assets/images/bg.png';

const BgGradient = ({x, bg_img, blur, top, dark}) => {
  return (

    <View style={styles.bg_container}>
      {bg_img
        ?
        <ImageBackground source={bg} style={styles.image_bg} blurRadius={blur ? 1 : 0}/>
        :
        null
      }
      <LinearGradient style={[styles.gradient, styles.top_gradient]}
                      locations={[0, 0.8, 1]}
                      colors={['#7459FF', '#7459FF30', '#7459FF00']} start={{x: 0.0, y: 0}} end={{x: 0.5, y: 0.5}}/>
      {dark
        ?
        <LinearGradient
          start={{x: 0, y: 0}}
          // end={{x: 1, y: 0}}
          style={[styles.gradient, styles.dark_gradient]}
          colors={['#FC2A5200', '#181B2090', '#181B20']}
        />
        :
        top
          ?
          <LinearGradient style={[styles.gradient, styles.top_r_gradient]}
                          colors={['#FC2A52', '#FC2A5230', '#FC2A5200']}
                          locations={[0, 0.6, 1]}
                          start={{x: 0.0, y: 0}} end={{x: 0.5, y: 0.5}}/>
          :
          <LinearGradient style={[styles.gradient, styles.bottom_gradient]} locations={[0, 0.5, 1]}
                          colors={['#ffffff00', '#FC2A5200', '#FC2A52']}
                          start={{x: 0.0, y: 0}} end={{x: 1, y: 1}}/>
      }
      {x
        ?
        <View style={styles.x_wrap}>
          <ImageBackground source={x_green} style={styles.image_x}/>
        </View>
        :
        null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  x_wrap: {
    position: 'absolute',
    left: 0,
    width: 450,
    height: 450,
  },
  top_gradient: {
    top: 0,
    left: 0,
    width: 255,
    height: 255,
  },
  top_r_gradient: {
    transform: [{rotate: '90deg'}],
    top: 0,
    right: 0,
    width: 255,
    height: 255,
  },
  dark_gradient: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  bottom_gradient: {
    bottom: 0,
    right: 0,
    width: 400,
    height: 400,
  },
  image_bg: {
    opacity: 0.3,
    flex: 1,

    resizeMode: "cover",
    justifyContent: "center"
  },
  image_x: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  gradient: {
    position: 'absolute',
    opacity: 1,
  },

  bg_container: {
    // opacity: 1,
    position: 'absolute',
    left: 0,
    top: -100,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
  },
});

export default BgGradient;