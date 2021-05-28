import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {View, Text} from 'native-base';
import Icons from "../Icons";
import Styles from "../../constants/Styles";
import Avatar from "../Avatar";
import ProfileEditModal from "./ProfileEditModal";
import Fonts from "../../constants/Fonts";

const ProfileHeader = ({user, ...otherProps}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <View style={[styles.head]}>
        <View>
          <View style={[styles.heading, {height: 55}]}>
            <TouchableOpacity
              onPress={() => setVisible(true)}
              hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
              <View style={{padding: 5}}>
              {Icons.settings(32, '#fff')}
              </View>
            </TouchableOpacity>
          </View>
          <Avatar image={user?.avatar} progress={user?.progress || 0}/>
          <Text style={[Styles.text, styles.name]} numberOfLines={1} ellipsizeMode='tail'>{user?.name}</Text>
          <Text style={[Styles.title_bold, {fontSize: 20, color: 'rgba(255, 255, 255, 0.5)'}]}>{user?.progress || 0}%</Text>
        </View>
      </View>
      <ProfileEditModal
        user={user}
        visible={visible}
        closeModal={() => setVisible(false)}
        {...otherProps}
      />
    </>
  );
};

const styles = StyleSheet.create({
  head: {
    paddingHorizontal: 16,
    width: '100%',
    justifyContent: 'space-between',
  },
  heading: {
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  name: {
    textAlign: 'center',
    paddingBottom: 12,
    paddingTop: 20,
    paddingHorizontal: 8,
    fontSize: 24,
    lineHeight: 28,
    fontFamily: Fonts.bold
  },
});

export default ProfileHeader;
