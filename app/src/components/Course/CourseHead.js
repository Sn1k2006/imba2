import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {View, Text} from 'native-base';
import {inject, observer} from 'mobx-react';
import {COLORS, getPercent} from '../../actions/courses';
import LinearGradient from 'react-native-linear-gradient';
import RadialGradient from 'react-native-radial-gradient';
import {addHostToPath, getImageMaxSize, translate} from '../../utils';
import Styles from '../../constants/Styles';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import Icons from '../Icons';
import FastImage from 'react-native-fast-image';
import Progress from '../Progress';
import StarBgIcons from '../Icons/StarBgIcons';

@inject('userStore')
@observer
class CourseHead extends Component {
  render() {
    const {data, handleBack, progress, soon, courseRouting, userStore} = this.props;
    const hasAnyLabel = soon || data?.free;
    const color = hasAnyLabel ? Colors.secondColor : COLORS[(data.order || 0) % (COLORS.length - 1)]
    const percent = getPercent(progress.all, progress?.done);
    return (
      <View style={styles.container}>
        <View style={styles.item}>
          <RadialGradient style={{width: 600, height: 600, position: 'absolute', top: -100, left: -100, opacity: 0.5}}
                          colors={['#7459FF', Colors.second_bg, Colors.second_bg, Colors.second_bg]}
                          stops={[0.1, 0.4, 0.3, 0.75]}
                          center={[100, 100]}
                          radius={600} />
          {data?.parent?.bg_img
            ?
            <View style={[styles.image]}>
              <FastImage
                source={{uri: addHostToPath(data?.parent?.bg_img)}}
                style={[getImageMaxSize(data?.parent?.bg_img?.image_width, data?.parent?.bg_img?.image_height, 250)]}
              />
              <LinearGradient style={styles.image_hide} colors={['#0d2b2d00', '#0d2b2d90', '#0d2b2d']}
                              start={{x: 0.0, y: 0.6}} end={{x: 0, y: 1}} />
            </View>
            : null
          }
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack}>
              <View>
                {Icons.back_btn(32, '#fff')}
              </View>
            </TouchableOpacity>
          </View>
          <View style={{width: '100%', height: '100%', paddingTop: 0, justifyContent: 'space-between'}}>
            <View style={{height: (Platform.OS === 'ios' ? 255 : 275) + 40, justifyContent: 'flex-end'}}>
              <View>
                <View style={[styles.logo, {backgroundColor: color}]}>{Icons.logo()}</View>
                <View style={styles.person}>
                  <View style={{position: 'absolute'}}>
                    {StarBgIcons.border(152)}
                  </View>
                  {data?.author ? <Text style={[Styles.title_20, {lineHeight: 20, textAlign: 'center'}]}
                                        numberOfLines={2}>{data.author}</Text> : null}
                  {data?.discipline ? <Text style={[Styles.text, {textAlign: 'center', fontFamily: Fonts.light}]}
                                            numberOfLines={1}>{data.discipline}</Text> : null}
                </View>
              </View>
              <View style={{backgroundColor: color, paddingHorizontal: 24, paddingBottom: 36, paddingTop: 16, zIndex: Number(hasAnyLabel)}}>
                {hasAnyLabel
                  ?
                  <View style={{position: 'absolute', right: 16, top: 0, width: 152, alignItems: 'center'}}>
                    {StarBgIcons.filledBig(data.free ? Colors.tintColor : Colors.yellow)}
                    {data.free
                      ?
                      <Text style={[Styles.text, styles.promoText]}>{translate('Free')}</Text>
                      :
                      <Text
                        style={[Styles.text, styles.promoText, {color: Colors.second_bg,}]}>{translate('Soon')}</Text>
                    }
                  </View>
                  :
                  null
                }
                <Text style={[Styles.title, styles.title]} ellipsizeMode="tail" numberOfLines={3}>{data?.name}</Text>
                <Progress progress={percent} width={'100%'} height={2} title />
                {!userStore.user?.user_products?.includes(data?.root) && data?.has_poll
                  ?
                  <TouchableOpacity onPress={() => courseRouting(null, true)}>
                    <View style={styles.buy_product}>
                      <Text style={[Styles.text, {fontFamily: Fonts.medium, paddingRight: 4}]}>{translate('TRAINER_TEAM_START')}</Text>
                      {Icons.arrow_right(20, '#fff')}
                    </View>
                  </TouchableOpacity>
                  :
                  null
                }
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
    height: 370
  },
  promoText: {
    fontFamily: Fonts.regular,
    fontWeight: 'bold',
    position: 'absolute',
    paddingTop: 8,
  },
  person: {
    zIndex: 1,
    width: 152,
    position: 'absolute',
    right: 16, bottom: -52,
    paddingBottom: 62,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  header: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    height: 55,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  progress: {
    width: 68,
    height: 68,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress_circle: {
    position: 'absolute',
    width: 66,
    height: 66,
    borderRadius: 88,
    borderWidth: 2,
    borderColor: '#ffffff24',
    top: 1,
    left: 1
  },
  progress_text: {
    color: Colors.tintColor,
    position: 'absolute',
    fontSize: 20,
    lineHeight: 30
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
    width: 340,
    height: 340,
    position: 'absolute',
    right: -60,
    bottom: 20
  },
  x_gr: {
    width: 320,
    height: 320,
    position: 'absolute',
    left: -100,
    bottom: 70
  },
  count_text: {
    fontFamily: Fonts.bold,
    fontWeight: 'bold',
    fontSize: 66,
    position: 'absolute',
    right: 24,
    bottom: 160,
    color: '#00000036'
  },
  count_text_s: {
    fontFamily: Fonts.bold,
    fontWeight: 'bold',
    fontSize: 48,
    color: '#00000036'
  },
  item: {
    position: 'relative',
    width: '100%',
    backgroundColor: Colors.second_bg,
    // overflow: 'hidden',
  },
  image: {
    alignSelf: 'center',
    position: 'absolute',
    top: 8,
  },
  image_hide: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0
  },
  title: {
    marginRight: 100,
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 28,
    paddingBottom: 8,
  },
  footer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buy_product: {
    height: 24,
    backgroundColor: '#FF9533',
    alignSelf: 'flex-start',
    paddingLeft: 24,
    marginTop: 16,
    marginHorizontal: -24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    borderTopRightRadius: Platform.OS === 'ios' ? 8 : 24,
  },

});

export default CourseHead;
