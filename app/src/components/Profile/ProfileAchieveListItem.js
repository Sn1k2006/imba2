import React, { useMemo} from 'react';
import {Image, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {View, Text} from 'native-base';
import ShadowView from "react-native-simple-shadow-view";
import Styles from "../../constants/Styles";
import CardLogo from "../CardLogo";
import {addHostToPath, translate} from "../../utils";
import Icons from "../Icons";
import Colors from "../../constants/Colors";
import FastImage from "react-native-fast-image";

const ProfileAchieveListItem = ({data, openModal, course}) => {
  const imageUri = useMemo(() => {
    return addHostToPath(data.image)
  }, [data.image]);
  const star = useMemo(() => {
    let star = 0;
    if(data.place === 7) star = 1;
    else if(data.place === 8) star = 2;
    else if(data.place > 8) star = 3;
    return star
  }, [data.place]);
  return (
    <TouchableWithoutFeedback onPress={course ? null :() => openModal(data)}>
      <ShadowView style={[Styles.shadow, styles.shadow]}>
        <View style={styles.container}>
          <ShadowView style={[Styles.shadow, styles.shadow_achieve]}>
            <View style={[styles.achieve_wrap, imageUri ? {backgroundColor: '#ffffff00'} : {}]}>
            {imageUri
              ?
              <FastImage source={{uri: imageUri}} style={styles.achieve}/>
              :
              Icons.medal(32, '#ffffff')
            }
            </View>
          </ShadowView>
          <View style={{justifyContent: 'space-between', flex: 1, paddingHorizontal: 16}}>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingBottom: 4}}>
              <Text numberOfLines={1} ellipssizeModa={'tail'} style={[Styles.text_muted, {marginRight: 16}]}>
                {translate('Mark')} <Text style={Styles.text}>{data.place}</Text>
              </Text>
              {Array(3).fill({}).map((item, i) => (
                <View key={i}>{Icons.full_star(16, star >= (i + 1) ? '#FFD15C' : '#E5EAFF')}</View>
              ))}
            </View>
            <Text numberOfLines={2} ellipssizeModa={'tail'} style={[Styles.item_title, {fontSize: 16, flex: 1}]}>{data.name}</Text>
          </View>
          {course
            ?
            null
            :
            <CardLogo container_style={{alignSelf: 'center'}} image={data?.lang_parent?.image} round size={40}/>
          }
        </View>
      </ShadowView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 96,
    backgroundColor: Colors.item_bg,
    padding: 16,
    flexDirection: 'row'
  },
  shadow: {
    marginVertical: 12,

  },
  shadow_achieve: {
    width: 64,
    height: 64,
    backgroundColor: Colors.bg,
    // borderRadius: 128,
    alignItems: 'center',
    justifyContent: 'center'
  },
  achieve_wrap: {
    width: '100%',
    height: '100%',
    // borderRadius: 128,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFE498'
  },
  achieve: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default ProfileAchieveListItem;
