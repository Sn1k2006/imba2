import React, {useEffect, useState} from 'react';
import {Modal, ScrollView, Platform, StatusBar, StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import {View, Text} from 'native-base';
import CustomBtn from "../elements/CustomBtn";
import Styles from "../../constants/Styles";
import Icons from "../Icons";
import Colors from "../../constants/Colors";
import CardLogo from "../CardLogo";
import {translate} from "../../utils/index";

const FiltersModal = ({handleOk, visible, onClose, courses, ...props}) => {
  const [filters, setFilters] = useState({sort_by: null, cards_id: []});
  useEffect(() => {
    if (visible) {
      setFilters(props.filters);
      if(Platform.OS === 'android') {
        setTimeout(() => {
          StatusBar.setBackgroundColor('#00000080', false);
        }, 400);
      }

    } else {
      if(Platform.OS === 'android') {
        StatusBar.setBackgroundColor(Colors.statusBar, false);
      }

      setFilters({sort_by: null, cards_id: []});
    }
  }, [visible]);

  const changeFilter = (type, value) => () => {
    if (type === 'cards_id') {
      if (!value) value = [];
      else if (filters.cards_id?.includes(value)) {
        value = filters.cards_id.filter(item => item !== value);
      } else {
        value = [...filters.cards_id, value];
      }
    }
    setFilters(prevState => {
      return {...prevState, [type]: value}
    })
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={{flex: 1}}/>
        </TouchableWithoutFeedback>

        <View style={styles.content}>
          <ScrollView style={{marginHorizontal: -40}} showsHorizontalScrollIndicator={false}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 40
            }}>
              <Text style={Styles.title}>{translate('FILTER')}</Text>
              <TouchableOpacity
                onPress={onClose} style={{marginRight: -16}}
                hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
                {Icons.close(32, Colors.text_muted)}
              </TouchableOpacity>
            </View>
            <Text style={[Styles.item_title, styles.item, {marginBottom: 8, paddingHorizontal: 40}]}>
              {translate('Blogs')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{paddingHorizontal: 40, marginHorizontal: -19}}>
              <TouchableWithoutFeedback
                onPress={changeFilter('sort_by', filters.sort_by === 'rating_count' ? null : 'rating_count')}
                hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
                <Text
                  style={[Styles.text_muted, styles.text, filters.sort_by === 'rating_count' ? styles.active_text : {}]}>{translate('POPULAR')}</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={changeFilter('sort_by', filters.sort_by === 'created_at' ? null : 'created_at')}
                hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
                <Text
                  style={[Styles.text_muted, styles.text, filters.sort_by === 'created_at' ? styles.active_text : {}]}>{translate('New')}</Text>
              </TouchableWithoutFeedback>
            </ScrollView>
            <Text style={[Styles.item_title, {marginTop: 24}, {marginBottom: 16, paddingHorizontal: 40}]}>
              {translate('Course')}
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={[{flexDirection: 'row', marginHorizontal: -12, paddingLeft: 36, paddingRight: 36}]}>
                <TouchableWithoutFeedback onPress={changeFilter('cards_id', null)}>
                  <View style={styles.course_item}>
                    <View style={[styles.logo, !filters.cards_id?.length ? {borderColor: Colors.secondColor} : {}]}>
                      <View style={[styles.logo_all, !filters.cards_id?.length ? {borderColor: Colors.secondColor} : {backgroundColor: '#ffffff', borderColor: Colors.text_muted}]}>
                        <Text
                          style={[Styles.text, !filters.cards_id?.length ? {color: '#ffffff'} : {color: Colors.text_muted}]}>{translate('All')}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                {courses?.map(course => (
                  <TouchableWithoutFeedback key={course.id} onPress={changeFilter('cards_id', course.id)}>
                    <View style={styles.course_item}>
                      <CardLogo
                        image={course.image}
                        size={56}
                        container_style={[styles.logo, filters.cards_id.includes(course.id) ? {borderColor: Colors.secondColor} : {}]}
                        borderRadius={10}/>
                      <Text style={[Styles.small_text_muted, styles.course_name]} numberOfLines={3}
                            ellipsizeMode='tail'>{course.name}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                ))}
              </View>
            </ScrollView>
            <CustomBtn title={translate('Ready')} wrap_style={[styles.item, {paddingBottom: 24}]}
                       onPress={() => handleOk(filters)} width={247}/>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    backgroundColor: '#00000080',

  },
  content: {
    flex: 0,
    paddingTop: 28,
    paddingHorizontal: 40,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    backgroundColor: '#ffffff'
  },
  item: {
    marginTop: 32,
  },
  course_item: {
    alignItems: 'center',
    width: 72,
    marginHorizontal: 8
  },
  course_name: {
    textAlign: 'center',
    paddingTop: 8
  },
  logo: {
    borderWidth: 1,
    padding: 2,
    borderRadius: 10,
    borderColor: '#ffffff',
  },
  logo_all: {
    width: 56, height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondColor,
    borderWidth: 1
  },
  active_text: {
    color: Colors.secondColor
  },
  text: {
    fontSize: 16,
    padding: 8,
    marginHorizontal: 10
  }
});

export default FiltersModal;
