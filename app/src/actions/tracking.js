import {Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {YandexMetrica} from 'react-native-appmetrica-yandex';
import {getTrackingStatus, requestTrackingPermission} from 'react-native-tracking-transparency';
import {getTarget} from './target';

export const initTracking = async () => {
  const checkV = await checkIosVersion();
  const trackingStatus = await getTrackingStatus();
  if (checkV && trackingStatus === 'not-determined') {
    await requestTrackingPermission();
  }
  YandexMetrica.activateWithApiKey('cbb8f4d7-c467-4a0c-b2ac-1c234d0869ed');
  await getTarget();
}

const checkIosVersion = async () => {
  const version = DeviceInfo.getSystemVersion().split('.');
  return Platform.OS === 'ios' && Number(version[0]) >= 14;
}
