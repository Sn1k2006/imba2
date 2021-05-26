import React, {useMemo} from 'react';
import {StyleSheet, ImageBackground,} from 'react-native';
import {View} from 'native-base';
import Colors from "../constants/Colors";
import Icons from "./Icons";
import {addHostToPath} from "../utils";
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import ShadowView from "react-native-simple-shadow-view";
import FastImage from 'react-native-fast-image'

const CardLogo = ({second_icon = null, size = 40, bgc = Colors.second_bg, image = null, icon = 'home', icon_color = '#ffffff', icon_size = 32, style = {}, percent = null, container_style = {}, borderRadius, round}) => {
  const imageUri = useMemo(() => {
    return addHostToPath(image)
  }, [image]);
  return (
    <ShadowView style={[percent !== null ? styles.shadow : {}, {position: 'relative', borderRadius: borderRadius || (size * 2)}, container_style]}>
      <View style={[
        styles.container, {width: size, height: size, backgroundColor: imageUri ? '#ffffff00' : bgc, borderRadius: round ? size * 2 : 0},
        percent !== null ? {borderRadius: size * 2} : {},
        style]}>
        {imageUri
          ?
            <FastImage
                style={{ width: size, height: size, borderRadius}}
                source={{
                  uri: imageUri,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
            // <ImageBackground source={{uri: imageUri}} style={{width: '100%', height: '100%'}}/>
          : Icons[second_icon || icon](icon_size, icon_color)
        }
      </View>
      {percent !== null
        ?
        <View style={styles.progress}>
          <AnimatedCircularProgress
            size={size + 10}
            width={7}
            fill={percent}
            rotation={270}
            duration={0}
            arcSweepAngle={359}
            tintColor={Colors.secondColor}
            lineCap='round'
            // circleRadian={100}
            backgroundColor="#fff"
          />
        </View>
        : null
      }
    </ShadowView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',

  },
  shadow: {
    padding: 5,
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 0},
    backgroundColor: Colors.bg,
    elevation: 3,
    borderRadius: 24
  },
  progress: {
    width: 60,
    height: 60,
    flex: 1,
    position: 'absolute'
  },
});

export default CardLogo;
