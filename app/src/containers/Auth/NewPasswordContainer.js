import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {withNavigation} from 'react-navigation';
import {View, Text, Form} from 'native-base';
import Styles from "../../constants/Styles";
import CustomInput from "../../components/elements/CustomInput";
import CustomBtn from "../../components/elements/CustomBtn";
import {toast, translate} from "../../utils";

const NewPasswordContainer = ({userStore}) => {
  const [show_pass, setShowPass] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [btn_loading, setBtnLoading] = useState(false);

  const toggleEye = () => {
    setShowPass(!show_pass);
  };
  const handleChange = (e) => {
    if (error) setError(false);
    setPassword(e);
  };
  const handleSubmit = async () => {
    if (!password) return setError(true);
    setBtnLoading(true);
    try {
      let user = await userStore.updateUser({password});
      await userStore.logIn({password, email: user.email});
    } catch (e) {
      toast(e.message, 'danger', true);
      setBtnLoading(false);
    }
  };

  return (
    <>
      <View style={{paddingTop: 32}}>
        <Text style={[Styles.title, styles.text_center]}>{translate('RECOVERY_PASSWORD')}</Text>
      </View>
      <View>
        <Text style={[Styles.text, styles.sub_title]}>{translate('ENTER_NEW_PASSWORD')}</Text>
      </View>
      <Form style={styles.container}>
        <View style={styles.formItem}>
          <CustomInput
            placeholder={translate('Password')}
            error={error}
            left_icon={'pass_lock'}
            right_icon={show_pass ? 'eye' : 'eye_off'}
            type={show_pass ? 'text' : 'password'}
            rightClick={toggleEye}
            autoCapitalize={'none'}
            value={password}
            onChange={handleChange}
          />
        </View>
        <CustomBtn
          disabled={!password}
          title={translate('Login')}
          width={247}
          wrap_style={{paddingTop: 60}}
          onPress={handleSubmit}
          loading={btn_loading}
        />
      </Form>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    maxWidth: 550,
    paddingHorizontal: 40,
    alignSelf: 'center',
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
    maxWidth: 237,
    alignSelf: 'center'
  },
});

export default withNavigation(NewPasswordContainer);