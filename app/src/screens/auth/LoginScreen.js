import React, {Component} from 'react';
import {Keyboard, Platform, ScrollView, StatusBar, StyleSheet} from 'react-native';
import {View, Button, Container} from 'native-base';
import Icons from "../../components/Icons";
import {inject, observer} from "mobx-react";
import AuthContainer from "../../containers/Auth/AuthContainer";
import RegisterContainer from "../../containers/Auth/RegisterContainer";
import {toast, translate} from "../../utils/index";
import BgGradient from "../../components/BgGradient";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import CustomTabs from "../../components/elements/CustomTabs";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

@inject('userStore')
@observer
class LoginScreen extends Component {
  state = {
    tab: 0,
    loading: true,
    btn_loading: false,
  };

  init = () => {
    const type = this.props.navigation.getParam('type');
    let idx = Number(type !== 'login');
    setTimeout(() => {
      if (idx) this._scroll?.scrollTo({x: Layout.window.width * this.state.tab, animated: true});
      this.setState({loading: false});
    }, 0);
    this.setState({tab: idx});
  };


  changeTab = (idx) => {
    Keyboard.dismiss();
    this.setState({tab: idx});
  };

  componentDidMount() {
    this.init();
  }

  route = () => {
    this.props.navigation.goBack();
  };

  onScrollEndDrag = (e) => {
    const index = e.nativeEvent.contentOffset.x / (Layout.window.width);
    this.changeTab(index);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.tab !== this.state.tab) {
      this._scroll.scrollTo({x: Layout.window.width * this.state.tab, animated: true});
    }
  }

  handleSocialClick = async (user) => {
    try {
      this.setState({btn_loading: true});
      await this.props.userStore.logIn(user, true);
    } catch (e) {
      if (e.code === 322) {
        const {code, ...otherProps} = e;
        this.props.navigation.replace('Discord', otherProps);
      } else {
        this.setState({btn_loading: false});
        toast(e.message, 'danger');
      }
    }
  };

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar barStyle="light-content" translucent={false} hidden={false} backgroundColor={Colors.second_bg}/>
        {/*<MyStatusBar backgroundColor={Colors.second_bg}/>*/}
        <BgGradient bg_img blur dark/>
        <View style={styles.header}>
          <Button onPress={this.route} style={styles.back_btn} transparent>{Icons.back_btn(32)}</Button>
        </View>
        <CustomTabs tabs={[translate('Login'), translate('Registration')]}
                    onPress={(i) => this.changeTab(i)}
                    active_idx={this.state.tab}/>
        <KeyboardAwareScrollView
          style={{flex: 1}}
          contentContainerStyle={{flex: 1}}
          extraHeight={160}
          bounces={false}>
          <ScrollView
            style={{opacity: this.state.loading ? 0 : 1}}
            ref={(scroll) => this._scroll = scroll}
            horizontal
            decelerationRate={'fast'}
            scrollEventThrottle={1}
            centerContent
            pagingEnabled={true}
            snapToInterval={Layout.window.width}
            onMomentumScrollEnd={this.onScrollEndDrag}
            showsHorizontalScrollIndicator={false}
            // keyboardShouldPersistTaps={'always'}
          >
            <AuthContainer socialSubmit={this.handleSocialClick} loading={this.state.btn_loading}/>
            <RegisterContainer socialSubmit={this.handleSocialClick} loading={this.state.btn_loading}/>
          </ScrollView>
        </KeyboardAwareScrollView>
      </Container>
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
  header: {
    flex: 0,
    paddingBottom: 10,
    paddingTop: 10,
    alignItems: 'flex-start',
  },
  back_btn: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0
  }
});

export default LoginScreen;
