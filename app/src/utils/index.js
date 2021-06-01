import {Toast} from 'native-base';
import {Vibration, Platform, NativeModules} from 'react-native';
import {Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AppStore from "../store/AppStore";
import {StackActions} from "react-navigation";
import {getBundleId, getUniqueId,} from "react-native-device-info";
import firebase from 'react-native-firebase';
import moment from "moment";
import {getTimeZone} from "react-native-localize";

let Analytics = firebase.analytics();


export const endpoint = "https://api.adcourses.app/api/v1";
export const HOST = endpoint.replace('/api/v1', '/');

export function api(method, args = {}, type = 'POST', silent = false, URL = null) {
  return new Promise((resolve, reject) => {
    function processReject(error) {
      if (error?.code === 401) {
        // toast(error.message);
        // window.location.href('/');
      }
      if (!silent) reject(error);
      else resolve(false);
      throw error;
    }
    AsyncStorage.multiGet(["token", 'ln']).then((keys) => {
      let token = keys[0][1];
      let lang = 'ru' || keys[1][1] || getDeviceLocale();
      const bundle_id = getBundleId();
      let params = '';
      const constParams = `?token=${token}&lang=${lang}&bundle_id=${bundle_id}`
      if (type === 'GET') {
        Object.keys(args).map(key => {
          if (Array.isArray(args[key])) {
            args[key] = args[key].join(',');
          }
          params += `&${key}=${args[key]}`
        });
        method += `${constParams}${params}`;
      } else {
        method += constParams;
      }
      fetch(URL || (endpoint + method), {
        method: type,
        headers: {
          'Content-Type': 'application/json',
        },
        body: type !== 'GET' ? JSON.stringify(args) : null
      }).then(res => {
        console.log(type + ': ' + endpoint + method, args);
        res.json().then((data) => {
          console.log(data);
          if (data.hasOwnProperty('error')) processReject(data.error);
          else if (data) resolve(data);
          else processReject({message: 'Invalid Server Response', code: 2})
        }).catch((error) => {
          console.log(error);
          console.info('Error on request: ' + endpoint + method, args);
          processReject('Network Error');
          throw error;
        });
      }).catch((error) => {
        processReject(error);
      });
    });
  })
}

export const getUuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export function clearStackAndRoute(navigation, route) {
  navigation.dispatch(StackActions.popToTop());
  navigation.navigate(route);
}

export function getImageMaxSize(width, height, max_width, padding = 32) {
  if ((!width) || !height) return {};
  let screen_width = Dimensions.get('window').width;
  if (screen_width < width) {
    let koef = width / height;
    width = max_width && (screen_width - padding) > max_width ? max_width : (screen_width - padding);
    height = Math.floor(width / koef);
  }
  return {width, height}
}

export function toast(text = "", type = "danger", without_statusbar = false) {
  let start = Platform.OS === 'ios' ? 30 : without_statusbar ? 30 : 0;
  Toast.show({
    text: text,
    type: type,
    position: "top",
    duration: 2500,
    textStyle: {fontSize: 14},
    style: {zIndex: 9999, top: (start - 30)},
  });

  if (type !== "danger") return;

  setTimeout(() => {
    Vibration.vibrate(100);
  }, 100)
}

export function translate(word = '', key, data = null) {
  const {translations} = AppStore;
  if (!translations) return word;
  const check_word = word.toUpperCase();
  let str = '';
  if (key && translations[check_word]) {
    if (key === 'change') {
      str = translations[check_word].replace('$change$', data);
    } else if (key === 'purchase') {
      str = translations[check_word].replace('$key1$', data.key1);
      str = str.replace('$key2$', data.key2);
    }
  } else {
    str = translations[check_word] || word;
  }
  return `${str}`;
}

export function getDeviceLocale() {
  let locale = '';
  if (Platform.OS === 'ios') {
    locale = NativeModules.SettingsManager.settings.AppleLocale
  } else {
    locale = NativeModules.I18nManager.localeIdentifier
  }
  return locale ? locale.split('_')[0] : 'en';
}


export const addHostToPath = (image) => {
  if (typeof image === 'string') {
    return HOST + image;
  } else {
    if (image && image.path) {
      return HOST + image?.path;
    }
    return '';
  }
};

export const convertSize = (size) => {
  if (!size) return '';
  return size / 1000 + 'kb'
};


export const getRegisterDeviceInfo = async () => {
  const bundle_id = getBundleId();
  const timezone = getTimeZone();
  const device_id = getUniqueId();
  const platform = Platform.OS;
  const async_storage = await AsyncStorage.multiGet(['fcm', 'target', 'ln']);
  const fcm = async_storage[0][1];
  const target = async_storage[1][1];
  const lang = async_storage[2][1];
  return {bundle_id, device_id, fcm, target, lang, platform, timezone}
};

export async function returnEntryEvent() {
  let last_entry = await AsyncStorage.getItem('last_entry');
  if (last_entry) {
    let date = moment.utc(last_entry).startOf('day');
    let now = moment().endOf('day');
    let diff = (now.diff(date, 'days'));
    if (diff) logEvent('return_after_interval')
  }
  let now = moment().format('YYYY-MM-DD');
  AsyncStorage.setItem('last_entry', now);
}

export function logEvent(name = '', params = {}) {
  Analytics.logEvent(name, params);
}

export const renderSubTitle = (sub_title, type) => {
  if (!sub_title) return '';
  let str = sub_title;
  if (
    (type === 'material' && sub_title.toLowerCase() === 'материал') ||
    (type === 'checklist' && sub_title.toLowerCase() === 'чек-лист') ||
    (type === 'poll' && sub_title.toLowerCase() === 'опросник') ||
    (type === 'test' && sub_title.toLowerCase() === 'тест')
  ) {
    str = translate(type)
  }
  return str;
};
