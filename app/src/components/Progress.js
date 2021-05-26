import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {View} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import Styles from '../constants/Styles';

const Progress = ({
                    style,
                    width = 80,
                    height = 8,
                    progress = 0,
                    color = '#ffffff',
                    color2,
                    title,
                    unfilledColor = '#ffffff32'
                  }) => {
  // const percent_width = (width * progress) / 100;
  return (
    <>
      {title
        ?
        <Text style={Styles.text}>{Math.floor(progress) || 0}%</Text>
        :
        null
      }
      <View style={[styles.container, {width, height, backgroundColor: unfilledColor}, {style}]}>
        <View style={[styles.percent, {width: `${progress}%`, backgroundColor: color}]}>
          {color2
            ?
            <LinearGradient
              start={{x: 0, y: 0}} end={{x: 1, y: 0}}
              colors={[color, color2]}
              style={styles.linearGradient}
            />
            :
            null
          }
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  percent: {
    flex: 1,
    height: '100%',
    borderTopRightRadius: 1,
    borderBottomRightRadius: 1,
  },
  linearGradient: {
    width: '100%',
    height: '100%'
  }
});

export default Progress;
