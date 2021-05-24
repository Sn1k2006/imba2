import AsyncStorage from '@react-native-community/async-storage';
import {messaging, notifications} from "react-native-firebase";
import {api} from "../utils";
import {getBundleId} from "react-native-device-info";
import {Platform} from "react-native";

export const firebaseInitialization = async () => {
  const fcm = await messaging().getToken() || null;
  console.log('FCM:   ',fcm)
  await AsyncStorage.setItem('fcm', fcm);
  return fcm;
};

export const notification = async (message) => {
  console.log(message);
  if(message?.data?.type) check();
  if(message?.data?.notification) {
    const notification = new notifications.Notification();
    notification
      .setTitle(message.data.title)
      .setBody(message.data.body)
      .setData(message.data)
      //.setSound('default')
      .android.setVibrate([300])
      .android.setChannelId('main_channel')
      .android.setSmallIcon('@mipmap/ic_notification');
    if(message.data.image) notification.android.setBigPicture(message.data.image);
    if(message.data.icon) notification.android.setLargeIcon(message.data.icon);
    await notifications().displayNotification(notification);
    return notification;
  }
};

const check = async () => {
  const bundle_id = getBundleId();
  const platform = Platform.OS;
  await api('/users/active', {bundle_id, platform}, 'POST');
};
