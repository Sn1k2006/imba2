import React from 'react';
import {View, StyleSheet, Platform, Text} from 'react-native';
import {Button, FooterTab, Footer as NativeFooter} from "native-base";
import {withNavigation} from 'react-navigation';
import Colors from "../constants/Colors";
import Icons from '../components/Icons';
import {inject, observer} from "mobx-react";

@inject('userStore')
@observer
class Footer extends React.Component {
  handleRoute = (route) => () => {
    return this.props.navigation.navigate(route);
  };

  render() {
    const {active, userStore} = this.props;
    return (
      <NativeFooter style={styles.footer}>
        <FooterTab style={styles.footer_tab}>
          <View style={[styles.footer_tab_wrap, styles.shadow]}>
            <View style={[styles.footer_btn_wrap, {borderTopLeftRadius: 15}]}>
              <Button onPress={this.handleRoute('News')} style={[styles.footer_btn, styles.footer_btn_1]}
                      transparent>
                {active === 'news'
                  ?
                  Icons.news_active(32)
                  :
                  Icons.news_footer()
                }
              </Button>
            </View>
            <View style={styles.footer_btn_wrap}>
              <Button onPress={this.handleRoute('Courses')} style={styles.footer_btn} transparent>
                {active === 'courses'
                  ?
                  Icons.home_active(32)
                  :
                  Icons.home_footer(32, Colors.text_muted)
                }
              </Button>
            </View>
            <View style={[styles.footer_btn_wrap, {borderTopRightRadius: 15,}]}>
              <Button onPress={this.handleRoute('Profile')} style={[styles.footer_btn, styles.footer_btn_2]}
                      transparent>

                {active === 'profile'
                  ?
                  Icons.user_active(32)
                  :
                  Icons.user_footer(32, Colors.text_muted)
                }
                {userStore.user?.notifications_count
                  ?
                  <View style={styles.notif_wrap}>
                    <View style={styles.notif}/>
                  </View>
                  :
                  null
                }

              </Button>
            </View>
            <View style={[styles.footer_btn_wrap, {borderTopRightRadius: 15,}]}>
              <Button onPress={this.handleRoute('Events')} style={[styles.footer_btn, styles.footer_btn_2]}
                      transparent>
                {active === 'events'
                  ?
                  Icons.events_active(32)
                  :
                  Icons.events_footer(32, Colors.text_muted)
                }
                {userStore.user?.events_count
                  ?
                  <View style={styles.notif_wrap}>
                    <View style={styles.notif}/>
                  </View>
                  :
                  null
                }
              </Button>
            </View>
          </View>
        </FooterTab>
      </NativeFooter>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#ffffff00',
    position: 'relative',
    borderTopRightRadius: 10,
    elevation: 0,
    borderTopWidth: 0,
    overflow: 'visible'
  },
  notif_wrap: {
    position: 'absolute',
    // right: 0,
    // top: 0,
  },
  notif: {
    position: 'absolute',
    right: -12,
    top: -12,
    width: 8,
    height: 8,
    backgroundColor: Colors.thirdColor,
  },
  footer_tab: {
    backgroundColor: '#152C4A',
    position: 'relative',
  },
  footer_tab_wrap: {
    width: '100%',
    height: '100%',
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    flex: 1,
    flexDirection: 'row'
  },
  footer_btn_wrap: {
    flex: 1,
    backgroundColor: '#152C4A',
    zIndex: 1,
  },
  footer_btn: {
    flex: 1,
    width: '100%',
    backgroundColor: '#152C4A',
    borderRadius: 0,
  },

  shadow: {
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'ios' ? -5 : 4,
    },
    shadowOpacity: Platform.OS === 'ios' ? 0.05 : 0.8,
    shadowRadius: Platform.OS === 'ios' ? 4 : 5.46,
    elevation: 20,
  }
});

export default withNavigation(Footer);
