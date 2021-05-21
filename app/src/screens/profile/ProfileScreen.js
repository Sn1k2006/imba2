import React, {Component} from 'react';
import {TouchableWithoutFeedback, Keyboard, SafeAreaView, StyleSheet, Platform} from 'react-native';
import {Container, Content} from 'native-base';
import {NavigationEvents} from "react-navigation";
import {toast} from "../../utils";
import ErrorIndicator from "../../components/ErrorIndicator";
import Spinner from "../../components/Spinner";
import {getAchievementsList} from "../../actions/achievements";
import Colors from "../../constants/Colors";
import Footer from "../../components/Footer";
import {observer} from "mobx-react";
import Profile from "../../components/Profile";
import UserStore from "../../store/UserStore";
import MyStatusBar from "../../components/MyStatusbar";
import LinearGradient from "react-native-linear-gradient";
import {getNotifList, removeNotification} from "../../actions/notifications";

@observer
class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: true,
      achievements: null,
      notifications: null,
      error: null,
    }
  }

  didFocus = async () => {
    await this.init();
  };

  init = async () => {
    try {
      const result = await Promise.all([
        getAchievementsList(),
        getNotifList(),
        UserStore.get(),
      ]);
      let achievements = result[0] || {};
      let notifications = result[1] || {};
      this.setState({achievements, notifications, ready: true});
    } catch (e) {
      toast(e.message);
      this.setState({error: e, ready: true});
    }
  };

  removeNotificationFromList = async (id) => {
    const {data} = this.state.notifications;
    const idx = data.findIndex(notif => notif.id === id);
    let notifs = [...data.slice(0, idx), ...data.slice(idx + 1)];
    this.setState((prevState) => {
      return {notifications: {...prevState.my_blog, data: notifs}}
    })
    await removeNotification(id)
    UserStore.get()
  };

  hideKeyboard = () => {
    Keyboard.dismiss();
  };

  render() {
    if (this.state.error) return <ErrorIndicator error={this.state.error}/>;
    return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'android'
          ?
          <MyStatusBar translucent={true} hidden={false} backgroundColor={'transparent'}/>
          :
          null
      }
      <Container style={{backgroundColor: '#ffffff' }}>
        <LinearGradient style={{flex: 1 }} colors={[Colors.second_bg, Colors.bg]}>
          <TouchableWithoutFeedback onPress={this.hideKeyboard}>
            <>
              <NavigationEvents onDidFocus={this.didFocus}/>
              {this.state.ready
                ?
                // <TestScrolling />
                <Profile
                  init={this.init}
                  removeNotificationFromList={this.removeNotificationFromList}
                  achievements={this.state.achievements}
                  notifications={this.state.notifications}
                />
                :
                <Content>
                  <Spinner/>
                </Content>
              }
              {/*<View style={[styles.footer, {top: Layout.window.height - 80}]}>*/}
              <Footer active={'profile'}/>
              {/*</View>*/}
            </>
          </TouchableWithoutFeedback>
        </LinearGradient>
      </Container>
    </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.second_bg,
  },
});

export default ProfileScreen;


