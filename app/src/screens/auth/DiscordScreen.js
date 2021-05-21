import React, {Component} from 'react';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import {View, Text, Container, Button, Content} from 'native-base';
import Icons from "../../components/Icons";
import BgGradient from "../../components/BgGradient";
import Colors from "../../constants/Colors";
import DiscordContainer from "../../containers/Auth/DiscordContainer";
import {FBLogout} from "../../actions/facebook";
import {signOutGoogle} from "../../actions/google";

class DiscordScreen extends Component {
  route = () => {
    FBLogout()
    signOutGoogle();
    this.props.navigation.replace('Login');
  };
  render(){
    return (
      <Container  style={styles.container}>
        <StatusBar barStyle="light-content" translucent={false} hidden={false} backgroundColor={Colors.second_bg}/>
        <BgGradient bg_img blur dark/>
        <View style={styles.header}>
          <Button onPress={this.route} style={styles.back_btn} transparent>{Icons.back_btn(32)}</Button>
        </View>
        <Content>
          <DiscordContainer/>
        </Content>
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
  },
});

export default DiscordScreen;
