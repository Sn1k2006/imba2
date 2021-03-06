import React from 'react';
import Header from './Header';
import {Container, Content, View,} from 'native-base';
import Footer from './Footer';
import {StyleSheet, RefreshControl, SafeAreaView, Platform} from 'react-native';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';
import {observer} from 'mobx-react';
import MyStatusBar from './MyStatusbar';
import LinearGradient from 'react-native-linear-gradient';
import RadialGradientLayout from './RadialGradientLayout';

@observer
class Layout extends React.Component {

  render() {

    const {
      children,
      active = '',
      header = false,
      footer = true,
      style,
      refreshing,
      onRefresh,
      noContent = false,
      bg_gradient,
      content_style = {},
      container_style = {},
      radialGrad,
      ...headerProps
    } = this.props;

    return (
      <SafeAreaView style={[styles.container]}>
        {Platform.OS === 'ios' ?
          <View style={{
            position: 'absolute',
            top: 0,
            zIndex: -1,
            left: 0,
            width: '100%',
            height: 70,
            backgroundColor: Colors.second_bg
          }} />
          :
          null
        }
        <Container style={[container_style]}>
          {header && Platform.OS === 'ios' ? <Header {...headerProps} /> : null}
          <LinearGradient style={styles.gradient} colors={[Colors.second_bg, Colors.bg]} locations={[0.2, 1]}>
            {Platform.OS === 'android'
              ?
              <MyStatusBar translucent={true} hidden={false} backgroundColor={'transparent'} />
              :
              null
            }
            {radialGrad
                ?
                <RadialGradientLayout />
                :
                null
            }
            {header && Platform.OS === 'android' ? <Header {...headerProps} /> : null}

            {noContent
              ?
              <SafeAreaView style={[styles.container]}>
                {children}
              </SafeAreaView>
              :
              <Content
                refreshControl={
                  onRefresh
                    ?
                    <RefreshControl
                      refreshing={refreshing} onRefresh={onRefresh}
                      tintColor={Colors.tintColor}
                      colors={[Colors.tintColor, Colors.secondColor]}
                    />
                    :
                    null
                }
                style={[styles.container, style]}
                contentContainerStyle={[Styles.content, !header ? Styles.page_padding : {}, content_style]}
              >
                {children}
              </Content>
            }
          </LinearGradient>
          {footer ? <Footer active={active} /> : null}

        </Container>
        {Platform.OS === 'ios' ?
          <View style={{
            position: 'absolute',
            zIndex: -1,
            bottom: 0,
            left: 0,
            width: '100%',
            height: 70,
            backgroundColor: footer ? Colors.second_bg : Colors.bg
          }} />
          :
          null
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
  },
});

export default Layout;
