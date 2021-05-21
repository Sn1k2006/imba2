import React, {Component} from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {View} from 'native-base';
import Styles from "../../constants/Styles";
import Colors from "../../constants/Colors";
import {inject, observer} from "mobx-react";
import {getColorBg, getColorBorder} from "../../actions/courses";
import CourseListItemContent from "./CourseListItemContent";
import ShadowView from "react-native-simple-shadow-view";
import Timer from "../Times";

@inject('userStore', 'appStore')
@observer
class CourseListItem extends Component {

  getTaskBg = () => {
    const {task} = this.props.data;
    if(task) {
      if(task.status === 'check') return '#D7BC0C'
      else if(task.status === 'rework') return '#DA193E'
      if(task.status === 'accepted') return '#14A85F'
    }
  }
  getTaskBorder = () => {
    const {task} = this.props.data;
    if(task) {
      if(task.status === 'check') return 'rgba(255, 221, 0, 0.64)'
      else if(task.status === 'rework') return '#FC2A52'
      if(task.status === 'accepted') return '#03C766'
    }
  };

  render() {
    const {
      data,
      time_to_open,
      disabled = false,
      last_active = false,
      onPress,
      setCurrentPosition,
      lock_loading,
      userStore,
      appStore
    } = this.props;
    const setPos = (event) => {
      if(last_active) {
        setCurrentPosition(event.nativeEvent.layout.y);
      }
    };
    let fill_width;
    if(data?.type === 'checklist') {
      fill_width = ((data?.settings?.checklist?.length * 100) / data?.json?.body?.length) || 0
    }
    else if(data?.type === 'test' && data?.settings?.test === 'failed') {
      fill_width = 100
    }
    else if(data?.type === 'section') {
      fill_width = ((data?.progress?.done * 100) / data?.progress?.all) || 0
      if(data?.progress?.all === 0 && !last_active && !disabled) fill_width = 100
    } else {
      fill_width = (data?.progress || data.task) && !disabled ? 100 : 0
    }
    const showTimer = last_active &&
      time_to_open &&
      data?.type !== 'section' &&
      data?.type !== 'end_section' &&
      !userStore?.user?.user_products?.includes(data?.root) &&
      !appStore.subscribed;
    return (
      <>
        {showTimer
          ?
          <Timer timestamp={time_to_open}/>
          :
          null
        }
      <View style={[styles.container]}
            onLayout={setPos}>
        <View style={[styles.item]}>
          <ShadowView style={[disabled ? {} : Styles.shadow, {borderRadius: 4}]}>
          <TouchableWithoutFeedback onPress={onPress(data, last_active, showTimer)} disabled={disabled}>
            <View style={[
              styles.inner_item,
              showTimer ? styles.item_timer: {}
              // disabled ? {backgroundColor: Colors.bg, opacity: 0.4} : {}
            ]}>
              <View style={{
                backgroundColor: data.type === 'task' ? this.getTaskBg() : getColorBg(data.type, data?.settings),
                borderWidth: fill_width > 0 ? 2 : 0,
                borderColor: data.type === 'task' ? this.getTaskBorder() : getColorBorder(data.type, data?.settings),
                position: 'absolute',
                width: fill_width + '%',
                height: '100%',
              }}/>
              <CourseListItemContent
                data={data}
                disabled={disabled}
                lock_loading={lock_loading}
                last_active={last_active}
                time_to_open={time_to_open}
              />
            </View>
          </TouchableWithoutFeedback>
          </ShadowView>
        </View>

      </View>
        </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    // flexDirection: 'row',

  },
  item: {
    position: 'relative',
    paddingBottom: 24,
    backgroundColor: '#ffffff00',
    // borderColor: 'green',
    flex: 1
  },
  inner_item: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    backgroundColor: Colors.item_bg,
    borderRadius: 4,
    // paddingVertical: 4,
  },
  item_timer: {
    borderColor: '#FFDD00',
    borderWidth: 1
  }
});

export default CourseListItem;
