import React from 'react';
import {Icon, Text, View} from "native-base";
import Styles from "../../constants/Styles";
import {translate} from "../../utils";
import {Platform, StyleSheet, TouchableOpacity} from "react-native";
import {AppleButton} from "@invertase/react-native-apple-authentication";
import {loginFB} from "../../actions/facebook";
import {loginGoogle} from "../../actions/google";
import {loginApple} from "../../actions/apple";
import Colors from "../../constants/Colors";

const SocialRegister = ({socialSubmit, title}) => {
  const handleSocialClick = (type) => async () => {
    let userInfo;
    if (type === 'facebook') {
      userInfo = await loginFB();
    } else if (type === 'google') {
      userInfo = await loginGoogle();
    } else if (type === 'apple') {
      userInfo = await loginApple();
    }
    if (userInfo) {
      await socialSubmit({...userInfo, type})
    }
  };

  return (
    <View style={{paddingVertical: 32}}>
      <Text style={[Styles.text_muted, styles.text_center]}>{title || translate('LOGIN_WITH_HELP')}</Text>
      <View style={styles.soc_wrap}>
        <TouchableOpacity style={styles.soc_item} onPress={handleSocialClick('google')}>
          <Icon type='FontAwesome' name='google' style={styles.soc_icon}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.soc_item} onPress={handleSocialClick('facebook')}>
          <Icon type='FontAwesome' name='facebook-f' style={styles.soc_icon}/>
        </TouchableOpacity>
      </View>
      {Platform.OS === 'ios'
        ?
        <View style={{alignItems: 'center', paddingTop: 16, flex: 1}}>
          <AppleButton
            buttonStyle={AppleButton.Style.WHITE}
            buttonType={AppleButton.Type.SIGN_IN}
            style={{
              width: 160,
              height: 40,
            }}
            onPress={handleSocialClick('apple')}/>
        </View>
        :
        null
      }
    </View>
  );
};


const styles = StyleSheet.create({
  soc_wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24
  },
  text_center: {
    textAlign: 'center'
  },
  soc_item: {
    width: 56,
    height: 56,
    // borderRadius: 112,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8
  },
  soc_icon: {
    color: Colors.text,
    fontSize: 28
  },
});


export default SocialRegister;
