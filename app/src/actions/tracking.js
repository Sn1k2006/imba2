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
  YandexMetrica.activateWithApiKey('99ce17b3-9946-4bed-acd1-d9e5b9c89565');
  await getTarget();
}

const checkIosVersion = async () => {
  const version = DeviceInfo.getSystemVersion().split('.');
  return Platform.OS === 'ios' && Number(version[0]) >= 14;
}
