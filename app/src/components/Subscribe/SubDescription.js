import React, {Component} from 'react';
import {Platform, StyleSheet} from 'react-native';
import {View, Text} from 'native-base';
import Styles from "../../constants/Styles";
import {translate} from "../../utils";
import {inject, observer} from "mobx-react";
import {toJS} from "mobx";

@inject('appStore')
@observer
class SubDescription extends Component {

  getSubscribeMonth = () => {
    const {data} = this.props;
    let translate_key = '';
    if (Platform.OS === 'ios') {
      translate_key = `SUB_PERIOD_${data.subscriptionPeriodUnitIOS}`
    } else {
      translate_key = `SUB_PERIOD_${data.subscriptionPeriodAndroid[2]}`
    }
    return Platform.select({
      ios: Number(data.subscriptionPeriodNumberIOS) ? (data.subscriptionPeriodNumberIOS + translate(translate_key)) : '',
      android: data.subscriptionPeriodAndroid ? (data?.subscriptionPeriodAndroid[1] + translate(translate_key)) : ''
    });
  };

  renderSubsText = () => {
    let text = '';
    const {data, appStore} = this.props;
    const app_product = appStore?.app_info?.products?.find(item => item.id === data.productId) || {}
    if (app_product.type === 'subs') {
      text = `- ${translate('SUBSC_COURSE_1')}${"\n"}- ${translate('SUBSC_COURSE_2')}${"\n\n"}`
      text += translate(data.freeTrialPeriodAndroid || data.introductoryPricePaymentModeIOS ? 'PURCHASE_TRIAL' : 'PURCHASE', 'purchase',
        {
          key1: this.getSubscribeMonth(),
          key2: data?.localizedPrice
        })
    } else {
      if (app_product.access === 'all') {
        text = translate('PURCHASE_1');
      } else {
        text += `- ${translate('PURCHASE_COURSE_1')}${"\n"}- ${translate('PURCHASE_COURSE_2')}${"\n"}- ${translate('PURCHASE_COURSE_3')}${"\n"}- ${translate('PURCHASE_COURSE_4')}`
        if(!appStore.subscribed) {
          if (!app_product.period) {
            text += `${"\n"}* ${translate('PURCHASE_COURSE_ALL')}`;
          } else {
            text += `${"\n"}* ${translate('PURCHASE_COURSE_PERIOD', 'change', app_product.period)}`;
          }
        }
      }
    }
    return text;
  }

  render() {
    const {data} = this.props;
    if (!data) return null;
    return (
      <View style={styles.container}>
        <Text style={[Styles.small_text, styles.small_text]}>
          {this.renderSubsText()}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 96
  },
  small_text: {
    // backgroundColor: 'red',
    textAlign: 'center',
    alignSelf: 'center',
    maxWidth: 261,
  },
});

export default SubDescription;