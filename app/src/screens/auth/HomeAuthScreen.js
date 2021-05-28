import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import {View} from 'native-base';
import Colors from '../../constants/Colors';
import CustomBtn from '../../components/elements/CustomBtn';
import {translate} from '../../utils';
import {inject, observer} from 'mobx-react';
import {FBLogout} from '../../actions/facebook';
import {signOutGoogle} from '../../actions/google';
import logo from '../../assets/images/logo.png';
import homeMan from '../../assets/images/homeMan.png';
import FastImage from 'react-native-fast-image';
import RadialGradient from 'react-native-radial-gradient';
import LinearGradient from 'react-native-linear-gradient';

@inject('appStore', 'userStore')
@observer
class HomeAuthScreen extends Component {

  route = (path, type) => () => {
    this.props.navigation.navigate(path, {type});
  };

  async componentDidMount() {
    StatusBar.setTranslucent(true);
    if (!this.props.userStore.user?.auth_type) {
      setTimeout(FBLogout, 2000);
      await signOutGoogle();
    }
  }

  render() {
    // const {app_info = {}} = this.props.appStore;
    return (
      <View style={[styles.container]}>
        <RadialGradient style={{width: 600, height: 600, position: 'absolute', top: -250, left: -250, opacity: 0.3}}
                        colors={[Colors.secondColor, Colors.second_bg + '00', Colors.second_bg + '00', Colors.second_bg + '00']}
                        stops={[0.1, 0.4, 0.3, 0.75]}
                        center={[300, 300]}
                        pointerEvents={'none'}
                        radius={740} />
        <SafeAreaView style={{flex: 1}}>
          {/*<StatusBar barStyle="light-content" translucent={false} hidden={false} backgroundColor={'transparent'}/>*/}
          <StatusBar translucent={true} hidden={false} backgroundColor={'transparent'} />
          <View style={styles.content}>
            <FastImage source={logo} style={styles.logo} />
            <View style={{flex: 1, height: '100%', width: '100%'}}>
              <View style={styles.bgWrap}>
                <FastImage source={homeMan} style={{width: '170%', height: '170%', position: 'absolute'}}
                           resizeMode={FastImage.resizeMode.contain} />
                <LinearGradient
                  style={{flex: 1, position: 'absolute', bottom: 0, left: 0, width: '100%', height: 150,}}
                  locations={[0, 0.9, 1]}
                  colors={[Colors.second_bg + '00', Colors.second_bg, Colors.second_bg]} />
              </View>
            </View>
          </View>
          <View style={styles.btn_wrap}>
            {/*<Text style={[Styles.text, styles.app_desc]}>{app_info?.description}</Text>*/}
            <CustomBtn title={translate('Enter')} width={200} onPress={this.route('Login', 'login')}
                       wrap_style={styles.btn_wrap} />
            <CustomBtn title={translate('Registration')} width={200} type={'outline'}
                       onPress={this.route('Login', 'register')}
                       wrap_style={styles.btn_wrap} />
          </View>
          <RadialGradient
              pointerEvents={'none'}
            style={{width: 600, height: 600, position: 'absolute', bottom: -250, right: -250, opacity: 0.3}}
            colors={[Colors.thirdColor, Colors.second_bg + '00', Colors.second_bg + '00', Colors.second_bg + '00']}
            stops={[0.1, 0.4, 0.3, 0.75]}
            center={[300, 300]}
            radius={740} />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    height: '100%',
    flex: 1,
    backgroundColor: Colors.second_bg
  },
  bgWrap: {
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    height: '100%',
    maxWidth: 550,
    maxHeight: 600,
    alignItems: 'center',
    top: 0,
    justifyContent: 'center',
  },
  logo: {
    width: 205,
    height: 95
  },
  scroll_view: {
    flexGrow: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  btn_wrap: {
    width: '100%',
    zIndex: 1,
    paddingBottom: 16
  },
  app_desc: {
    color: '#ffffff',
    textAlign: 'center',
    alignSelf: 'center',
    maxWidth: 248,
    marginBottom: 48
  }
});

export default HomeAuthScreen;
