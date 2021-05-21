import React from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {View, Text, Icon} from 'native-base';
import * as Progress from "react-native-progress";
import Icons from "../Icons";

const ControlsVideo = ({
                         visible,
                         paused,
                         progress,
                         duration,
                         handleProgressPress,
                         handleMainButtonTouch,
                         toggleFullScreen,
                         isFullScreen,
                         progress_width
                       }) => {
  if(!visible) return null;
  const secondsToTime = (seconds) => {
    let hh = Math.floor(seconds / 3600),
      mm = Math.floor(seconds / 60) % 60,
      ss = Math.floor(seconds) % 60;
    return (hh ? (hh < 10 ? "0" : "") + hh + ":" : "") + ((mm < 10) && hh ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss
  };

  return (

    <>
      <View style={[styles.controls_top,]}>
        <TouchableWithoutFeedback onPress={toggleFullScreen}>
          {Icons[isFullScreen ? 'small_screen' : 'full_screen'](32, '#fff')}
        </TouchableWithoutFeedback>
      </View>
      <View style={[styles.controls,]}>
        <TouchableWithoutFeedback onPress={handleMainButtonTouch}>
          <View  style={{width: 20}}>
          {!paused
          ?<Icon name={'pause'} size={30} style={{color: '#fff'}}/>
          : Icons.play(32, '#fff')
          }
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={handleProgressPress}>
          <View>
            <Progress.Bar
              progress={progress}
              color={'#fff'}
              unfillColor='#ffffff50'
              borderColor={'#fff'}
              width={progress_width}
              height={20}
            />
          </View>
        </TouchableWithoutFeedback>
        <Text style={styles.duration}>
          {secondsToTime(Math.floor(progress * duration))}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  controls: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#00000050',
    height: 48,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16
  },
  controls_top: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#00000050',
    height: 48,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16
  },
  duration: {
    flex: 0,
    color: '#fff'
  }
});

export default ControlsVideo;