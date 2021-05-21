import React, {useState, useRef} from 'react';
import {Linking, Platform, StyleSheet, TouchableWithoutFeedback, ScrollView} from 'react-native';
import {withNavigation} from 'react-navigation';
import {View, Text, Form} from 'native-base';
import Styles from "../../constants/Styles";
import CustomInput from "../../components/elements/CustomInput";
import CustomBtn from "../../components/elements/CustomBtn";
import {inject, observer} from "mobx-react";
import {toast, translate} from "../../utils";
import CustomCheckbox from "../../components/elements/CustomCheckbox";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import SocialRegister from "./SocialRegister";

const RegisterContainer = inject("userStore")(observer(({userStore, loading, socialSubmit}) => {
  const _scrollView = useRef(null);
  const [show_pass, setShowPass] = useState(false);
  const [values, setValues] = useState({name: '', email: '', password: '', discord: ''});
  const [error, setError] = useState({name: false, email: false, password: false, discord: false});
  const [checkbox, setCheckbox] = useState(false);
  const [checkbox_err, setCheckboxErr] = useState(false);
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

  const registerScroll = () => {
    _scrollView?.current?.scrollToEnd()
  };

  const handleSubmit = async () => {
    if(Platform.OS === 'ios' && !checkbox) {
      registerScroll();
      return setCheckboxErr(true);
    }
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
    let res = false;
    try {
      res = await userStore.registration(values);
    } catch (e) {
    }
    if (!res) {
      setBtnLoading(false);
    }
  };

  const landLink = (type) => () => {
    const url = `https://lp.imbaesports.app/${type}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        toast("Don't know how to open URI: " + url);
      }
    });
  };

  const changeCheckbox = () => {
    setCheckboxErr(false);
    setCheckbox(!checkbox);
  };
  return (
    <ScrollView
        ref={_scrollView}
        style={{width: Layout.window.width}}>
      <View style={{paddingTop: 32}}><Text style={[Styles.title, styles.text_center]}>{translate('REGISTRATION')}</Text></View>
      <View><Text style={[Styles.text, styles.sub_title]}>{translate('REGISTRATION_TEXT')}</Text></View>
      <Form style={styles.container}>
        <View style={styles.formItem}>
          <CustomInput
            placeholder={translate('Name')}
            error={error.name}
            left_icon={'user'}
            value={values.name}
            onChange={handleChange('name')}
          />
        </View>
        <View style={styles.formItem}>
          <CustomInput
            placeholder={'E-mail'}
            error={error.email}
            left_icon={'email'}
            value={values.email}
            keyboardType='email-address'
            onChange={handleChange('email')}
          />
        </View>
        <View style={styles.formItem}>
          <CustomInput
            placeholder={'Discord'}
            error={error.discord}
            left_icon={'discord'}
            value={values.discord}
            onChange={handleChange('discord')}
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
            onChange={handleChange('password')}
            onSubmitEditing={handleSubmit}
            returnKeyType='go'
          />
        </View>
        <CustomBtn title={translate('Next')} width={247} wrap_style={{paddingTop: 60}} onPress={handleSubmit}
                   loading={btn_loading || loading}/>
      </Form>
      <SocialRegister socialSubmit={socialSubmit} title={translate('REGISTER_WITH_HELP')}/>
      {Platform.OS === 'ios'
        ?
        <View style={styles.bottom}>
          <TouchableWithoutFeedback onPress={changeCheckbox} hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
            <View>
              <CustomCheckbox checked={checkbox} error={checkbox_err}/>
            </View>
          </TouchableWithoutFeedback>
          <Text style={[styles.bottom_text]}>
            <Text style={[Styles.text_muted, styles.land_text]}>{translate('REGISTER_TEXT_1')} </Text>
            <TouchableWithoutFeedback onPress={landLink('terms')}>
              <Text style={[Styles.text_muted, styles.land_link]}>{translate('REGISTER_TEXT_2')}</Text>
            </TouchableWithoutFeedback>
            <Text style={[Styles.text_muted, styles.land_text]}> {translate('REGISTER_TEXT_3')} </Text>
            <TouchableWithoutFeedback onPress={landLink('policy')}>
              <Text style={[Styles.text_muted, styles.land_link]}>{translate('REGISTER_TEXT_4')}</Text>
            </TouchableWithoutFeedback>
          </Text>
        </View>
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
    alignSelf: 'center',
    // marginBottom: 24,
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
    maxWidth: 256,
    alignSelf: 'center'
  },
  bottom: {
    flexDirection: 'row',
    paddingHorizontal: 40,
    maxWidth: 550,
    paddingTop: 8,
    paddingBottom: 16
  },
  bottom_text: {
    flex: 1,
    flexDirection: 'row',
    textAlign: 'left',
    paddingLeft: 16
  },
  land_link: {
    color: Colors.secondColor,
  }
});


export default withNavigation(RegisterContainer);
