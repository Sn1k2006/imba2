import {Platform, NativeModules, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {observable, action} from 'mobx';

import UserStore from "./UserStore";
import {api, toast} from "../utils";
import {getBundleId} from "react-native-device-info";
import {getPurchases, initPurchase} from "../actions/inAppPurchase";
import RNExitApp from "react-native-exit-app";

class AppStore {
  ping_interval = null;
  @observable connection = true;
  @observable ready = false;
  @observable app_info = null;
  @observable translations = null;
  @observable languages = null; // Объект {
                                //          ru : {name: "Russian", native: "Русский", rus: "Русский"}
                                //          en : {name: "English", native: "English", rus: "Английский"}
                                //        }
  @observable lang = null; // Объект {name: "Russian", native: "Русский", rus: "Русский"}
  @observable ln = null; // Строка 'ru'
  @observable is_auth = false;
  @observable subscribed = false;
  @observable products = null;
  @observable hide_products = null;

  @action init = async () => {
    try {
      await this.getLangs();
      let user = await UserStore.get();
      if (user) {
        this.is_auth = true;
      }
    } catch (e) {
    }
    this.ping();
    if (!this.translations) return Alert.alert('Что-то пошло не так', 'Попробуйте перезагрузить приложение',
      [{text: 'Exit', onPress: () => RNExitApp.exitApp()}],
      {cancelable: false}
    );
    this.ready = true;
    await this.inAppPurchase(true);
  };

  @action getLangs = async () => {
    try {
      const bundle_id = getBundleId();
      const res = await api('/langs', {bundle_id}, 'GET', true);
      this.languages = res.data;
      const ln = await AsyncStorage.getItem('ln') || null;
      await this.setLang(ln);
    } catch (e) {
      toast(e.message);
    }
  };

  @action setLang = async (lang) => {
    if (!this.app_info) await this.getAppInfo();
    const default_lang = this.app_info?.default_lang || 'ru';
    if (!lang) {
      let locale = Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale
        : NativeModules.I18nManager.localeIdentifier;
      lang = locale ? locale.split('_')[0] : 'ru';
    }
    this.lang = this.languages?.[lang] || this.languages?.[default_lang] || {
      rus: "Русский",
      name: "Russian",
      native: "Русский"
    };
    lang = this.languages?.[lang] ? lang : 'ru';
    this.ln = lang;
    await AsyncStorage.setItem('ln', lang);
    await this.getTranslates(lang, true);
    if (UserStore?.user?.lang !== lang) {
      await UserStore.updateUser({lang}, true);
    }
    if (lang !== this.app_info?.default_lang) {
      this.getAppInfo();
    }
  };

  @action getTranslates = async (lang, silent = false) => {
    try {
      this.translations = await api('/translates', {lang}, 'GET', silent);
    } catch (e) {
      toast(e.message);
    }
  };

  @action getAppInfo = async () => {
    try {
      const bundle_id = getBundleId();
      const res = await api('/app', {bundle_id}, 'GET', true);
      this.app_info = res.data;
      this.subscribed = res.data?.subscribe_status;
    } catch (e) {
      toast(e.message);
    }
  };


  @action setSubscribed = (value) => {
    this.subscribed = Boolean(value);
  };

  @action inAppPurchase = async (init = false) => {
    const products_idx = [];
    this.app_info.products.forEach(item => products_idx.push(item.id));
    if (init) {
      await initPurchase();
    }
    let products = [];
    let hide_products = [];
    let all_products = await getPurchases(products_idx) || [];
    all_products?.map(prod => {
      if (prod.productId.includes('light')) {
        return hide_products.push(prod);
      } else {
        if(Platform.OS === 'ios') {
          prod.type = 'subs';
          if(prod.productId.includes('product')) {
            prod.type = 'inapp'
          }
        }
        return products.push(prod);
      }
    });
    this.products = products;
    this.hide_products = hide_products;
  };

  @action ping = () => {
      this.ping_interval = setInterval(async () => {
        try {
        await this.getAppInfo();
        await UserStore.get();
        } catch (e) {
          if (e.code === 401) {
            this.is_auth = false;
            this.clearPing();
          }
        }
      }, 60000)

  };

  clearPing = () => {
    clearInterval(this.ping_interval);
    this.ping_interval = null;
  }
}


export default new AppStore();

