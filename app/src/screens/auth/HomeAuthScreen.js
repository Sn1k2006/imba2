import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, ScrollView, Platform, Image} from 'react-native';
import {View, Text} from 'native-base';
import Colors from "../../constants/Colors";
import CustomBtn from "../../components/elements/CustomBtn";
import {translate} from '../../utils';
import Styles from "../../constants/Styles";
import {inject, observer} from "mobx-react";
import MyStatusBar from "../../components/MyStatusbar";
import {FBLogout} from "../../actions/facebook";
import {signOutGoogle} from "../../actions/google";
import BgGradient from "../../components/BgGradient";
import logo from '../../assets/images/logo.png';
import FastImage from "react-native-fast-image";

@inject('appStore', 'userStore')
@observer
class HomeAuthScreen extends Component {

  route = (path, type) => () => {
    this.props.navigation.navigate(path, {type});
  };

  async componentDidMount() {
    if (!this.props.userStore.user?.auth_type) {
      setTimeout(FBLogout, 2000);
      await signOutGoogle();
    }
  }


  render() {
    const {app_info = {}} = this.props.appStore;
    return (
      <SafeAreaView style={[styles.container]}>
        {/*<StatusBar barStyle="light-content" translucent={false} hidden={false} backgroundColor={'transparent'}/>*/}
        <MyStatusBar  translucent={false} hidden={false} backgroundColor={'transparent'} />
        <BgGradient bg_img dark/>
        <ScrollView contentContainerStyle={styles.scroll_view}>
          <View style={styles.content}>
            <View>
              {/*<Logo stub={Icons.app_stub(32, 'red')} bgc='#F8D7A5' image={require('../../assets/images/111.jpg')}/>*/}
              <FastImage source={logo} style={styles.logo}/>

            </View>

          </View>
          <View style={[styles.btn_wrap, {width: '100%'}]}>
            <Text style={[Styles.text, styles.app_desc]}>{app_info?.description}</Text>
            <CustomBtn title={translate('Enter')} width={200}  onPress={this.route('Login', 'login')}
                       wrap_style={styles.btn_wrap}/>
            <CustomBtn title={translate('Registration')} width={200} type={'outline'} onPress={this.route('Login', 'register')}
                       wrap_style={styles.btn_wrap}/>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    height: '100%',
    flex: 1,
    backgroundColor: Colors.bg
  },
  logo: {
    width: 250,
    height: 250
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
    paddingTop: 80,
  },
  btn_wrap: {
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
