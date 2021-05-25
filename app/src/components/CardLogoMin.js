import React, {useMemo} from 'react';
import {StyleSheet, ImageBackground,} from 'react-native';
import {View} from 'native-base';
import Colors from "../constants/Colors";
import Icons from "./Icons";
import {addHostToPath} from "../utils";

const CardLogoMin = ({size = 40, bgc = Colors.thirdColor, image = null, icon = 'card_stub', icon_color = '#ffffff', icon_size = 32, style = {}, container_style = {}, borderRadius}) => {
  const imageUri = useMemo(() => {
    return addHostToPath(image)
  }, [image]);
  return (
    <View style={[{position: 'relative', borderRadius: borderRadius || (size * 2)}, container_style]}>
      <View style={[styles.container, {width: size, height: size, backgroundColor: bgc}, style]}>
        {image
          ? <ImageBackground source={{uri: imageUri}} style={{width: '100%', height: '100%'}}/>
          : Icons[icon](icon_size, icon_color)
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',

  },
});

export default CardLogoMin;
