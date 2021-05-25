import React from 'react';
import {StyleSheet, TouchableOpacity,Platform} from 'react-native';
import {View} from 'native-base';
import ShadowView from "react-native-simple-shadow-view/src/ShadowView";
import Styles from "../constants/Styles";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import Colors from "../constants/Colors";
import {addHostToPath} from "../utils";
import Icons from "./Icons";
import LinearGradient from "react-native-linear-gradient";
import FastImage from 'react-native-fast-image'

const Avatar = ({progress = null, small = false, image, edit, size = 128, icon_size = 100}) => {
  if(small) {
    size = 48;
    icon_size = 32
  }

  const borderRadius = (size * 2) || 0;
  return (
    <ShadowView style={[Styles.shadow, styles.shadow, {borderRadius, width: size, height: size}]}>
      <LinearGradient style={{borderRadius}} colors={[ Colors.second_bg, Colors.bg]}>
      <View style={[styles.container, {padding: progress !== null ? 6 : 0}]}>
        {progress !== null
          ?
          <View style={[styles.progress, {borderRadius, width: size, height: size}]}>
            <AnimatedCircularProgress
              size={128}
              width={8}
              fill={progress || 0}
              rotation={180}
              duration={0}
              arcSweepAngle={360}
              tintColor={Colors.tintColor}
              backgroundColor="#383b3f"
            />
          </View>
          :
          null
        }
        {image && typeof image !== 'number'
          ?
          <FastImage
            style={{ width: size - (progress !== null ? 2 : 0), height: size - (progress !== null ? 2 : 0), borderRadius}}
            source={{
              uri: addHostToPath(image),
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          // <Image source={{uri: addHostToPath(image)}} style={[styles.image, {borderRadius}]}/>
          :
          Icons.user(icon_size, Colors.text_muted)
        }
      </View>
      </LinearGradient>
      {edit
        ?

        <View style={[Styles.shadow, styles.shadow_edit]}>
          <TouchableOpacity onPress={edit}>
            <View style={[styles.edit]}>
              {Icons.edit(24, '#fff')}
            </View>
          </TouchableOpacity>
        </View>

        :
        null
      }

    </ShadowView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    backgroundColor: Colors.second_bg,
    position: 'relative',
    alignSelf: 'center',
    overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
  },
  progress: {
    flex: 1,
    zIndex: 2,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
  image: {
    position: 'relative',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  shadow_edit: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    justifyContent: 'center',
    width: 34,
    height: 34,
    borderRadius: 68,

  },
  edit: {
    width: 34,
    height: 34,
    padding: 2,
    backgroundColor: '#383b3f',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 64,
  }

});

export default Avatar;
