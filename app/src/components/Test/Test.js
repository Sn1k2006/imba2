import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {withNavigation} from 'react-navigation';
import {Text, Content} from 'native-base';
import Styles from "../../constants/Styles";
import TestBody from "./TestBody";

class Test extends Component {
  componentDidMount() {
    this.props.changeTestProgress(0)
  }

  scrollTop = () => {
    this.scrollView._root.scrollToPosition(0,0, false);
  };

  checkMulti = (data) => {
    let multi = 1;
    if(data?.answers?.length) {
      const res = data.answers.filter(item => item.rightness);
      multi = res.length;
    }
    return multi;
  };

  render() {
    const {data, question_index, setAnswer} = this.props;
    const {questions = []} = data?.json;
    return (
      <Content
        ref={ref => this.scrollView = ref}
        style={styles.container}
        contentContainerStyle={{flexGrow: 1}}
      >
        <Text style={[Styles.text_muted, styles.progress_text]}>
          {(question_index || 0) + 1} / {questions.length || 0}
        </Text>
        <TestBody
          changeTestProgress={this.props.changeTestProgress}
          question={questions[question_index]}
          setAnswer={setAnswer}
          scrollTop={this.scrollTop}
          multi={this.checkMulti(questions[question_index])}
        />
      </Content>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  progress_text: {
    textAlign: 'center',
  }
});

export default withNavigation(Test);
