import React from 'react';
import {StyleSheet, Image} from "react-native";
import {View} from 'native-base';
import Fonts from "../../constants/Fonts";
import {getImageMaxSize} from '../../utils';

const Logo = ({
                stub = '',
                image = null,
                round = false,
                bgc = '#ffffff',
                size = 64
              }) => {
  if (!image && !stub) return null;
  return (
    <View style={[
      styles.container,
      round ? {borderRadius: size * 2} : {},
      {height: size, width: size, backgroundColor: bgc}
    ]}>
      {image
        ?
        <Image source={image} style={[styles.image, getImageMaxSize(size, size, size)]}/>
        :
        stub
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
    overflow: 'hidden',
    borderRadius: Fonts.border_radius
  },
  image: {
    resizeMode: 'cover',
  }
});

export default Logo;