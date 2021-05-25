import React, {useEffect, useState} from 'react';

import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {View, Text} from 'native-base';
import Styles from "../../constants/Styles";
import ShadowView from "react-native-simple-shadow-view/src/ShadowView";
import Colors from "../../constants/Colors";
import CardLogo from "../CardLogo";
import {getColorByType} from "../../actions/courses";
import {renderSubTitle, translate} from "../../utils/index";
import Timer from "../Times";
import Icons from "../Icons";
import moment from "moment";
import AppStore from "../../store/AppStore";
import UserStore from "../../store/UserStore";
import Spinner from "../Spinner";

let interval;

const ActiveCourseElement = ({data, continueRoute, course, active_course}) => {
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState(0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (course?.free && course?.time_to_open  && !AppStore.subscribed && !UserStore.user?.user_products?.includes(data?.root)) {
      setDisabled(true);
      if (!course?.time_when_open) return setTimestamp(0);
      const end = moment(course?.time_when_open);
      let seconds = moment(end.diff(moment(), 'seconds'));
      setTimestamp(seconds || 0);
      startInterval()
    } else {
      setTimestamp(0);
      setDisabled(false)
    }
    setTimeout(() => setLoading(false), 200);
    return () => clearInterval(interval);
  }, [active_course, data]);

  const startInterval = () => {
    interval = setInterval(() => {
      setTimestamp((prevState) => {
        if (prevState <= 1) clearInterval(interval);
        return (prevState - 1) < 0 ? 0 : (prevState - 1)
      });
    }, 1000);
  };


  const renderRightIcon = () => {
    if (disabled && data.type !== 'section' && data.type !== 'direction') return Icons.pass_lock(40, Colors.text_muted);
    else if (data.type === 'section' || data.type === 'direction') return <CardLogo image={null} icon={'folder_fill'}
                                                                                    bgc={Colors.thirdColor}
                                                                                    icon_size={32} size={48}/>
    else return <CardLogo
        image={null}
        icon={data?.type}
        round={data?.type === 'task' && data?.task?.status}
        second_icon={data?.type === 'task' && data?.task?.status ? `task_${data?.task?.status}` : null}
        icon_size={32} size={48} bgc={getColorByType(data?.type, data?.task?.status)}
      />
  };
  if(loading) return <View style={{minHeight: 185}}><Spinner /></View>;
  return (

    <View style={[styles.container]}>
      {disabled
        ?
        <Timer timestamp={timestamp}/>
        :
        <Text style={[Styles.item_title, styles.title]}>{translate('CONTINUE_TRAINING')}</Text>
      }
      <TouchableWithoutFeedback onPress={continueRoute(data)}>
        <ShadowView style={[Styles.shadow ]}>
          <View style={[styles.item, disabled ? {borderWidth: 1} : {}]}>
            {data.type === 'section' || data.type === 'direction'
              ?
              <>
                <View style={{flex: 1}}>
                  {data.image ? <CardLogo image={data.image} icon={'folder'} icon_size={24}/> : null}
                  <Text
                    numberOfLines={2}
                    ellipsizeMode='tail'
                    style={[Styles.item_title, styles.item_title]}>{data.name}</Text>
                </View>
                <View style={{flexGrow: 0}}>
                  {renderRightIcon()}
                </View>
              </>
              :
              <>
                <View style={{flex: 1}}>
                  <View
                    style={{justifyContent: data.type !== 'checklist' ? 'center' : 'space-between', height: '100%'}}>
                    <View>
                      <Text
                        style={[Styles.text, styles.sub_title, disabled ? styles.subtitle_disabled : {}]}>{renderSubTitle(data?.json?.sub_title, data.type)}</Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode='tail'
                        style={[Styles.item_title, styles.item_title, disabled ? styles.text_disabled : {}]}>{data.name}</Text>
                    </View>
                    {data.type === 'checklist'
                      ?
                      <View style={{flexDirection: 'row', alignItems: 'center', paddingTop: 8}}>
                        <Text style={[Styles.text, {
                          color: '#ffffff',
                          paddingRight: 18
                        }, disabled ? styles.text_disabled : {}]}>{data?.settings?.checklist?.length || 0}/{data?.json?.body?.length || 0}</Text>
                      </View>
                      :
                      null
                    }
                  </View>
                </View>
                <View style={{flexGrow: 0}}>
                  {renderRightIcon()}
                </View>
              </>
            }
          </View>
        </ShadowView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: 32
  },
  item: {
    flex: 1,
    width: '100%',
    // marginBottom: 32,
    backgroundColor: Colors.second_bg,
    height: 109,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 32,
    paddingVertical: 8,
    justifyContent: 'space-between',
    borderWidth: 0,
    borderColor: '#FFDD00',
  },
  title: {
    color: 'rgba(255, 255, 255, 0.64)',
    paddingBottom: 24,
  },
  linearGradient: {
    position: 'relative',
    paddingHorizontal: 24,
    paddingVertical: 16,
    textAlign: 'center',
    overflow: 'hidden',
    height: 125
  },
  wave: {
    position: 'absolute',
    right: -50,
    top: -34,
  },
  wave_rotate: {
    position: 'absolute',
    right: 20,
    top: -40,
    transform: [{rotate: '70deg'}]
  },
  image_wrap: {
    position: 'absolute',
    right: 24,
    top: 0,
  },
  item_title: {
    color: '#ffffff',
    paddingTop: 8,
    paddingRight: 24
  },
  sub_title: {
    color: Colors.tintColor,
  },
  text_disabled: {
    color: 'rgba(229, 229, 229, 0.64)'
  },
  subtitle_disabled: {
    color: 'rgba(229, 229, 229, 0.32)'
  }
});

export default ActiveCourseElement;
