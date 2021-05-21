import React from 'react';
import {StyleSheet} from 'react-native';
import {View} from 'native-base';
import Icons from "../Icons";
import Colors from "../../constants/Colors";
import ShadowView from "react-native-simple-shadow-view";
import Styles from "../../constants/Styles";

const CustomCheckbox = ({size = 24, style = {}, checked, icon_size = 20, checkbox_style = {}, bold = false, error = false}) =>{
    return (
      <ShadowView style={[checked ? Styles.shadow : {}, style]}>
      <View style={[
        styles.container,
        !checked ? styles.container_border : {},
        {width: size, height: size},
        error ? styles.container_error : {},
        checkbox_style
      ]}>
        {checked ? Icons[bold ? 'bold_check' : 'check'](icon_size, Colors.tintColor) : null}
      </View>
      </ShadowView>
    );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#525559',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
    borderRadius: 6
  },
  container_border: {
    borderWidth: 1,
    borderColor: Colors.text_muted,
    backgroundColor: '#ffffff00',
  },
  container_error: {
    borderColor: Colors.thirdColor
  }
});

export default CustomCheckbox;