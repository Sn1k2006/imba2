import React, {Component} from 'react';
import {Image, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {View, Text} from 'native-base';
import {action, observable} from "mobx";
import x_b_1 from "../../assets/images/x/x_b_1.png";
import x_gr_1 from "../../assets/images/x/x_gr_1.png";
import x_b_2 from "../../assets/images/x/x_b_2.png";
import x_gr_2 from "../../assets/images/x/x_gr_2.png";
import x_b_3 from "../../assets/images/x/x_b_3.png";
import x_gr_3 from "../../assets/images/x/x_gr_3.png";
import x_b_4 from "../../assets/images/x/x_b_4.png";
import x_gr_4 from "../../assets/images/x/x_gr_4.png";
import x_b_5 from "../../assets/images/x/x_b_5.png";
import x_gr_5 from "../../assets/images/x/x_gr_5.png";
import {inject, observer} from "mobx-react";
import {getColor, getPercent} from "../../actions/courses";
import LinearGradient from "react-native-linear-gradient";
import {addHostToPath, getImageMaxSize, translate} from "../../utils";
import Styles from "../../constants/Styles";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";
import Icons from "../Icons";

const ITEM_BG = '#0d2b2d';
const ITEM_GRAD_1 = '#173655';
const ITEM_GRAD_2 = '#41202a';

@inject('userStore')
@observer
class CourseHead extends Component {
  @observable image = null;
  @action init = () => {
    let idx = this.props.index % 5;
    if (idx === 0) this.image = [x_b_1, x_gr_1];
    else if (idx === 1) this.image = [x_b_2, x_gr_2];
    else if (idx === 2) this.image = [x_b_3, x_gr_3];
    else if (idx === 3) this.image = [x_b_4, x_gr_4];
    else if (idx === 4) this.image = [x_b_5, x_gr_5];
    else this.image = [x_b_1, x_gr_1];
  };

  componentDidMount() {
    this.init();
  }

  render() {
    const {data, index, handleBack, progress, courseRouting, userStore} = this.props;
    const color = getColor(index);
    const percent = getPercent(progress.all, progress?.done);
    // if (data?.type !== 'direction') return null;
    return (
      <View style={styles.container}>
        <LinearGradient
          style={[styles.item, styles.shadow, {shadowColor: color}]}
          start={{x: 1, y: 0.13}} end={{x: 0.5, y: 1.4}}
          locations={[0, 0.2, 1]}
          colors={[index % 2 ? ITEM_GRAD_2 : ITEM_GRAD_1, ITEM_BG, ITEM_BG]}
        >
          {data?.parent?.bg_img
            ?
            <View style={[styles.image]}>
              <Image
                source={{uri: addHostToPath(data?.parent?.bg_img)}}
                style={[getImageMaxSize(data?.parent?.bg_img?.image_width, data?.parent?.bg_img?.image_height, 250)]}
              />
              <LinearGradient style={styles.image_hide} colors={['#0d2b2d00', '#0d2b2d90', '#0d2b2d']}
                              start={{x: 0.0, y: 0.6}} end={{x: 0, y: 1}}/>
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
          <View style={{width: '100%', height: '100%', padding: 24, paddingTop: 0, justifyContent: 'space-between'}}>
            {this.image
              ?
              <View style={styles.x_wrap}>
                <Image source={this.image[0]} style={styles.x_b}/>
                <Image source={this.image[1]} style={styles.x_gr}/>
              </View>
              :
              null
            }
            <View style={{height: Platform.OS === 'ios' ? 255 : 275, justifyContent: 'flex-end', paddingBottom: 24}}>
              <View style={styles.progress}>
                <View style={styles.progress_circle}/>
                <Text style={[Styles.item_title, styles.progress_text]}>{percent}%</Text>
                <AnimatedCircularProgress
                  size={68}
                  width={4}
                  fill={percent}
                  rotation={180}
                  duration={0}
                  arcSweepAngle={360}
                  tintColor={Colors.tintColor}
                  backgroundColor="#ffffff00"
                />
              </View>
              {/*<CardLogo size={68} image={data?.image} icon={'home'} icon_size={36} bgc={Colors.item_bg} round/>*/}
              <Text style={[Styles.title, styles.title]} ellipsizeMode='tail' numberOfLines={3}>{data?.name}</Text>
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
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {

    backgroundColor: 'red',
    justifyContent: 'flex-start',
    alignItems: 'center',
    overflow: 'hidden',
    height: 370
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
    backgroundColor: '#0d2b2d',
    // overflow: 'hidden',
  },
  image: {
    alignSelf: 'center',
    position: 'absolute',
    top: 8,
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
    fontSize: 24,
    lineHeight: 28,
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
