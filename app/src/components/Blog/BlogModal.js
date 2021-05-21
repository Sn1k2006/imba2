import React, {useState, useEffect} from 'react';
import {TouchableOpacity, StyleSheet, Linking, TouchableWithoutFeedback} from 'react-native';
import {View, Text} from 'native-base';
import CustomModal from "../elements/CustomModal";
import CustomBtn from "../elements/CustomBtn";
import Avatar from "../Avatar";
import Styles from "../../constants/Styles";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";
import {toast, translate} from "../../utils";
import CustomRadio from "../elements/CustomRadio";


const BlogModal = ({visible, closeModal, data, btn_text , complainBlog}) => {
  const RADIO = [translate('COMPLAIN_1'), translate('COMPLAIN_2'), translate('COMPLAIN_3')];
  const [is_complain, setComplain] = useState(false);
  const [radio, setRadio] = useState(null);
  useEffect(() => {
    if (visible) {
      setComplain(false);
      setRadio(null);
    }
  }, [visible]);

  const handlePress = () => {
    if (is_complain) {
      complainBlog(data.id, radio);
    } else {
      Linking.canOpenURL(data?.link).then(supported => {
        if (supported) {
          Linking.openURL(data?.link);
        } else {
          toast("Don't know how to open URI: " + data?.link);
        }
      });
    }
  };

  if (!data) return null;
  const {user_id, name, description} = data;
  return (
    <CustomModal
      visible={visible}
      onClose={closeModal}
      dark
      left_icon={is_complain ? 'back_btn' : null}
      leftIconClick={() => setComplain(false)}
    >
      {is_complain
        ?
        <View style={{paddingTop: 8}}>
          {RADIO.map((item, i) => (
            <View style={{marginTop: 24}} key={i}>
              <TouchableWithoutFeedback onPress={() => setRadio(i)}
                                        hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
                <View style={styles.radio_item}>
                  <CustomRadio active={radio === i}/>
                  <Text style={[Styles.text, styles.complain_text]}>{item}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          ))}
        </View>
        :
        <>
          <Avatar image={user_id?.avatar} progress={0}/>
          <Text style={[Styles.title_bold, styles.name]}>{user_id?.name}</Text>
          <Text style={styles.blog_name}>{name}</Text>
          <Text style={[Styles.text_muted, {textAlign: 'center'}]}>{description}</Text>
        </>
      }
      <CustomBtn title={!is_complain ? (btn_text || translate('GO_TO')) : translate('SEND_COMPLAIN')} full onPress={handlePress}
                 wrap_style={{marginTop: 44}} disabled={is_complain && radio === null}/>
      {!is_complain
        ?
        <View style={{marginTop: 24}}>
          <TouchableOpacity hitSlop={{top: 15, bottom: 15, left: 15, right: 15}} onPress={() => setComplain(true)}>
            <Text style={[Styles.btn_text, styles.complain]}>{translate('COMPLAIN')}</Text>
          </TouchableOpacity>
        </View>
        :
        null
      }
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  name: {
    color: Colors.title,
    textAlign: 'center',
    paddingTop: 20,
    paddingHorizontal: 8,
  },
  blog_name: {
    paddingTop: 24,
    fontSize: 16,
    lineHeight: 19,
    paddingBottom: 16,
    color: Colors.secondColor,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  complain: {
    textAlign: 'center',
    color: Colors.tintColor,
  },
  radio_item: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  complain_text: {
    fontSize: 16,
    paddingLeft: 16
  }
});

export default BlogModal;