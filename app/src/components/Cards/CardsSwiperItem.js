import React, {Component} from 'react';
import {StyleSheet, Animated, Platform, TouchableWithoutFeedback} from 'react-native';
import {View, Text} from 'native-base';
import {withNavigation} from 'react-navigation';
import {inject, observer} from 'mobx-react';
import {addHostToPath, getImageMaxSize, toast, translate} from '../../utils';
import Styles from '../../constants/Styles';
import {COLORS, getPercent} from '../../actions/courses';

import {rating} from '../../actions/rating';
import {action, observable} from 'mobx';

import Fonts from '../../constants/Fonts';
import Colors from '../../constants/Colors';
import FastImage from 'react-native-fast-image';
import Icons from '../Icons';
import Progress from '../Progress';
import StarBgIcons from '../Icons/StarBgIcons';

@inject('appStore')
@observer
class CardsSwiperItem extends Component {
  animated = new Animated.Value(Number(this.props.active));
  @observable like = false;


  @action handleLike = async () => {
    const like = !this.like;
    this.like = like;
    try {
      await rating(this.props.course.id, 'card', like);
    } catch (e) {
      toast(e.message);
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.active !== this.props.active) {
      this.triggerHeight();
    }
  }

  triggerHeight = () => {
    Animated.timing(this.animated, {
      toValue: Number(this.props.active),
      duration: 200,
      useNativeDriver: true
    }).start();
  };


  componentDidMount() {
    this.triggerHeight();
  }

  render() {
    const {course, handleRoute} = this.props;
    const interpolatedImage = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -51]
    });
    const percent = getPercent(course?.progress?.all, course?.progress?.done);
    const hasAnyLabel = course?.starting_soon || course?.free;
    const itemBgColor = hasAnyLabel ? Colors.secondColor : COLORS[course.order % (COLORS.length - 1)]
    return (
      <View style={styles.slide}>
        <View style={[styles.item, Platform.OS === 'ios' ? {overflow: 'visible'} : {}]}>
          <TouchableWithoutFeedback
            style={{width: '100%', height: '100%', padding: 24, justifyContent: 'flex-end',}}
            onPress={handleRoute}>
            <View style={{flex: 1, justifyContent: 'flex-end'}}>
              {course.bg_img
                ?
                <Animated.View style={[styles.image, {transform: [{translateY: interpolatedImage}]}]}>
                  <FastImage
                    source={{uri: addHostToPath(course.bg_img)}}
                    style={[getImageMaxSize(course.bg_img.image_width, course.bg_img.image_height, 200)]}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                </Animated.View>
                : null
              }
              <View style={styles.top}>
                <View style={styles.topBorder}>
                  {StarBgIcons.border(120)}
                </View>
                {course.author ? <Text style={[Styles.title_20, {lineHeight: 20, textAlign: 'left'}]}
                                       numberOfLines={2}>{course.author}</Text> : null}
                {course.discipline ? <Text style={[Styles.small_text, {textAlign: 'left', fontFamily: Fonts.light}]}
                                           numberOfLines={1}>{course.discipline}</Text> : null}
              </View>
              <View>
                <View style={[styles.logo, {backgroundColor: itemBgColor}]}>{Icons.logo()}</View>
                <View style={[styles.bottom,
                  {backgroundColor: itemBgColor}]}>
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: 5
                  }}>
                    <Text style={[Styles.title, styles.title]} numberOfLines={2}
                          ellipsizeMode="tail">{course.name}</Text>
                    {hasAnyLabel ? null : Icons.arrow_right(32, '#fff')}
                  </View>
                  <Progress progress={percent} width={'100%'} height={2} title />
                  {course.starting_soon
                    ?
                    <View style={[styles.free]}>
                      {StarBgIcons.filledSmall(Colors.yellow)}
                      <Text
                        style={[Styles.text, styles.promoText, {color: Colors.second_bg,}]}>{translate('Soon')}</Text>
                    </View>
                    :
                    course.free
                      ?
                      <View style={styles.free}>
                        {StarBgIcons.filledSmall()}
                        <Text style={[Styles.text, styles.promoText]}>{translate('Free')}</Text>
                      </View>
                      :
                      null
                  }
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottom: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 100,
    backgroundColor: 'red',
    justifyContent: 'space-between',
  },
  top: {
    top: 0,
    left: 0,
    width: 150, height: 80,
    paddingLeft: 24,
    paddingTop: 16,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    overflow: 'hidden',
    position: 'absolute',
  },
  topBorder: {
    position: 'absolute',
    left: -10,
    bottom: 0,
  },
  promoText: {
    fontFamily: Fonts.regular,
    fontWeight: 'bold',
    position: 'absolute',
    paddingTop: 8,
    paddingLeft: 8,
  },
  logo: {
    marginHorizontal: 24,
    marginVertical: 16,
    height: 48,
    width: 48,
    borderRadius: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    width: '100%',
    height: 48,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count_text: {
    fontFamily: Fonts.bold,
    fontWeight: 'bold',
    fontSize: 66,
    position: 'absolute',
    right: 24,
    bottom: 0,
    color: '#00000036'
  },
  count_text_s: {
    fontFamily: Fonts.bold,
    fontWeight: 'bold',
    fontSize: 48,
    color: '#00000036'
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 66,
    overflow: 'hidden',
  },
  item: {
    height: 280,
    position: 'relative',
    width: '100%',
    backgroundColor: Colors.item_bg,
  },
  image: {
    overflow: 'visible',
    alignSelf: 'center',
    position: 'absolute',
    top: 0,
    right: 8,
    // opacity: 0.32
  },
  image_hide: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 'bold',
    paddingRight: 70,
  },
  footer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  header: {
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  free: {
    position: 'absolute',
    top: 0,
    right: 0,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
  }
});

export default withNavigation(CardsSwiperItem);
