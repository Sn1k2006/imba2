import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {View, Text} from 'native-base';
import CustomBtn from "../elements/CustomBtn";
import {separateAchiveInTest} from "../../actions/achievements";
import Styles from "../../constants/Styles";
import {addHostToPath} from "../../utils";
import ShadowView from "react-native-simple-shadow-view/src/ShadowView";
import {translate} from "../../utils/index";
import FastImage from "react-native-fast-image";

const AchivModal = ({achievements, closeAchiv, mark}) => {
  if(!mark || !achievements) return null;
  const achive = separateAchiveInTest(mark, achievements);
    return (
      <View style={styles.container}>
        <ShadowView style={[Styles.shadow, styles.shadow]}>
          <FastImage source={{uri: addHostToPath(achive.image)}} style={styles.image}/>
        </ShadowView>
        <Text  style={[Styles.title_20, styles.text]}>{achive.name}</Text>
        <Text  style={[Styles.text_muted, styles.text_descr]}>{achive.description}</Text>
        <CustomBtn title={translate('IM_GOOD')} full onPress={closeAchiv} wrap_style={{marginTop: 44}}/>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 8
  },
  text_descr: {
    lineHeight: 23,
    textAlign: 'center',
  },
  shadow: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    backgroundColor: '#FFE498',
    marginBottom: 24,
    shadowColor: '#FFE498',
    elevation: 3,
    shadowRadius: 10,
  },
  image: {
    borderWidth: 8,
    borderColor: '#ffffff',
    width: 120,
    height: 120,
    resizeMode: 'cover',
  }
});

export default AchivModal;
