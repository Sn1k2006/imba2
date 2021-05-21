import {observable, action} from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';
import {api, logEvent, toast} from "../utils";
import AppStore from "./AppStore";
import {getUser, loginUser, registerUser, socialRegister} from "../actions/auth";

class UserStore {
  @observable user = null;

  @action get = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw false;
      const user = await getUser();
      AppStore.setSubscribed(Boolean(user.subscribed === 'sub'));
      this.user = user;
      return user;
    } catch (e) {
     throw e;
    }
  };
  @action updateUser = async (obj, silent = false) => {
    try {
      const res = await api('/users', obj, 'POST', silent);
      this.user = res.data;
      return res.data;
    } catch (e) {
      toast(e.message);
    }
  };
  @action updateUserObj = (user = {}) => {
    this.user = {...this.user, ...user}
  };

  @action registration = async (user) => {
    try {
      this.user = await registerUser(user);
      AppStore.is_auth = true;
      AppStore.setSubscribed(false);
      logEvent('registration', {type: 'email'});
      return true;
    } catch (e) {
      toast(e.message, 'danger');
    }
  };
  @action logIn = async (user, isSocial = false) => {
    try {
      if(isSocial) {
        let type = user.type;
        user = await socialRegister(user);
        if(!user.is_login) logEvent('registration', {type});
      } else {
        user = await loginUser(user);
      }
      const fcm = await AsyncStorage.getItem('fcm');
      if (user.fcm !== fcm) {
        await this.updateUser({fcm}, true);
      }
      this.user = user;
      AppStore.setSubscribed(Boolean(user.subscribed === 'sub'));
      AppStore.is_auth = true;
      await AppStore.setLang(user.lang);
    } catch (e) {
      throw e;
      // toast(e.message, 'danger', true);
    }
  };
  @action logOut = async () => {
    this.user = null;
    AppStore.is_auth = false;
    await api('/users/logout', {}, 'POST');
    await AsyncStorage.multiRemove(['token', 'active_course']);
  };
}

export default new UserStore();

