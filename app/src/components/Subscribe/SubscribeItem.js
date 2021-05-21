import React from 'react';
import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text} from 'native-base';
import ShadowView from "react-native-simple-shadow-view";
import Styles from "../../constants/Styles";
import {translate} from "../../utils";
import Icons from "../Icons";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";
import LinearGradient from "react-native-linear-gradient";

const SubscribeItem = ({data, onClick, active, root_name = ''}) => {
  const renderTitle = () => {
    let text = Platform.select({
      ios: data.title,
      android: data.title.split(' (')[0]
    }) || translate(`Subscription_${data.productId}`)
    if (data.type === 'inapp') {
      text += ` ${root_name || ''} - ${translate('LEVEL_LEARNING')}`;
    }
    return text;
  };
  const renderPeriod = () => {
    let translate_key = '';
    if (Platform.OS === 'ios') {
      translate_key = `SUB_PERIOD_${data.subscriptionPeriodUnitIOS}`
    } else {
      translate_key = `SUB_PERIOD_${data.subscriptionPeriodAndroid[2]}`
    }
    return Platform.select({
      ios: Number(data.subscriptionPeriodNumberIOS) ? ` / ${data.subscriptionPeriodNumberIOS} ${translate(translate_key)}` : '',
      android: data.subscriptionPeriodAndroid ? ` / ${data.subscriptionPeriodAndroid[1]} ${translate(translate_key)}` : ''
    });
  };
  return (
    <TouchableOpacity onPress={() => onClick(data)}>
      <ShadowView style={[Styles.shadow, styles.shadow]}>
        <View style={[styles.container]}>
          {active
            ?
            <View style={styles.gradient}>
              <LinearGradient style={{width: '100%', height: '100%'}}
                              colors={['#7459FF', '#FC2A52']} start={{x: 0.0, y: 0}} end={{x: 0.5, y: 1}}/>
            </View>
            :
            null
          }
          <Text
            style={[Styles.input, {fontFamily: Fonts.medium, textAlign: 'center', paddingLeft: 24}, active ? {color: '#ffffff'} : {}]}>
            {renderTitle()}
          </Text>
          <Text style={[Styles.text, {textAlign: 'center', paddingLeft: 24}, active ? {color: '#ffffff'} : {}]}>
            {data.freeTrialPeriodAndroid || data.introductoryPricePaymentModeIOS ? translate('then') + ' ' : ''}
            {data.localizedPrice}
            {renderPeriod()}
          </Text>
          {active
            ?
            <View style={styles.check}>
              {Icons.bold_check(24, Colors.secondColor)}
            </View>
            :
            null
          }
        </View>
      </ShadowView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 80,
    borderRadius: 4,
    backgroundColor: Colors.item_bg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
    paddingVertical: 8,
    overflow: 'hidden'
  },
  shadow: {
    width: '100%',
    marginVertical: 12,
    borderRadius: 4,
  },
  check: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 64,
    backgroundColor: '#fff',
    left: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    opacity: 0.8,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 4,
  },
});

export default SubscribeItem;
