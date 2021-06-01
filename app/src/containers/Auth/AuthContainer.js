import React, {useState} from 'react';
import {Linking, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Platform, ScrollView} from 'react-native';
import {withNavigation} from 'react-navigation';
import {View, Text, Form} from 'native-base';
import CustomInput from "../../components/elements/CustomInput";
import CustomBtn from "../../components/elements/CustomBtn";
import Styles from "../../constants/Styles";
import Colors from "../../constants/Colors";
import {toast, translate} from "../../utils";
import {inject, observer} from "mobx-react";
import Layout from "../../constants/Layout";
import SocialRegister from "./SocialRegister";

const AuthContainer = inject("userStore", 'appStore')(observer(({navigation, userStore, socialSubmit, loading}) => {
  const [show_pass, setShowPass] = useState(false);
  const [values, setValues] = useState({email: '', password: ''});
  const [error, setError] = useState({email: false, password: false});
  const [btn_loading, setBtnLoading] = useState(false);

  const toggleEye = () => {
    setShowPass(!show_pass);
  };
  const handleChange = (name) => (e) => {
    if (error[name]) setError(state => {
      return {...state, [name]: false}
    });
    setValues(state => {
      return {...state, [name]: e}
    })
  };
  const handleSubmit = async () => {
    let isErr = false;
    Object.keys(values).map(v => {
      if (!values[v]) {
        isErr = true;
        setError(state => {
          return {...state, [v]: true}
        });
      }
    });
    if (isErr) return false;
    setBtnLoading(true);
    try {
      await userStore.logIn(values);
    } catch (e) {
      toast(e.message, 'danger');
    }
    setBtnLoading(false);
  };

  const handleRoute = () => {
    navigation.navigate('Recovery')
  };
  const landLink = (type) => () => {
    const url = `https://esports-masters${Platform.OS === 'android' ? '-2021' : ''}.flycricket.io/${type}.html`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        toast("Don't know how to open URI: " + url);
      }
    });
  };

  return (
    <ScrollView style={{width: Layout.window.width}}>
      <View style={{paddingTop: 32}}><Text style={[Styles.title, styles.text_center]}>{translate('Login')}</Text></View>
      <View><Text style={[Styles.text, styles.sub_title]}>{translate('AUTH_TEXT')}</Text></View>
      <Form style={styles.container}>
        <View style={styles.formItem}>
          <CustomInput
            placeholder={'Email'}
            error={error.email}
            left_icon={'email'}
            value={values.email}
            keyboardType='email-address'
            onChange={handleChange('email')}
          />
        </View>
        <View style={styles.formItem}>
          <CustomInput
            placeholder={translate('Password')}
            error={error.password}
            left_icon={'pass_lock'}
            value={values.password}
            right_icon={show_pass ? 'eye' : 'eye_off'}
            type={show_pass ? 'text' : 'password'}
            rightClick={toggleEye}
            returnKeyType='go'
            onChange={handleChange('password')}
            onSubmitEditing={handleSubmit}
          />
        </View>
        <TouchableOpacity onPress={handleRoute} hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
                          style={{flex: 0, alignSelf: 'flex-end'}}>
          <Text style={[Styles.small_text, styles.forgot_text]}>{translate('Forgot_password')}</Text>
        </TouchableOpacity>
        <CustomBtn title={translate('Enter')} width={247} wrap_style={{paddingTop: 40}} onPress={handleSubmit}
                   loading={btn_loading || loading}/>
      </Form>

      <SocialRegister socialSubmit={socialSubmit}/>

      {Platform.OS === 'ios'
        ?
        <Text style={styles.land_links}>
          <Text style={[Styles.text_muted, styles.land_text]}>{translate('POLICY_AND_TERMS_1')} </Text>
          <TouchableWithoutFeedback onPress={landLink('privacy')}>
            <Text style={[Styles.text_muted, styles.land_link]}>{translate('POLICY_AND_TERMS_2')}</Text>
          </TouchableWithoutFeedback>
          <Text style={[Styles.text_muted, styles.land_text]}> {translate('POLICY_AND_TERMS_3')} </Text>
          <TouchableWithoutFeedback onPress={landLink('terms')}>
            <Text style={[Styles.text_muted, styles.land_link]}>{translate('POLICY_AND_TERMS_4')}</Text>
          </TouchableWithoutFeedback>
        </Text>
        :
        null
      }
    </ScrollView>
  );

}));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    maxWidth: 550,
    paddingHorizontal: 40,
    alignSelf: 'center'
  },
  formItem: {
    paddingTop: 24,
    width: '100%'
  },
  text_center: {
    textAlign: 'center'
  },
  sub_title: {
    paddingTop: 16,
    paddingBottom: 24,
    textAlign: 'center',
    maxWidth: 161,
    alignSelf: 'center'
  },
  forgot_text: {
    color: Colors.tintColor,
    textAlign: 'right',
    paddingTop: 8,
  },
  land_links: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    textAlign: 'center',
    paddingBottom: 24
  },
  land_link: {
    color: Colors.secondColor,
  }
});

export default withNavigation(AuthContainer);
