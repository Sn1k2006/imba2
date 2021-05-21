import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {withNavigation} from 'react-navigation';
import {View, Text, Form} from 'native-base';
import Styles from "../../constants/Styles";
import CustomInput from "../../components/elements/CustomInput";
import CustomBtn from "../../components/elements/CustomBtn";
import {toast, translate} from "../../utils";
import {recoverySendPin} from "../../actions/auth";

const PinCodeContainer = ({navigation}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [btn_loading, setBtnLoading] = useState(false);

  const handleChange = (e) => {
    if (error) setError(false);
    setCode(e);
  };
  const handleSubmit = async () => {
    if (!code) return setError(true);
    setBtnLoading(true);
    try {
      const email = await navigation.getParam('email');
      await recoverySendPin(email, code);
      handleRoute();
    } catch (e) {
      toast(e.message, 'danger', false);
    }
    setBtnLoading(false);
  };
  const handleRoute = () => {
    navigation.replace('NewPassword');
  };
  return (
    <>
      <View style={{paddingTop: 32}}>
        <Text style={[Styles.title, styles.text_center]}>{translate('RECOVERY_PASSWORD')}</Text>
      </View>
      <View><Text style={[Styles.text, styles.sub_title]}>{translate('Enter_code')}</Text></View>
      <Form style={styles.container}>
        <View style={styles.formItem}>
          <CustomInput
            autoFocus
            error={error}
            left_icon={'key'}
            value={code}
            keyboardType={'phone-pad'}
            autoCapitalize={'none'}
            onChange={handleChange}
          />
        </View>
        <CustomBtn
          disabled={!code}
          title={translate('Next')}
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

export default withNavigation(PinCodeContainer);
