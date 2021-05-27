import React, {Component} from 'react';
import {
  StyleSheet,
  Modal as NativeModal,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  StatusBar

} from 'react-native';
import {View, Root, Text} from 'native-base';
import Colors from "../../constants/Colors";
import {observer} from "mobx-react";
import Icons from "../Icons";
import Styles from "../../constants/Styles";
import CustomBtn from "./CustomBtn";
import {translate} from "../../utils";

@observer
class CustomModal extends Component {


  hideKeyboard = () => {
    Keyboard.dismiss();
  };

  render() {
    const {
      visible = false,
      onClose,
      animationType = 'slide',
      dark = false,
      close_btn = true,
      right_icon,
      rightIconClick,
      right_icon_size = 32,
      left_icon,
      leftIconClick,
      left_icon_size = 32,
      accept,
      onAcceptOk,
      accept_text,
      onCloseAccept,
      accept_btn_text,
      gradient,
    } = this.props;
    return (
      <NativeModal
        animationType={dark ? 'fade' : animationType}
        transparent={true}
        visible={Boolean(visible)}
        onRequestClose={onClose}
      >
        <Root>
          <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps={'always'} alwaysBounceVertical={false}>
            <View style={{flex: 1, height: '100%'}}>

              <TouchableWithoutFeedback onPress={onClose}>
                <View style={[styles.container, dark ? styles.dark : {}]}>

                  <TouchableWithoutFeedback onPress={this.hideKeyboard}>
                    <View style={[styles.content, this.props.contentStyle || {}, accept ? {paddingTop: 24} : {}]}>
                      {right_icon && !accept
                        ?

                        <TouchableWithoutFeedback
                        hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
                        onPress={rightIconClick}>
                        <View style={styles.closeWrap}>
                        {Icons[right_icon](right_icon_size, '#fff')}
                        </View>
                        </TouchableWithoutFeedback>
                        :
                        null
                      }
                      {left_icon && !accept
                        ?
                        <TouchableWithoutFeedback
                          hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
                          onPress={leftIconClick}>
                          <View style={styles.backWrap}>
                            {Icons[left_icon](left_icon_size, '#fff')}
                          </View>
                        </TouchableWithoutFeedback>
                        :
                        null
                      }
                      {
                        accept
                          ?
                          <View>
                            <Text style={[Styles.input, {textAlign: 'center'}]}>{accept_text}</Text>
                            <CustomBtn title={accept_btn_text} onPress={onAcceptOk} wrap_style={{marginTop: 24}} full/>
                            <View style={{alignSelf: 'center', marginTop: 24}}>
                              <TouchableOpacity
                                style={{flex: 0}}
                                hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
                                onPress={onCloseAccept}>
                                <Text style={[styles.close_accept, {flex: 0}]}>{translate('Cancel')}</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          :
                          this.props.children
                      }
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </ScrollView>

        </Root>
      </NativeModal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  dark: {
    backgroundColor: '#00000080',
  },
  content: {
    flex: 0,
    paddingTop: 40,
    paddingHorizontal: 32,
    paddingBottom: 24,
    backgroundColor: Colors.second_bg,
    overflow: 'hidden',
    position: 'relative',
    width: 295,
    maxWidth: '100%',
  },
  closeWrap: {
    position: 'absolute',
    right: 16,
    top: 24,
  },
  backWrap: {
    position: 'absolute',
    left: 16,
    top: 24,
  },
  close: {
    fontSize: 24,
    color: Colors.text_muted
  },
  close_accept: {
    fontSize: 17,
    lineHeight: 20,
    color: Colors.tintColor,
  }
});

export default CustomModal;
