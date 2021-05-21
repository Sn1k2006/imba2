import { Dimensions } from 'react-native';
import {observable, action} from 'mobx';

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

class Layout {
  @observable maxWidth = 600;
  @observable window = {
    width,
    height,
  };
  @observable isSmallDevice =  this.window.width < 360;
  @observable isIpad =  this.window.width > 998;


  @action _orientationDidChange = (e) => {
    this.window.width = e.window.width;
    this.window.height = e.window.height;
  };
}

export default new Layout();


