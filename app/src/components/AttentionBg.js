import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Text} from 'native-base';
import NoResults from "./NoResults";

const AttentionBg = ({
                       title = '',
                       style = {},
                     }) => {
  return (
    <View style={[styles.container, style]}>
        <View style={styles.text_wrap}>
          <NoResults text={title} />
        </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: 360,
    height: 422,
    overflow: 'hidden',
    alignItems: 'center',
  },
  bg: {
    marginTop: 32,
    height: 200,
    width: '100%',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image_bg_1: {
    position: 'absolute',
    top: 0,
    resizeMode: 'contain'
  },
  image_bg_2: {
    position: 'absolute',
    bottom: -27,
    resizeMode: 'contain'
  },
  text_wrap: {
    paddingHorizontal: 24,
    maxWidth: 320
  }
});

export default AttentionBg;