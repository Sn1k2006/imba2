import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {View, Text} from 'native-base';
import Styles from "../../constants/Styles";
import CustomBtn from "../elements/CustomBtn";
import ShadowView from "react-native-simple-shadow-view/src/ShadowView";
import Icons from "../Icons";
import confetti3 from '../../assets/images/confetti3.png';
import FastImage from "react-native-fast-image";

const ChecklistDoneModal = ({text, handleOk}) => {
  return (
      <View style={styles.container}>
        <FastImage source={confetti3} style={styles.image}/>
        <ShadowView style={[Styles.shadow, styles.shadow]}>
          {Icons.check_color()}
        </ShadowView>
        <Text style={[Styles.title_20, styles.text]}>{text}</Text>
        <CustomBtn onPress={handleOk} width={52} icon={'chevron_right'} icon_size={32} btn_style={{paddingHorizontal: 0}}/>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: -40,
    paddingTop: 40,
    marginHorizontal: -32,
    paddingHorizontal: 32,
    marginBottom: -24,
    paddingBottom: 24,
  },
  shadow: {
    backgroundColor: '#2D3035',
    width: 128,
    height: 128,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute',
    flex: 1,
    top: -50,
  },
  text: {
    marginVertical: 40
  }
});

export default ChecklistDoneModal;
