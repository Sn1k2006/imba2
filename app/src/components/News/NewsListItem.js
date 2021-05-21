import React from 'react';
import {StyleSheet, ImageBackground, TouchableWithoutFeedback} from 'react-native';
import {View, Text} from 'native-base';
import ShadowView from 'react-native-simple-shadow-view'
import Styles from "../../constants/Styles";
import {addHostToPath} from "../../utils";
import {getNewsDate} from "../../actions/news";
import Colors from "../../constants/Colors";
import NewsCoursesList from "./NewsCoursesList";
import Icons from "../Icons";
import {translate} from "../../utils";
import Fonts from "../../constants/Fonts";


export const COLORS = ['#FFDD00', '#FC2A52', '#01CB65', '#FF9533', '#7459FF'];

const NewsListItem = ({data, onPress}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress(data.id)}>
      <ShadowView style={styles.shadow}>
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
      </ShadowView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  shadow: {
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 0},
    backgroundColor: Colors.bg,
    marginVertical: 12,
    marginHorizontal: 16,
    borderRadius: 4,
  },
  container: {
    borderRadius: 4,
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
    backgroundColor: '#fc2a52',
    width: 100,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{rotate: '-45deg'}]
  }
});

export default NewsListItem;
