import AsyncStorage from '@react-native-community/async-storage';
import {analytics, messaging, notifications} from 'react-native-firebase';
import {AppEventsLogger} from 'react-native-fbsdk';
import ReactNativeAppsFlyer from 'react-native-appsflyer';
import {YandexMetrica} from 'react-native-appmetrica-yandex';
import notifee from '@notifee/react-native';


export const firebaseInitialization = async () => {
  let fcm;
  await notifee.requestPermission();


  fcm = (await messaging().getToken()) || '';
  await AsyncStorage.setItem('fcm', fcm);
  return fcm;
}


export const initNotification = async (handleClick) => {
  const enabled = await messaging().hasPermission();
  if (enabled) {
    notifications().onNotificationOpened(handleClick);
    // messaging().getInitialNotification().then(handleClick);
    // messaging().onNotificationOpened(handleClick);
    // messaging().onMessage(notificationLog);
    // messaging().setBackgroundMessageHandler(notificationLog);
  } else {
    setTimeout(() => messaging().requestPermission().then(() => initNotification(handleClick)), 30000);
  }
}

export async function logEvent(name = '', params = {}) {
  await analytics().logEvent(name, params);
}

export const notificationLog = async () => {
  const data = message.data;
  if (data?.tasks) {
    const tasks = JSON.parse(data.tasks);
    if (tasks.Facebook) {
      AppEventsLogger.logEvent(tasks.Facebook.name, tasks.Facebook.params);
    }
    if (tasks.AppsFlyer) {
      await ReactNativeAppsFlyer.logEvent(
        tasks.AppsFlyer.name,
        tasks.AppsFlyer.params,
      );
    }

    if (tasks.Firebase) {
      switch (tasks.Firebase.name) {
        case 'in_app_purchase':
          await analytics().logPurchase(tasks.Firebase.params || {});
          break;
        case 'sign_up':
          await analytics().logSignUp(tasks.Firebase.params || {});
          break;
        default:
          await analytics().logEvent(
            tasks.Firebase.name,
            tasks.Firebase.params || {},
          );
      }
    }

    if (tasks.AppMetrica) {
      YandexMetrica.reportEvent(tasks.AppMetrica.name, tasks.AppMetrica.params);
    }
  }
};
