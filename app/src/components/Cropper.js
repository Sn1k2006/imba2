import ImagePicker from 'react-native-image-crop-picker';
import {api, getDeviceLocale, endpoint} from '../utils';
import Colors from "../constants/Colors";
import AsyncStorage from "@react-native-community/async-storage";
import RNFetchBlob from 'react-native-fetch-blob'
import {getBundleId} from "react-native-device-info";

export default class Cropper {
  static params = {
    cropperToolbarTitle: "",
    width: 256,
    height: 256,
    cropperToolbarColor: Colors.tintColor,
    cropperActiveWidgetColor: Colors.tintColor,
    cropperStatusBarColor: Colors.tintColor,
    includeBase64: true,
    mediaType: "photo",
    cropping: true,
  };

  static async gallery(props = {}) {
    try {
      let image = await ImagePicker.openPicker(Object.assign({...Cropper.params}, props));
      let name = image.path.split('/').pop();
      const response = await api('/upload', {file: {name: name, data: 'data:image/png;base64,' + image.data}});
      return response.result;
    } catch (e) {

      return null;
    }
  }

  static async camera(props = {}) {
    try {
      let image = await ImagePicker.openCamera(Object.assign({...Cropper.params}, props));
      let name = image.path.split('/').pop();
      const response = await api('/upload', {file: {name: name, data: 'data:image/png;base64,' + image.data}});
      return response.result;
    } catch (e) {
      return null;
    }
  }

  static async multiGet(startLoading) {
    try {
      let files = await ImagePicker.openPicker({multiple: true, includeBase64: true});
      let bundleId = getBundleId();
      let res = [];
      if(startLoading) startLoading()
      files.map((item, i) => {
        let file = {
          name: item.path.split('/').pop().replace(bundleId, ''),
          data: RNFetchBlob.wrap(item.path),
          filename: item.path.split('/').pop().replace(bundleId, ''),
          type: item.mime
        };
        return res.push(file);
      });
      const asyncStore = await AsyncStorage.multiGet(["token", 'ln']);
      let token = asyncStore[0][1];
      let lang = asyncStore[1][1] || getDeviceLocale();
      let url = `${endpoint}/files?token=${token}&lang=${lang}`;
      let response = await RNFetchBlob.fetch('POST', url,
        {'Content-Type': 'multipart/form-data'}, res);
      let responseJson = await response.json();
      return responseJson.data;
    } catch (e) {
      return null;
    }
  }
}
