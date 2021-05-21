import React from 'react';
import {StyleSheet} from 'react-native';
import {View} from 'native-base';
import Colors from "../../constants/Colors";

const CustomRadio = ({size = 16, style = {}, active, center_size = 6}) => {
  return (
    <View style={[styles.container, !active ? styles.container_border : styles.container_active, {
      width: size,
      height: size,
      borderRadius: size * 2
    }, style]}>
      {active ? <View style={[styles.center, {
        width: center_size,
        height: center_size,
        borderRadius: center_size * 2
      }]}/> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
    borderRadius: 6
  },
  container_border: {
    borderWidth: 1,
    borderColor: Colors.text_muted
  },
  container_active: {
    borderColor: Colors.secondColor,
    backgroundColor: Colors.secondColor
  },
   center: {
     backgroundColor: '#ffffff'
   }
});

export default CustomRadio;