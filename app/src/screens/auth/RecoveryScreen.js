import React, {Component} from 'react';
import {Platform, StatusBar, SafeAreaView, StyleSheet} from 'react-native';
import {View, Container, Button, Content} from 'native-base';
import Icons from '../../components/Icons';
import RecoveryContainer from '../../containers/Auth/RecoveryContainer';
import Colors from '../../constants/Colors';
import RadialGradient from 'react-native-radial-gradient';

class RecoveryScreen extends Component {
  route = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <Container style={styles.container}>
        <StatusBar translucent={true} hidden={false} backgroundColor={'transparent'} />
        <RadialGradient style={{width: 600, height: 600, position: 'absolute', top: -250, left: -250, opacity: 0.3}}
                        colors={[Colors.secondColor, Colors.second_bg, Colors.second_bg + '00', Colors.second_bg + '00']}
                        stops={[0.1, 0.4, 0.3, 0.75]}
                        center={[300, 300]}
                        radius={600} />
        <RadialGradient
          style={{width: 600, height: 600, position: 'absolute', bottom: -250, right: -250, opacity: 0.4}}
          colors={[Colors.thirdColor, Colors.second_bg, Colors.second_bg + '00', Colors.second_bg + '00']}
          stops={[0.1, 0.4, 0.3, 0.75]}
          center={[300, 300]}
          radius={600} />
        <SafeAreaView style={{flex: 1}}>
          <View style={styles.header}>
            <Button onPress={this.route} style={styles.back_btn} transparent>{Icons.back_btn(32)}</Button>
          </View>
          <Content>
            <RecoveryContainer />
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

export default RecoveryScreen;
