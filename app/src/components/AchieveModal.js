import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {View, Text} from 'native-base';
import CustomModal from "./elements/CustomModal";
import ShadowView from "react-native-simple-shadow-view/src/ShadowView";
import Styles from "../constants/Styles";
import {addHostToPath} from "../utils";
import CustomBtn from "./elements/CustomBtn";
import Stars from "./Stars";
import Icons from "./Icons";
import Colors from "../constants/Colors";
import Fonts from "../constants/Fonts";
import {getStarFromPlace} from "../actions/achievements";
import {translate} from "../utils/index";

const AchieveModal = ({visible, closeModal, data, btn_text, stars = null, test}) => {
  if (!data) return null;
  if (stars) stars = getStarFromPlace(data?.place) || 0;
  return (
    <CustomModal visible={visible} onClose={closeModal} dark gradient>
      <View style={{alignItems: 'center'}}>
        {stars !== null
          ?
          <View style={{marginBottom: -4}}>
            <Stars stars={stars} width={120} icon_size={26} height={40} dark/>
          </View>
          :
          null
        }
        {data.image
          ?
          <ShadowView style={[Styles.shadow, styles.shadow]}>
            <View style={styles.image_wrap}>
              <Image source={{uri: addHostToPath(data.image)}} style={styles.image}/>
            </View>
          </ShadowView>
          :
          null
        }
        <Text style={[Styles.title_20, styles.text]}>{data?.name}</Text>
        <Text style={[Styles.text_muted, styles.text_descr]}>{data?.description}</Text>

      </View>
      {test
        ?
        <View style={styles.test_wrap}>
          {Icons.test(40, Colors.tintColor)}
          <Text style={[Styles.text, styles.test_text]}>{test.name}</Text>
        </View>
        :
        null
      }
      <CustomBtn title={btn_text || translate('Im_good')} full onPress={closeModal} wrap_style={{marginTop: 44}}/>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  container: {},
  shadow: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 240,
    backgroundColor: Colors.second_bg,
    marginBottom: 24,
    shadowColor: '#000000',
    elevation: 2,
    shadowRadius: 10,
    borderWidth: 8,
    borderColor: Colors.second_bg,
    shadowOpacity: 0.6,
  },
  image_wrap: {
    width: 104,
    height: 104,
    backgroundColor: Colors.second_bg,
    borderRadius: 240
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 240
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
  test_wrap: {
    flexDirection: 'row',
    paddingTop: 28,
    alignItems: 'center'
  },
  test_text: {
    paddingLeft: 16,
    color: Colors.tintColor,
    flex: 1,
    fontFamily: Fonts.medium
  }
});

export default AchieveModal;
