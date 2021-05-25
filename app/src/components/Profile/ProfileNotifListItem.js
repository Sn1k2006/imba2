import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';
import {View, Text, Button} from 'native-base';
import Colors from "../../constants/Colors";
import {translate} from "../../utils";
import Styles from "../../constants/Styles";
import moment from "moment";
import Avatar from "../Avatar";
import CardLogo from "../CardLogo";
import { SwipeRow } from 'react-native-swipe-list-view';
import Icons from "../Icons";

const ProfileNotifListItem = ({data, navigation, removeNotificationFromList}) => {
  if (!data) return null;
  const renderDescription = (text) => {
    if (!text) return null;
    return <View style={{paddingTop: 8}}>
      <Text style={[Styles.text, {color: Colors.item_text}]}>{text}</Text>
    </View>
  };
  return (
      <SwipeRow rightOpenValue={-75}>
            <View style={styles.swipe_item}>
              <TouchableOpacity onPress={() => removeNotificationFromList(data?.id)}>
              {Icons.trash(32, Colors.thirdColor)}
              </TouchableOpacity>
            </View>
    <View style={styles.container}>
      <View style={{flexDirection: 'row'}}>
        {data.type === "new_chat" && data?.admin?.avatar
          ?
          <View style={{paddingRight: 8}}>
            <Avatar image={data.admin.avatar} size={32}/>
          </View>
          :
          null
        }
        {data.type === "new_event_notification"
          ?
          <CardLogo size={32} round icon={'email'} icon_size={24} bgc={Colors.tintColor}
                    container_style={{marginRight: 8}}/>
          :
          null
        }
        <View style={{alignSelf: 'center', flex: 1}}>
          <Text style={[Styles.input, {flexWrap: 'wrap'}]}>
            {data.type === "new_event_added"
              ?
              <>
                {translate(`NOTIF_${data.type}`)}
                <Text style={[Styles.input, {color: Colors.tintColor}]}> {data.event?.name || ''} </Text>
              </>
              :
              <>
                {translate(`NOTIF_${data.type}_1`)}
                <Text style={[Styles.item_title, {
                  color: Colors.tintColor,
                  flex: 0
                }]}> {data.admin?.name || data.user?.name || ''} </Text>
                {translate(`NOTIF_${data.type}_2`)}
                {data.type === "start_group"
                  ?
                  <Text style={[Styles.input, {color: Colors.tintColor}]}> {data.group?.name || ''} </Text>
                  :
                  null
                }
                {data.type === "new_event_notification"
                  ?
                  <Text style={[Styles.input, {color: Colors.tintColor}]}> {data.event?.name || ''} </Text>
                  :
                  null
                }
              </>
            }
          </Text>
          {renderDescription(data.chat?.body || data?.message)}
        </View>
      </View>
      <View style={styles.footer}>
        {data.type === 'new_chat'
          ?
          <Button style={styles.btn} bordered onPress={() => navigation.navigate({
            routeName: 'Course',
            params: {id: data?.task?.card, type: 'task', answer: true},
            key: 'Course' + data?.task?.id
          })}>
            <Text style={Styles.text} uppercase={false}>{translate('TO_ANSWER')}</Text>
          </Button>
          :
          <View/>
        }
        <Text
          style={[Styles.text_muted_12, {color: '#ffffff32'}]}>{moment.utc(data.updated_at).local().format('HH:mm')}</Text>
      </View>
    </View>
      </SwipeRow>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    minHeight: 80,
    backgroundColor: '#33363A',
    padding: 16,
    marginVertical: 12,
    justifyContent: 'space-between'
  },
  footer: {
    paddingTop: 8,
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btn: {
    width: 110,
    backgroundColor: Colors.item_bg,
    height: 32,
    marginRight: 16,
    borderWidth: 0,
    borderColor: Colors.item_bg,
    textAlign: 'center',
    justifyContent: 'center',
  },
  btn_outline: {
    marginRight: 16,
    textAlign: 'center',
    justifyContent: 'center',
    width: 110,
    borderWidth: 1,
    borderColor: Colors.item_bg,
    height: 32,
  },
  swipe_item: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
});

export default withNavigation(ProfileNotifListItem);
