import React from 'react';
import {View, Text, Button} from 'native-base';
import {StyleSheet} from "react-native";
import Colors from "../../constants/Colors";
import Styles from "../../constants/Styles";
import Spinner from "../Spinner";
import Icons from "../Icons";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import ShadowView from "react-native-simple-shadow-view/src/ShadowView";

const CustomBtn = ({
                     title = '',
                     onPress,
                     type = 'primary',
                     wrap_style = {},
                     btn_style = {},
                     text_style = {},
                     uppercase = false,
                     color = '#ffffff',
                     width,
                     full = false,
                     bgc = Colors.tintColor,
                     loading = false,
                     success = false,
                     disabled = false,
                     icon = null,
                     icon_size = 32,
                     icon_color = '#ffffff',
                     right_icon_color = '#ffffff',
                     right_icon = null,
                     right_icon_size = 24,
                   }) => {
  let transparent = false;
  let my_btn_style = 'btn_primary';
  if (type === 'outline') {
    my_btn_style = 'btn_outline'
  }
  if (full) width = '100%';

  const renderBtnContent = () => {
    if(success) return (
      <View>
        <View style={{position: 'absolute'}}>
          <AnimatedCircularProgress
            size={32}
            width={2}
            fill={100}
            rotation={180}
            duration={600}
            arcSweepAngle={360}
            tintColor={'#ffffff'}
            lineCap='round'
            backgroundColor="#ffffff00"
          />
        </View>
        {Icons.check(32, '#fff')}
      </View>
    );
    if(loading) return  <View style={styles.spinner}><Spinner color='#fff'/></View>;
    if(icon) return Icons[icon](icon_size, icon_color);
    return <Text uppercase={uppercase} style={[Styles.btn_text, styles.btn_text, {color: disabled ? '#5f6266' : color}, text_style]}>{title}</Text>
  };
  return (
    <View style={[styles.btn_wrap, wrap_style]}>
      <ShadowView style={type === 'primary' && !disabled ? [Styles.shadow, styles.primary_shadow] : {flexDirection: 'row'}}>
      <Button
        loading={loading}
        disabled={loading || disabled}
        onPress={onPress}
        bordered={true}
        full={full}
        style={[styles.btn, styles[my_btn_style], {backgroundColor: type === 'outline' ? '#ffffff00' : bgc}, width ? {width} : {}, disabled ? styles.btn_disable : {}, btn_style]}
        transparent={transparent}>
        {renderBtnContent()}
        {right_icon
        ?
          <View style={styles.right_icon}>{Icons[right_icon](right_icon_size, right_icon_color)}</View>
        :
        null}
      </Button>
      </ShadowView>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  primary_shadow: {
    shadowColor: Colors.tintColor,
    textAlign: 'center',
    flexDirection: 'row'
  },
  btn_wrap: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btn: {
    borderRadius: 0,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',
    position: 'relative',
    paddingHorizontal: 16,
    alignSelf: 'center',
    height: 'auto',
    minHeight: 52,
  },
  btn_text: {
    textAlign: 'center',
    alignItems: 'center',
  },
  spinner: {
    position: 'absolute',
  },
  btn_primary: {
    borderColor: Colors.tintColor
  },
  btn_disable: {
    backgroundColor: Colors.disable_bg,
    borderColor: Colors.disable_bg,
  },
  btn_outline: {
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  right_icon: {
    position: 'absolute',
    right: 8
  }
});

export default CustomBtn;
