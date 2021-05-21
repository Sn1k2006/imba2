import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Text, Icon} from 'native-base';
import CardLogo from "../CardLogo";
import Styles from "../../constants/Styles";
import Fonts from "../../constants/Fonts";
import Achiv from "./Achiv";
import Icons from "../Icons";
import {getPercent} from "../../actions/courses";
import Colors from "../../constants/Colors";
import RepeatImage from "../RepeatImage";
import {translate, renderSubTitle} from "../../utils/index";
import Spinner from "../Spinner";

const CourseListItemContent = ({data, right, disabled, lock_loading, last_active, time_to_open}) => {
  return <View style={[styles.container]}>
    {data.type === 'section' || data.type === 'direction'
      ?
      <>
        <View
          style={[styles.logo_item, disabled || last_active ? styles.logo_item_disabled : {}]}>
          <CardLogo
            image={null}
            size={48}
            icon={'folder'}
            icon_size={40}
            round
            bgc={'rgba(38, 41, 46, 0.08)'}
            icon_color={disabled ? Colors.text_muted : '#fff'}
          />
        </View>
        <View style={styles.content_item}>
          <Text style={[Styles.input, styles.title, disabled ? {color: Colors.text_muted} : {}]} numberOfLines={2}
                ellipsizeMode='tail'>{data.name}</Text>
        </View>
        <Text
          style={[Styles.small_text, styles.sub_title, {paddingRight: 8}]}>{!disabled ? getPercent(data.progress?.all, data.progress?.done) + '%' : null}</Text>
        <View style={disabled ? {paddingRight: 8} : {}}>
          {disabled
            ?
            lock_loading
              ?
              <Spinner/>
              :
              Icons.pass_lock(32, Colors.text_muted)
            :
            Icons.chevron_right(32, '#fff')
          }
        </View>
      </>
      : null
    }
    {data.type === 'test'
      ?
      <>
        <View
          style={[styles.logo_item, disabled || last_active ? styles.logo_item_disabled : {backgroundColor: 'rgba(38, 41, 46, 0.08)'}]}>
          {data.settings?.mark
            ?
            <Achiv achiv={data.settings?.achievement}/>
            :
            <View style={[styles.logo_item, {alignItems: 'center'}]}>
              {Icons.test(40, disabled ? Colors.text_muted : '#fff')}
            </View>
          }
        </View>
        <View style={styles.content_item}>
          <View style={[styles.sub_title, {flexDirection: 'row', alignItems: 'center'}]}>
            <Text style={[Styles.small_text_muted]} numberOfLines={1}
                  ellipsizeMode='tail'>{renderSubTitle(data?.json?.sub_title, data.type)}</Text>
            {data.progress
              ?
              <>
                <Icon
                  name='star'
                  type='FontAwesome'
                  style={{
                    fontSize: 12,
                    marginLeft: 8,
                    color: data.settings?.stars ? '#FFD15C' : Colors.text_muted
                  }}
                />
                <Icon
                  name='star'
                  type='FontAwesome'
                  style={{
                    fontSize: 12,
                    marginLeft: 8,
                    color: data.settings?.stars > 1 ? '#FFD15C' : Colors.text_muted
                  }}
                />
                <Icon
                  name='star'
                  type='FontAwesome'
                  style={{
                    fontSize: 12,
                    marginLeft: 8,
                    color: data.settings?.stars > 2 ? '#FFD15C' : Colors.text_muted
                  }}
                />
              </>
              :
              null
            }
          </View>
          <Text style={[Styles.text, styles.title, disabled || last_active ? {color: Colors.text_muted} : {}]}
                numberOfLines={3}
                ellipsizeMode='tail'>{data.name}</Text>
        </View>
        <View style={disabled ? {paddingRight: 8} : {}}>
          {disabled
            ?
            lock_loading
              ?
              <Spinner/>
              :
              Icons.pass_lock(32, Colors.text_muted)
            :
            Icons.chevron_right(32, '#fff')
          }
        </View>
      </>
      : null
    }
    {data.type === 'material' || data.type === 'checklist' || data.type === 'poll' || data.type === 'task'
      ?
      <>
        <View
          style={[styles.logo_item, disabled || last_active ? styles.logo_item_disabled : {backgroundColor: 'rgba(38, 41, 46, 0.08)'}]}>
          {Icons[data.type](40, disabled ? Colors.text_muted : '#fff')}
        </View>
        <View style={styles.content_item}>
          <Text style={[Styles.small_text_muted, styles.sub_title]} numberOfLines={1}
                ellipsizeMode='tail'>{renderSubTitle(data?.json?.sub_title, data.type)}</Text>
          <Text style={[Styles.text, styles.title, disabled || last_active ? {color: Colors.text_muted} : {}]}
                numberOfLines={2} ellipsizeMode='tail'>{data.name}</Text>
        </View>
        {data.type === 'checklist' && !disabled
          ?
          <Text style={[Styles.small_text, styles.sub_title, {paddingRight: 8}]}>
            {data.settings?.checklist?.length || 0}/{data?.json?.body?.length || 0}
          </Text>
          :
          null
        }
        {data.type === 'task' && !disabled && data.task
          ?
          <View style={{paddingRight: 8}}>
            {Icons[`task_${data?.task?.status}`](32, '#fff')}
          </View>

          :
          null
        }
        {data.type === 'poll' && data?.profile && !data.progress
            ?
            <View style={{paddingRight: 8}}>
              {Icons[`task_check`](32, '#fff')}
            </View>

            :
            null
        }
        <View style={disabled ? {paddingRight: 8} : {}}>
          {disabled
            ?
            lock_loading
              ?
              <Spinner/>
              :
              Icons.pass_lock(32, Colors.text_muted)
            :
            Icons.chevron_right(32, '#fff')
          }
        </View>
      </>
      : null}
    {data.type === 'end_section'
      ?
      <>
        <RepeatImage small/>
        <View style={[{flexDirection: right ? 'row' : 'row-reverse', alignItems: 'center'}]}>
          <Text
            style={[Styles.title, {paddingHorizontal: 24}]}>{translate('COURSE_COMPLETED')}</Text>
        </View>

      </>
      : null}
  </View>
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 80
  },
  logo_item: {
    alignItems: 'center',
    borderRadius: 96,
    width: 48,
    justifyContent: 'center',
    height: 48,
    // backgroundColor: 'red'
  },
  logo_item_disabled: {
    borderRadius: 96,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cccccc10'
  },
  content_item: {
    height: '100%',
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center'
  },
  container_left: {
    paddingLeft: 16,
    flexDirection: 'row-reverse',
  },
  title: {
    flexWrap: 'wrap',
    flexShrink: 1,
    flex: 0,
    fontFamily: Fonts.medium,
  },
  sub_title: {
    paddingBottom: 4,
  },
});

export default CourseListItemContent;
