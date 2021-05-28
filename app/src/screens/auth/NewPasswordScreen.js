import React, {Component} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import {View, Container, Button, Content} from 'native-base';
import Icons from "../../components/Icons";
import NewPasswordContainer from "../../containers/Auth/NewPasswordContainer";
import {inject, observer} from "mobx-react";
import Colors from "../../constants/Colors";
import RadialGradientLayout from '../../components/RadialGradientLayout';

@inject('userStore')
@observer
class NewPasswordScreen extends Component {
  route = () => {
    this.props.navigation.goBack();
  };
  render(){
    return (
      <Container style={styles.container}>
        <StatusBar translucent={true} hidden={false} backgroundColor={'transparent'} />
        <RadialGradientLayout />
        <SafeAreaView style={{flex: 1}}>
        <View style={styles.header}>
          <Button onPress={this.route} style={styles.back_btn} transparent>{Icons.back_btn(32)}</Button>
        </View>
        <Content>
          <NewPasswordContainer userStore={this.props.userStore}/>
        </Content>
        </SafeAreaView>
      </Container>
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

export default NewPasswordScreen;
