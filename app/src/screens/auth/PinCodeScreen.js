import React, {Component} from 'react';
import {StatusBar, SafeAreaView, StyleSheet} from 'react-native';
import {View, Container, Button, Content} from 'native-base';
import Icons from '../../components/Icons';
import PinCodeContainer from '../../containers/Auth/PinCodeContainer';
import Colors from '../../constants/Colors';
import RadialGradientLayout from '../../components/RadialGradientLayout';

class PinCodeScreen extends Component {
  route = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar translucent={true} hidden={false} backgroundColor={'transparent'} />
        <RadialGradientLayout />
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.header}>
            <Button onPress={this.route} style={styles.back_btn} transparent>{Icons.back_btn(32)}</Button>
          </View>
          <Content>
            <PinCodeContainer />
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

export default PinCodeScreen;
