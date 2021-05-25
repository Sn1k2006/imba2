import React, {Component} from 'react';
import {StyleSheet, Animated, Image, Platform, TouchableWithoutFeedback} from 'react-native';
import {View, Text} from 'native-base';
import {withNavigation} from 'react-navigation';
import {inject, observer} from "mobx-react";
import {addHostToPath, getImageMaxSize, toast, translate} from "../../utils";
import Styles from "../../constants/Styles";
import {getPercent} from "../../actions/courses";

import {rating} from "../../actions/rating";
import {action, observable} from "mobx";
import LinearGradient from "react-native-linear-gradient";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import x_b_1 from '../../assets/images/x/x_b_1.png'
import x_b_2 from '../../assets/images/x/x_b_2.png'
import x_b_3 from '../../assets/images/x/x_b_3.png'
import x_b_4 from '../../assets/images/x/x_b_4.png'
import x_b_5 from '../../assets/images/x/x_b_5.png'
import x_gr_1 from '../../assets/images/x/x_gr_1.png'
import x_gr_2 from '../../assets/images/x/x_gr_2.png'
import x_gr_3 from '../../assets/images/x/x_gr_3.png'
import x_gr_4 from '../../assets/images/x/x_gr_4.png'
import x_gr_5 from '../../assets/images/x/x_gr_5.png'

import Fonts from "../../constants/Fonts";
import Colors from "../../constants/Colors";
import FastImage from "react-native-fast-image";

const ITEM_BG = '#0d2b2d';
const ITEM_GRAD_1 = '#173655';
const ITEM_GRAD_2 = '#41202a';

@inject('appStore')
@observer
class CardsSwiperItem extends Component {
  animated = new Animated.Value(Number(this.props.active));
  @observable like = false;
  @observable image = null;
  @observable bg_type = 0;

  @action init = () => {
    let idx = this.props.course.order % 5;
    if (idx === 0) this.image = [x_b_1, x_gr_1];
    else if (idx === 1) {
      this.image = [x_b_2, x_gr_2];
      this.bg_type = 1;
    }
    else if (idx === 2) this.image = [x_b_3, x_gr_3];
    else if (idx === 3) {
      this.image = [x_b_4, x_gr_4];
      this.bg_type = 1;
    }
    else if (idx === 4) this.image = [x_b_5, x_gr_5];
    else this.image = [x_b_1, x_gr_1];
  };

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
    this.init();
    this.triggerHeight();
  }

  render() {
    const {course, i, handleRoute} = this.props;
    const interpolatedImage = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -51]
    });
    const percent = getPercent(course?.progress?.all, course?.progress?.done);
    return (
      <View key={course.id} style={styles.slide}>
        <LinearGradient
          style={[styles.item, {height: 264}, Platform.OS === 'ios' ? {overflow: 'visible'} : {}]}
          start={{x: 1, y: 0.13}} end={{x: 0.5, y: 1.4}}
          locations={[0, 0.2, 1]}
          colors={[this.bg_type ? ITEM_GRAD_2 : ITEM_GRAD_1, ITEM_BG, ITEM_BG]}
        >
          <TouchableWithoutFeedback
            style={{width: '100%', height: '100%', padding: 24, justifyContent: 'flex-end',}}
            onPress={handleRoute}>
            <View style={{flex: 1}}>
            {course.bg_img
              ?
              <Animated.View style={[styles.image, {transform: [{translateY: interpolatedImage}]}]}>
                <FastImage
                    source={{uri: addHostToPath(course.bg_img)}}
                    style={[getImageMaxSize(course.bg_img.image_width, course.bg_img.image_height, 200)]}
                    resizeMode={FastImage.resizeMode.contain}
                />
                <LinearGradient style={styles.image_hide} colors={['#0d2b2d00', '#0d2b2d90', '#0d2b2d']}
                                start={{x: 0.0, y: 0.6}} end={{x: 0, y: 1}} />
              </Animated.View>
              : null
            }

            <View style={styles.progress}>
              {course.starting_soon
                ?
                null
                :
                <>
                  <View style={styles.progress_circle}/>
                  <Text style={[Styles.text, styles.progress_text]}>{percent}%</Text>
                  <AnimatedCircularProgress
                    size={48}
                    width={4}
                    fill={percent}
                    rotation={180}
                    duration={0}
                    arcSweepAngle={360}
                    tintColor={Colors.tintColor}
                    backgroundColor="#ffffff00"
                  />
                </>
              }
            </View>
            {/*<CardLogo size={48} image={course.image} icon={'home'} icon_size={36} bgc={getColor(i)} round/>*/}
            <Text style={[Styles.title, styles.title]} numberOfLines={2} ellipsizeMode='tail'>{course.name}</Text>
            {course.starting_soon
              ?
              <View style={[styles.free, {backgroundColor: '#EBCC02'}]}>
                <Text style={[Styles.text, {fontFamily: Fonts.medium}]}>{translate('Soon')}</Text>
              </View>
              :
              course.free
                ?
                <View style={styles.free}>
                  <Text style={[Styles.text, {fontFamily: Fonts.medium}]}>{translate('Free')}</Text>
                </View>
                :
                null
            }
            </View>
          </TouchableWithoutFeedback>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  progress: {
    width: 48,
    height: 48,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress_circle: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 88,
    borderWidth: 2,
    borderColor: '#ffffff24',
    top: 1,
    left: 1
  },
  progress_text: {
    position: 'absolute',
    color: Colors.tintColor
  },
  x_wrap: {
    overflow: 'hidden',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    position: 'absolute',
  },
  x_b: {
    width: 270,
    height: 270,
    position: 'absolute',
    right: -60,
    bottom: -110
  },
  x_gr: {
    width: 320,
    height: 320,
    position: 'absolute',
    left: -100,
    bottom: -100
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
    paddingBottom: 16,
    paddingTop: 66,
    overflow: 'hidden',
  },
  item: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#0d2b2d',
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
    // paddingTop: 24,
    color: '#fff',
    paddingBottom: 16,
    fontSize: 20,
    lineHeight: 28,
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
    bottom: 0,
    left: 0,
    backgroundColor: Colors.tintColor,
    minWidth: 104,
    paddingHorizontal: 16,
    textAlign: 'center',
    paddingVertical: 4,
    alignItems: 'center',
  }
});

export default withNavigation(CardsSwiperItem);
