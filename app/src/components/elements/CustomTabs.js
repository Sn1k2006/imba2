import React from 'react';
import {TouchableWithoutFeedback, ScrollView} from 'react-native';
import {View, Text} from 'native-base';
import {StyleSheet} from "react-native";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";

const CustomTabs = ({onPress, active_idx, tabs = [], scroll = false, style = {}, imba, notif_index = [], disabled= [], container_style = {}}) => {
  const renderTabs = () => (
    tabs.map((tab, i) => (
      <TouchableWithoutFeedback
        key={i} onPress={() => disabled.includes(i) ? null : onPress(i)}
        hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
      >
        <View style={[styles.tab]}>
        <Text style={[styles.text, active_idx === i ? styles.active_text : {}, disabled.includes(i) ? styles.disabled_text : {}]}>{tab}</Text>
          {
            notif_index.includes(i)
              ?
                <View style={styles.notif}/>
              :
              null
          }
        </View>
      </TouchableWithoutFeedback>
    ))
  );
  return (
    !scroll
      ?
      <View style={[{paddingHorizontal: 16}, container_style]}>
      <View style={[styles.tabs, imba ? styles.tab_bg : {}, style]}>
        {renderTabs()}
      </View>
      </View>
      :
      <ScrollView horizontal contentContainerStyle={styles.tabs} alwaysBounceHorizontal>
        {renderTabs()}
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    height: 42,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tab_bg: {
    backgroundColor: '#293e53',
    // backgroundColor: Colors.item_bg,
  },
  text: {
    paddingHorizontal: 16,
    textAlign: 'center',
    color: Colors.text_muted,
    fontSize: Fonts.text_size,
    lineHeight: Fonts.text_lineHeight,
  },
  active_text: {
    fontFamily: Fonts.medium,
    color: Colors.tintColor,
  },
  disabled_text: {
    color: '#ffffff30',
    opacity: 0,
  },
  active: {
    flex: 0,
    alignSelf: 'center',
    opacity: 0,
    backgroundColor: Colors.secondColor
  },

  notif: {
    position: 'absolute',
    right: 16,
    top: 0,
    width: 8,
    height: 8,
    backgroundColor: Colors.thirdColor,
  },
});

export default CustomTabs;
