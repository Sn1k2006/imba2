import * as RNIap from 'react-native-iap';
import {Platform} from 'react-native';
import {api, toast} from "../utils";


export const initPurchase = async () => {
  try {
    await RNIap.initConnection();
  } catch (err) {
    console.warn(err);
  }
};

export const getPurchases = async (items) => {
  try {
    // const items = ['imba_solo', 'imba_group_product'];
    let products = await RNIap.getProducts(items);
    console.log('PRODUCTS', products);
    if (Platform.OS === 'android') {
      const subscribes = await RNIap.getSubscriptions(items);
      products = [...products, ...subscribes];
      console.log('SUBSCRIBES', subscribes);
    }
    return products;
  } catch (err) {
    console.warn(err);
  }
};

export const buyPurchase = async (productId, type = 'subscription') => {
  try {
    let result;
    if (type === 'subs') {
      result = await RNIap.requestSubscription(productId, false)
    } else {
      result = await RNIap.requestPurchase(productId, false)
    }
    return result;
  } catch (err) {
    console.warn(err);
  }
};

export const isSubscribed = async (available_purchase) => {
  try {
    const res = await api('/users/is_subscribed', {data: available_purchase, platform: Platform.OS}, 'POST');
    return res.data;
  } catch (err) {
    console.warn(err);
  }
};

export const errorPurchase = async (error) => {
  try {
    await api('/users/subscribe_fail', error, 'POST');
  } catch (err) {
    toast(err.message, 'danger', true);
  }
};
