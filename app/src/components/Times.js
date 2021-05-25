import React from 'react';
import {View} from 'native-base';
import {StyleSheet, Text} from "react-native";
import {translate} from "../utils";
import Styles from "../constants/Styles";
import Fonts from "../constants/Fonts";
import Spinner from "./Spinner";

const Timer = ({timestamp, title = translate('OPENS_IN')}) => {
  let hours = Math.floor(timestamp / 60 / 60);
  let minutes = Math.floor(timestamp / 60) - (hours * 60);
  let seconds = timestamp % 60;
  if(hours < 10) hours = '0' + hours;
  if(minutes < 10) minutes = '0' + minutes;
  if(seconds < 10) seconds = '0' + seconds;
  return (
    <View style={styles.container}>
      <Text style={[Styles.input, {fontFamily: Fonts.medium, color: '#FFDD00', paddingRight: 12}]}>{title}</Text>
      {timestamp === 'loading'
          ?
        <View style={{height: 32, width: 32}}>
          <Spinner color={'#FFDD00'} style={{top: -24}}/>
        </View>
          :
        (timestamp || timestamp === 0) && timestamp >= 0
          ?
          <>
            <View style={styles.item}><View style={styles.separator}/><Text
                style={[Styles.text, {fontFamily: Fonts.medium}]}>{hours}</Text></View>
            <View style={styles.item}><View style={styles.separator}/><Text
                style={[Styles.text, {fontFamily: Fonts.medium}]}>{minutes}</Text></View>
            <View style={styles.item}><View style={styles.separator}/><Text
                style={[Styles.text, {fontFamily: Fonts.medium}]}>{seconds}</Text></View>
          </>
          :
          null
      }
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 16,
    minHeight: 32,
  },
  item: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  separator: {
    width: '100%',
    height: 1,
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.08)'
  }
});


export default Timer;
