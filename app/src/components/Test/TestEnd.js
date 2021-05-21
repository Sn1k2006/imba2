import React, {Component} from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {View, Text, Content} from 'native-base';
import Styles from "../../constants/Styles";
import Colors from "../../constants/Colors";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import CustomBtn from "../elements/CustomBtn";
import Stars from "../Stars";
import Fonts from "../../constants/Fonts";
import ShadowView from "react-native-simple-shadow-view/src/ShadowView";
import Icons from "../Icons";
import {separateAchiveInTest} from "../../actions/achievements";
import {translate} from "../../utils";

class TestEnd extends Component {

  componentDidMount() {

  }


  getAchieve = () => {
    const {test_results, data, test_end} = this.props;
    return test_end === 'passed' ? separateAchiveInTest(test_results?.mark, data?.json?.achievements) : null;
  };

  render() {
    const {test_results, data, test_end, showAchiv, handleBack} = this.props;
    // const achieve = test_end === 'passed' ? separateAchiveInTest(test_results?.mark, data?.json?.achievements) : null;
    return (
      <Content style={styles.container} contentContainerStyle={{flexGrow: 1}}>
        <Text style={[Styles.text_muted, styles.progress_text]}>
          {test_results?.right_answers || 0} / {data?.json?.questions?.length || 0}
        </Text>
        <View style={styles.content}>
          <View style={styles.progress}>
            {/*{test_end === 'passed' ? <Rays size={176} /> : null }*/}
            <Stars stars={test_results?.stars || 0} dark/>
            <View>
              <View style={styles.percent_back}>{Icons.progress_bg()}</View>
              <View style={styles.percent_inner}>
                <AnimatedCircularProgress
                  size={156}
                  width={11}
                  fill={test_results?.percent || 0}
                  rotation={180}
                  duration={0}
                  style={{borderRadius: 354}}
                  arcSweepAngle={360}
                  tintColor={'#01CB65'}
                  backgroundColor="#ffffff00"
                  children={() => <Text style={styles.percent}>{test_results?.percent || 0}%</Text>}
                >
                </AnimatedCircularProgress>
              </View>
            <AnimatedCircularProgress
              size={176}
              width={11}
              fill={test_results?.percent || 0}
              rotation={180}
              duration={0}
              style={{borderRadius: 354}}
              arcSweepAngle={360}
              tintColor={'#01CB65'}
              backgroundColor="#ffffff00"
              children={() => <Text style={styles.percent}>{test_results?.percent || 0}%</Text>}
            >
            </AnimatedCircularProgress>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 32}}>
              {test_end === 'passed'
                ?
                <TouchableWithoutFeedback
                  onPress={showAchiv}
                  hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
                  <View style={{width: 40}}/>
                </TouchableWithoutFeedback>
                :
                null}
              <ShadowView style={[Styles.shadow, styles.mark_shadow]}>
                <View style={{borderRadius: 4, overflow: 'hidden'}}>
                <Text style={styles.mark}>{translate('YOUR_POINTS')} {Math.floor((test_results?.percent || 0) / 10)} </Text>
                </View>
                </ShadowView>
              {test_end === 'passed'
                ?
                <TouchableWithoutFeedback
                  style={{pointerEvents: 'none'}}
                  onPress={this.getAchieve() ? showAchiv : null}
                  hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
                  <ShadowView style={[Styles.shadow, styles.about_test, this.getAchieve() ? {} : styles.disable_achive]}>
                    <View>
                    {Icons.achiv(32, '#FFDD00')}
                    </View>
                  </ShadowView>
                </TouchableWithoutFeedback>
                :
                null}
            </View>

            <View style={styles.for_user_text_wrap}>
              <Text style={[Styles.title_20, styles.congr_text]}>
                {test_end === 'passed'
                  ? data?.json?.success_test || ''
                  : data?.json?.failed_test || ''
                }
              </Text>




              <Text style={[Styles.text_muted_16, styles.congr_text]}>
                {test_end === 'passed'
                  ? translate(this.getAchieve() ? 'TEST_PASSED_achive' :'TEST_PASSED', 'change', test_results?.percent || 0)
                  : translate('TEST_FAILED', 'change', test_results?.percent || 0)
                }
              </Text>
            </View>
          </View>
          <CustomBtn
            wrap_style={{marginVertical: 32}}
            width={247}
            onPress={handleBack}
            title={test_end === 'passed' ? translate('Excellent') : translate('Try_again')}
          />
        </View>
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  percent_back: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    // backgroundColor: 'red',
    width: 176,
    height: 176,
    bottom: 0,
  },
  percent_inner: {
    opacity: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    // backgroundColor: 'red',
    width: 176,
    height: 176,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  progress_text: {
    zIndex: 2,
    textAlign: 'center',
    marginBottom: 24
  },
  progress: {
    flex: 0,
    // backgroundColor: Colors.bg,
    borderRadius: 120,
    alignItems: 'center',
    alignSelf: 'center',
  },
  percent: {
    fontSize: 32,
    fontFamily: Fonts.bold,
    fontWeight: 'bold',
    color: Colors.text,
    lineHeight: 44
  },
  mark_shadow: {
    marginHorizontal: 24,
    borderRadius: 4,
    backgroundColor: Colors.second_bg
  },
  mark: {
    fontSize: 17,
    fontFamily: Fonts.medium,
    color: '#fff',
    lineHeight: 28,
    paddingVertical: 11,
    paddingHorizontal: 24,
    height: 50,
  },
  for_user_text_wrap: {
    marginTop: 32,
    padding: 8
  },
  congr_text: {
    width: 230,
    textAlign: 'center',
    lineHeight: 23,
    marginTop: 8
  },
  about_test: {
    backgroundColor: Colors.second_bg,
    width: 40,
    height: 40,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  disable_achive: {
    opacity: 0.4,
  }

});

export default TestEnd;
