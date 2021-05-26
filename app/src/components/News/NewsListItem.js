import React from 'react';
import {StyleSheet, ImageBackground, TouchableWithoutFeedback} from 'react-native';
import {View, Text} from 'native-base';
import Styles from "../../constants/Styles";
import {addHostToPath} from "../../utils";
import {getNewsDate} from "../../actions/news";
import Colors from "../../constants/Colors";
import NewsCoursesList from "./NewsCoursesList";
import Icons from "../Icons";
import {translate} from "../../utils";
import Fonts from "../../constants/Fonts";


export const COLORS = ['#FCEB55', '#FC5575', Colors.tintColor, '#FF9533', '#7459FF'];

const NewsListItem = ({data, onPress}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress(data.id)}>
        <View style={styles.container}>
          <View style={styles.image_wrap}>
            {data.image
              ?
              <ImageBackground style={styles.image} source={{uri: addHostToPath(data.image)}}/>
              :
              <View style={{alignItems: 'center'}}>{Icons.news_stub()}</View>
            }
          </View>
          {!data.users_read_count
            ?
            <View style={styles.new}>
              <Text style={[Styles.text, {fontFamily: Fonts.medium}]}>{translate('NEW')}</Text>
            </View>
            :
            null
          }
          <Text style={Styles.item_title} numberOfLines={2} ellipsizeMode='tail'>{data.name}</Text>
          <Text style={[Styles.item_text, styles.descr]} numberOfLines={3}
                ellipsizeMode='tail'>{data.description}</Text>
          <Text style={[Styles.small_text, styles.date]}>{getNewsDate(data.updated_at) || ''}</Text>
          <NewsCoursesList courses={data?.cards} full={false}/>
        </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    marginVertical: 12,
    marginHorizontal: 16,
    backgroundColor: Colors.item_bg,
    padding: 24,
    paddingBottom: 0
  },
  image_wrap: {
    justifyContent: 'center',
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    overflow: 'hidden',
    height: 184,
    marginHorizontal: -24,
    flex: 1,
    marginTop: -24,
    paddingBottom: 16,
  },
  image: {
    height: '100%',
    marginHorizontal: -24,
  },
  descr: {
    paddingTop: 16
  },
  bottom_wrap: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  date: {
    flex: 0,
    paddingTop: 8,
    alignSelf: 'flex-start',
    paddingBottom: 16,
  },
  new: {
    position: 'absolute',
    top: 12,
    left: -24,
    backgroundColor: '#FC5575',
    width: 100,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{rotate: '-45deg'}]
  }
});

export default NewsListItem;
