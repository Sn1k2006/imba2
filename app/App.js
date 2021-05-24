import React, {Component} from 'react';
import {
  Alert,
  View,
  StatusBar, StyleSheet,
  Dimensions,
  AppState
} from 'react-native';
import {Root} from 'native-base';
import RNExitApp from 'react-native-exit-app';
import {Provider, observer} from 'mobx-react'
import AppStore from "./src/store/AppStore";
import UserStore from "./src/store/UserStore";
import {AppNavigator, AuthNavigator} from "./src/navigation/AppNavigation";
import NetInfo from '@react-native-community/netinfo';
import Colors from "./src/constants/Colors";
import Layout from "./src/constants/Layout";
import Orientation from 'react-native-orientation-locker';
import SplashScreen from 'react-native-splash-screen'
import {initNotification} from "./src/actions/firebase";
import NoInternet from "./src/components/NoInternet";
import {toJS} from "mobx";
import {goggleInit} from "./src/actions/google";
import {returnEntryEvent} from "./src/utils";
import {initTracking} from './src/actions/tracking';


const stores = {
  appStore: AppStore,
  userStore: UserStore,
};

@observer
class App extends Component {
  notificationOpenedListener;
  onMessageListener;
  onBackgroundMessageListener;
  started = false;

  state = {
    appState: AppState.currentState,
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
    Dimensions.removeEventListener('change', Layout._orientationDidChange);
    this.connection();
    AppStore.clearPing();
    this.onMessageListener && this.onMessageListener();
    this.onBackgroundMessageListener && this.onBackgroundMessageListener();
    this.notificationOpenedListener && this.notificationOpenedListener();
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {

    }
    this.setState({appState: nextAppState});
  };

  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    Orientation.lockToPortrait();
    Dimensions.addEventListener("change", Layout._orientationDidChange);
    this.connection = NetInfo.addEventListener(async state => {
      if (!this.started) {
        this.started = true;
        if (state.isConnected) {
          await this.init();
          await initNotification(this.notificationClick);
        } else {
          Alert.alert('Нет подключения к интернету', 'Попробуйте перезагрузить приложение',
            [{text: 'Exit', onPress: () => RNExitApp.exitApp()}],
            { cancelable: false }
          );
        }
      }
      AppStore.connection = state.isConnected;
    });
  }

  init = async () => {
    await returnEntryEvent();
    await goggleInit();
    await AppStore.init();
    StatusBar.setHidden(false, true);
    SplashScreen.hide();
    await initTracking();
  };

  notificationClick = (remoteMessage) => {
    console.log(111)
    if (remoteMessage?.data?.data) {

    }
  };

  render() {
    return (
      <Provider {...stores}>
        <Root>
          {
            AppStore.ready
              ?
              <View style={styles.container} forceInset={{top: 'always', bottom: 'always'}}>
                <StatusBar barStyle="light-content" translucent={false} hidden={false}
                           backgroundColor={Colors.bg}/>
                {AppStore.is_auth
                  ?
                  <AppNavigator ref="content"/>
                  :
                  <AuthNavigator/>
                }
              </View>
              :
              null
          }
          {!toJS(AppStore.connection) && toJS(AppStore.ready)
            ?
            <NoInternet visible={toJS(AppStore.connection)}/>
            : null
          }
        </Root>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.bg
  },
});

export default App;
