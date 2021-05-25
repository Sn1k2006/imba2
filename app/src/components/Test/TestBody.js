import React, {useState} from 'react';
import {StyleSheet, Image, TouchableWithoutFeedback} from 'react-native';
import {View, Text} from 'native-base';
import CustomBtn from "../elements/CustomBtn";
import Styles from "../../constants/Styles";
import {addHostToPath, getImageMaxSize, translate} from "../../utils";
import ShadowView from "react-native-simple-shadow-view";
import Colors from "../../constants/Colors";
import LinearGradient from "react-native-linear-gradient";
import FastImage from "react-native-fast-image";

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const TestBody = ({question, setAnswer, scrollTop, multi}) => {
  const [active, setActive] = useState([]);
  const [btn_loading, setBtnLoading] = useState(false);

  const handleClick = (idx) => () => {
    setActive(prevState => {
      let result = [];
      if (multi > 1) {
        if (active.includes(idx)) {
          result = prevState.filter(item => item !== idx);
        } else {
          result = [...prevState, idx];
        }
      } else {
        result = [idx];
      }
      return result;
    });
  };
  const handleNext = async () => {
    setBtnLoading(true);
    let res = [];
    let correct = 0;
    active.map(i => {
      if(question.answers[i].rightness) correct += 1;
     return res.push(question.answers[i]);
    });
    res = await setAnswer({multi, answers: res, correct});
    setActive([]);
    if (res) {
      setBtnLoading(false);
      scrollTop();
    }
  };

  const renderQuestion = () => {
    return question?.title.map((item, i) => (
      <View key={i}>
        {item.type === 'text'
          ?
          <Text style={[Styles.title_20, {paddingBottom: 24, flex: 0}]}>{item.text}</Text>
          :
          <ShadowView style={[Styles.shadow, styles.shadow]}>
            <FastImage source={{uri: addHostToPath(item.image)}}
                   style={[styles.image, getImageMaxSize(item.image?.image_width || item.image?.image_wth, item.image?.image_height, 320)]}/>
          </ShadowView>
        }
      </View>
    ))
  };
  const renderAnswers = () => {
    return question?.answers.map((answ, i) => (
      <TouchableWithoutFeedback key={i} onPress={handleClick(i)}>
        {active.includes(i)
        ?
          <LinearGradient
            start={{x: 0, y: 0}} end={{x: 1, y: 0}}
            colors={['#7460f9', '#ac49b3']}
            locations={[0.3, 1]}
            style={styles.answer}
          >
            <Text
              style={[Styles.input, styles.text_num, active.includes(i) ? styles.text_active : {}]}>{alphabet[i]}.</Text>
            <Text style={[Styles.input, styles.text, active.includes(i) ? styles.text_active : {}]}>{answ.text}</Text>
          </LinearGradient>
        :
          <View style={[styles.answer]}>
            <Text
              style={[Styles.input, styles.text_num, active.includes(i) ? styles.text_active : {}]}>{alphabet[i]}.</Text>
            <Text style={[Styles.input, styles.text, active.includes(i) ? styles.text_active : {}]}>{answ.text}</Text>
          </View>
        }
      </TouchableWithoutFeedback>
    ))
  };
  return (
    <View style={styles.container}>
      <View>
        <View>
          {renderQuestion()}
        </View>
        {multi > 1
          ?
          <Text style={[Styles.text_muted, {textAlign: 'center'}]}>{translate('SEVERAL_ANSWERS')}</Text>
          :
          null
        }
        {renderAnswers()}
      </View>
      <CustomBtn
        wrap_style={styles.btn}
        disabled={active.length < multi}
        title={translate('Next')}
        width={247}
        onPress={handleNext} loading={btn_loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  btn: {
    marginVertical: 32
  },
  shadow: {
    alignSelf: 'center',
    marginBottom: 24
  },
  image: {
  },
  answer: {
    backgroundColor: Colors.item_bg,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 16,
    flexDirection: 'row'
  },
  answer_active: {
    backgroundColor: Colors.secondColor
  },
  text_active: {
    color: '#fff'
  },
  text_num: {
    color: '#ffffff80',
    width: 40,
    flex: 0,
  },
  text: {
    color: '#ffffff80',
    flex: 1,
  },
});

export default TestBody;
