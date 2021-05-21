import React from 'react';
import {Linking, StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text} from 'native-base';
import Icons from "./Icons";
import Styles from "../constants/Styles";
import {addHostToPath, toast} from "../utils";

const File = ({file, style = {}}) => {
  if(!file) return null;
  const handlePress = () => {
    const {path} = file;
    let url = addHostToPath(path);
     Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        toast("Don't know how to open URI: " + url);
      }
    });
  };
  return (
    <View style={{flex: 1, zIndex: 1}}>
    <TouchableOpacity onPress={handlePress}>
      <View style={[styles.container, style]}>
        <View style={styles.icon}>
          {Icons.file(20, '#ffffff')}
        </View>
        <Text style={[Styles.text, styles.name]}>{file.name}</Text>
        {/*<Text></Text>*/}
      </View>
    </TouchableOpacity>
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    flex: 0,
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 48,
    alignItems: 'center',
    backgroundColor: '#FF9533'
  },
  name: {
    flex: 1,
    paddingLeft: 8,
    color: '#FF9533',
    paddingRight: 8
  },
});

export default File;