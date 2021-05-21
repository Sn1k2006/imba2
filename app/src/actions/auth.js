import {api, getRegisterDeviceInfo} from "../utils";
import AsyncStorage from '@react-native-community/async-storage';
import {getBundleId} from "react-native-device-info";

export const getUser = async () => {
  try {
    return await api('/users', {}, 'GET');
  } catch (e) {
    throw e;
  }
};
export const registerUser = async (user) => {
  try {
    const info = await getRegisterDeviceInfo();
    const res = await api('/users/registration', {...user, ...info}, 'POST');
    await AsyncStorage.setItem('token', res.data.token);
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const socialRegister = async (user) => {
  try {
    const info = await getRegisterDeviceInfo();
    const res = await api('/users/social', {...user, ...info}, 'POST');
    if(!res.data.discord) throw {code: 322, user: res.data, userInfo: user}
    await AsyncStorage.setItem('token', res.data.token);
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const loginUser = async (user) => {
  const bundle_id = getBundleId();
  try {
    const res = await api('/users/login', {...user, bundle_id}, 'POST');
    await AsyncStorage.setItem('token', res.data.token);
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const changeUserPass = async (old_password, new_password) => {
  try {
    await api('/users/password', {old_password, new_password}, 'POST');
  } catch (e) {
    throw e;
  }
};

export const recoveryEmail = async (email) => {
  const bundle_id = getBundleId();
  try {
    await api('/users/recover', {email, bundle_id}, 'POST');
  } catch (e) {
    throw e;
  }
};
export const recoverySendPin = async (email, pin) => {
  const bundle_id = getBundleId();
  try {
    let res = await api('/users/check', {email, pin, bundle_id}, 'POST');
    await AsyncStorage.setItem('token', res.data.token);
    return res.data;
  } catch (e) {
    throw e;
  }
};





