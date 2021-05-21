import React from 'react';
import {Spinner as NativeSpinner, View} from 'native-base';
import Colors from "../constants/Colors";
import {StyleSheet, Platform} from "react-native";

const Spinner = ({color, page, style, size}) => {
  return (
    <View style={[page ? styles.page_spinner : {}, style]}>
    <NativeSpinner color={color || Colors.tintColor} size={size || Platform.OS === 'android' ? 'large' : 'small'}/>
    </View>
  );
};

const styles = StyleSheet.create({
  page_spinner: {
    flexGrow: 1,
    top: Platform.OS === 'ios' ? 24 : 0,
    position: 'absolute',
    alignSelf: 'center'
  },
});

export default Spinner;
