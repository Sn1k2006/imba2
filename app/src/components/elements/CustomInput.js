import React from 'react';
import {StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {Item} from 'native-base';
import Styles from "../../constants/Styles";
import Icons from "../Icons";
import Colors from "../../constants/Colors";

const CustomInput = ({
                       multiline= false,
                       value,
                       setRef,
                       onBlur,
                       onFocus,
                       onChange,
                       left_icon,
                       right_icon,
                       autoFocus=false,
                       style = {},
                       containerStyle = {},
                       rightClick = null,
                       keyboardType = 'default',
                       type = 'text',
                       error = false,
                       placeholder = '',
                       returnKeyType='done',
                       onSubmitEditing
                     }) => {
  return (
    <Item style={[styles.input_wrap, error ? styles.input_err : {}, containerStyle]}>
      {left_icon
        ?
        Icons[left_icon](24, Colors.border)
        :
        null
      }
      <TextInput
        multiline={multiline}
        autoFocus={autoFocus}
        ref={setRef}
        onBlur={onBlur || (() => {})}
        onFocus={onFocus || (() => {})}
        secureTextEntry={type === 'password'}
        style={[Styles.input, styles.input, type === 'password' && value?.length > 1 ? styles.password : {}, style]}
        keyboardType={keyboardType}
        type={type}
        placeholderTextColor={'rgba(255, 255, 255, 0.5)'}
        onChangeText={onChange}
        value={value}
        placeholder={placeholder}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
      />
      {right_icon
        ?
        rightClick
          ?
          <TouchableOpacity onPress={rightClick} hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
            {Icons[right_icon](24, '#ffffff')}
          </TouchableOpacity>
          :
          Icons[right_icon](24, '#ffffff')
        :
        null
      }
    </Item>
  );
};

const styles = StyleSheet.create({
  input_wrap: {
    left: 0,
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginLeft: 0,
  },

  input: {
    paddingLeft: 16,
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 0,
    paddingVertical: 4,
  },
  input_err: {
    borderColor: Colors.thirdColor,
  },
  password: {
    letterSpacing: 4,
  },
});

export default CustomInput;