import React, {useEffect, useState} from 'react';
import {Linking, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {withNavigation} from 'react-navigation';
import reactStringReplace from 'react-string-replace';
import {View, Text} from 'native-base';
import Styles from "../../constants/Styles";
import Colors from "../../constants/Colors";
import File from "../File";
import Avatar from "../Avatar";
import moment from "moment";
import {toast} from "../../utils";

const TaskChat = ({chat, navigation, scrollTo}) => {
  if (!chat) return null;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const answer = navigation.getParam('answer');
    if (answer) scrollTo();
  }, [loading]);
  const handlePress = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        toast("Don't know how to open URI: " + url, 'danger', true);
      }
    });
  };
  const renderBody = (text) => {
    if (!text) return null;
    const req = /(https?:\/\/\S+)/g;
    let new_str = reactStringReplace(text, req, (match, i) => (
      <Text>{match}</Text>
    ));
    return new_str.map((str, i) => {
      if (typeof str === 'string') return <Text key={i} style={[Styles.text_muted_16, {flex: 0}]}>{str}</Text>
      else return <TouchableWithoutFeedback key={i} onPress={() => handlePress(str?.props?.children)}><Text
        style={[Styles.text_muted_16, {color: Colors.tintColor, flex: 0 }]}>{str?.props?.children || ''}</Text></TouchableWithoutFeedback>

    })
  };

  return (
    <View style={styles.container} onLayout={() => setLoading(false)}>
      <View style={styles.chat}>
        {chat.map(item => (
          <View key={item.id} style={[styles.item, styles[`item_${item.user ? 'own' : 'trainer'}`]]}>
            <View style={{flexDirection: 'row'}}>
              {item?.trainer
                ?
                <View style={{paddingRight: 8}}>
                  <Avatar image={item?.trainer?.avatar} size={32} icon_size={26}/>
                </View>
                :
                null
              }
              <View style={[styles.message, styles[`message_${item.user ? 'own' : 'trainer'}`]]}>
                {item.body ?
                  <View style={{marginBottom: 8, flexDirection: 'row', flexWrap: 'wrap'}}>
                    {renderBody(item?.body)}
                  </View>
                  :
                  null
                }
                <View style={{flex: 1, height: '100%'}}>
                  {item.files?.map(file => <File file={file} style={{marginBottom: 8}} key={file.id}/>)}
                </View>
                <Text style={[Styles.text_muted_12, {color: '#ffffff32', textAlign: 'right'}]}>
                  {moment.utc(item.updated_at).local().format('HH:mm')}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12
  },
  separator: {
    position: 'absolute',
    width: '30%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.16)'
  },
  chat: {
    flex: 1,
    paddingTop: 32,
  },
  item: {
    minHeight: 52,
    width: '80%',
    marginBottom: 24
  },
  item_own: {
    alignSelf: 'flex-end',
  },
  item_trainer: {},
  message: {
    height: '100%',
    padding: 16,
    paddingBottom: 8,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.item_bg,
  },
  message_own: {
    borderTopRightRadius: 0,
    backgroundColor: Colors.item_bg
  },
  message_trainer: {
    borderTopLeftRadius: 0,
  },
});

export default withNavigation(TaskChat);
