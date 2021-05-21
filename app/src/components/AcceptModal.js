import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text} from 'native-base';
import CustomModal from "./elements/CustomModal";
import CustomBtn from "./elements/CustomBtn";
import Colors from "../constants/Colors";
import Styles from "../constants/Styles";
import {translate} from "../utils";

const AcceptModal = ({visible, onClose, onOk , text = '', btn_text = 'Ok'}) => {
    return (
      <CustomModal
        close_btn={false}
        visible={visible}
        onClose={onClose}
        contentStyle={{paddingTop: 24}}
        dark>
        <Text style={[Styles.input, {textAlign: 'center'}]}>{text}</Text>
        <CustomBtn title={btn_text} onPress={onOk} wrap_style={{marginTop: 24}} full/>
        <View style={{alignSelf: 'center'}}>
        <TouchableOpacity
          style={{flex: 0}}
          hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
          onPress={onClose}>
          <Text style={[styles.close, {flex: 0, marginTop: 24}]}>{translate('Cancel')}</Text>
        </TouchableOpacity>
        </View>
      </CustomModal>
    );
};

const styles = StyleSheet.create({
  close: {
    fontSize: 17,
    lineHeight: 28,
    color: Colors.tintColor,
  }
});

export default AcceptModal;