import React from 'react';
import {View, Text} from "native-base";
import {TouchableOpacity} from "react-native";
import Icons from "../Icons";
import Styles from "../../constants/Styles";
import {StyleSheet} from "react-native";
import Colors from "../../constants/Colors";

const NewsCardTag = ({name = '', soon = false, onPress, maxWidth = 132}) => {

  return (
    <TouchableOpacity onPress={onPress}>
    <View
      title={name}
      style={[styles.container, {maxWidth}]}>
      {soon ?
      <View style={{paddingRight: 4}}>
        {Icons.clock(16, 'rgba(255, 255, 255, 0.32)')}
      </View>
        :
        null
      }
      <Text style={[Styles.small_text, soon ? {color: Colors.text_muted} : {}]} numberOfLines={1} ellipsizeMode='tail'>{name}</Text>
    </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    borderColor: 'rgba(255, 255, 255, 0.24)',
    borderRadius: 1,
    height: 24,
    marginBottom: 8
  },
});


export default NewsCardTag;
