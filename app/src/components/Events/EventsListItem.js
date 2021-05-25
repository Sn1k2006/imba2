import React, {useState} from 'react';
import {Linking, StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {View, Text} from 'native-base';
import ShadowView from 'react-native-simple-shadow-view'
import Styles from "../../constants/Styles";
import {toast} from "../../utils";
import {getNewsDate} from "../../actions/news";
import Fonts from "../../constants/Fonts";
import Colors from "../../constants/Colors";
import moment from 'moment';
import Icons from "../Icons";
import LinearGradient from "react-native-linear-gradient";

const EventsListItem = ({data}) => {
  const [loading, setLoading] = useState(true);
  const [big, setBig] = useState(false);
  const [show, setShow] = useState(false);
  const handleUrl = () => {
    Linking.canOpenURL(data?.link).then(supported => {
      if (supported) {
        Linking.openURL(data?.link);
      } else {
        toast("Don't know how to open URI: " + data?.link);
      }
    });
  };
  const handleLayout = (e) => {
    const height = e.nativeEvent.layout.height;
    if (height > 200) setBig(true);
    setLoading(false);
  }

  return (
    <ShadowView style={[styles.shadow, loading ? {opacity: 0} : {}]}>
      <View style={[styles.container]} onLayout={handleLayout}>
        {getNewsDate(data.send, true) === 0
            ?
            <View style={styles.gradient}>
              <LinearGradient style={{width: '100%', height: '100%'}}
                              colors={['#7459FF', '#FC2A52']} start={{x: 0.0, y: 0}} end={{x: 0.5, y: 1}}/>
            </View>
            :
            null
        }
        <View
          style={{flexDirection: 'row', paddingBottom: 8, justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <Text style={[Styles.input, {flex: 1, paddingRight: 16}]} numberOfLines={2}
                ellipsizeMode='tail'>{data.name}</Text>
          <Text style={[Styles.item_text, styles.date]}>{getNewsDate(data.send || data.updated_at) || ''}</Text>
        </View>
        <View style={{flexDirection: 'row', paddingBottom: 8}}>
          <Text style={Styles.input}>{moment.utc(data.send || data.updated_at).local().format('DD.MM.YYYY')}</Text>
          <Text style={[Styles.text_muted, {paddingLeft: 6}]}>{moment.utc(data.send || data.updated_at).local().format('HH:mm')}</Text>
        </View>
        <Text style={[Styles.item_text, styles.descr]}
              ellipsizeMode='tail'
              {...big && !show ? {numberOfLines: 3} : {}}
        >{data.description}</Text>
        <View style={styles.bottom_wrap}>
          <TouchableOpacity onPress={handleUrl}>
            <Text style={[Styles.text]}>{data.link}</Text>
          </TouchableOpacity>
        </View>
        {big
          ?
          <TouchableWithoutFeedback onPress={() => setShow(!show)}>
            <View style={styles.show_more}>
              <View style={[styles.show_more_icon]}>
                {show
                  ?
                  Icons.chevron_top(32, '#fff')
                  :
                  Icons.chevron_bottom(32, '#fff')
                }
              </View>
            </View>
          </TouchableWithoutFeedback>
          :
          null
        }
      </View>
    </ShadowView>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 0},
    backgroundColor: Colors.bg,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  container: {
    backgroundColor: Colors.item_bg,
    padding: 24,
    overflow: 'hidden'
  },
  gradient: {
    opacity: 0.8,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  descr: {
    paddingTop: 8
  },
  bottom_wrap: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  date: {
    fontSize: Fonts.text_small,
    flex: 0,
  },
  show_more: {
    marginBottom: -16,
    alignItems: 'center'
  },
  show_more_icon: {}
});

export default EventsListItem;
