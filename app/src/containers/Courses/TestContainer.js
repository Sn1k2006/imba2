import React, {Component} from 'react';
import {View} from 'react-native';
import {observer} from 'mobx-react';
import {observable, action, toJS} from 'mobx';
import {withNavigation} from 'react-navigation';
import Spinner from "../../components/Spinner";
import {addSettings, beginLearning, finishedLearning, getPercent} from "../../actions/courses";
import {toast} from "../../utils";
import Test from "../../components/Test/Test";
import TestEnd from "../../components/Test/TestEnd";
import {separateAchiveInTest} from "../../actions/achievements";
import AchieveModal from "../../components/AchieveModal";
import BgGradient from "../../components/BgGradient";
import TestHeader from "../../components/Test/TestHeader";
import RepeatImage from "../../components/RepeatImage";

@observer
class TestContainer extends Component {
  @observable loading = true;
  @observable achiv_visible = false;
  @observable data = null;
  @observable question_index = 0;
  @observable answers = [];
  @observable test_end = false;
  @observable test_results = null;

  @action init = async (data) => {
    const { achievements} = data?.json;
    if(!data?.json?.questions?.length) {
      const percent = 100;
      const stars = 3;
      const mark = 10;
      const achievement = separateAchiveInTest(mark, toJS(achievements)) || null;
      const test_results = {percent, mark, answers: [], stars, achievement};
      try {
        await finishedLearning(data.id, test_results);
        this.test_results = test_results;
        this.test_end = 'passed';
      } catch (e) {
        toast(e.message);
      }
      return this.loading = false;
    }
    this.data = data;
    this.test_results = data.settings?.mark ? data.settings : null;
    if ((data.settings || data.progress) && this.test_results) this.test_end = 'passed';
    this.loading = false;
  };
  @action showAchiv = () => {
    this.achiv_visible = true;
  };
  @action closeAchiv = () => {
    this.achiv_visible = false;
  };
  @action setAnswer = async (answer) => {
    const {questions} = this.data?.json;
    this.answers = [...this.answers, answer];
    if (this.question_index < questions?.length - 1) {
      this.props.changeTestProgress(this.question_index + 1)
      this.question_index = this.question_index + 1;
      return true;
    } else {
      this.props.changeTestProgress(null)
      return await this.calculateResult();
    }

  };
  @action calculateResult = async () => {
    const {questions, achievements} = this.data?.json;
    const rightness = this.answers.filter(item => {
      let correctly = 0;
      item?.answers?.map(answ => {
        if (answ.rightness) correctly += 1
      });
      return correctly === item?.answers?.length;
    });
    const percent = getPercent(questions?.length, rightness?.length);
    let test_results = {percent, right_answers: rightness.length};
    if (percent < 70) {
      this.test_results = test_results;
      this.test_end = 'failed';
      await addSettings(this.data.id, {test: 'failed'});
    } else {
      let mark = 0;
      let stars = 0;
      if (percent >= 70 && percent < 80) {
        mark = 7;
        stars = 1;
      } else if (percent >= 80 && percent < 90) {
        mark = 8;
        stars = 2;
      } else if (percent >= 90 && percent < 100) {
        mark = 9;
        stars = 3;
      } else if (percent >= 100) {
        mark = 10;
        stars = 3;
      }
      const achievement = separateAchiveInTest(mark, toJS(achievements)) || null;
      test_results = {...test_results, mark, answers: toJS(this.answers), stars, achievement};
      try {
        await finishedLearning(this.data.id, test_results);
        this.test_results = test_results;
        this.test_end = 'passed';
        return false;
      } catch (e) {
        toast(e.message);
        return true;
      }
    }
  };

  @action endTestRoute = () => {
    if (this.test_end === 'passed') {
      this.props.handleBack();
    } else {
      this.test_end = null;
      this.question_index = 0;
      this.answers = [];
      this.test_results = null;
    }
  };

  componentDidMount() {
    this.init(this.props.data);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.data !== this.props.data) {
      this.init(this.props.data);
    }
  }

  get = async () => {
    try {
      const id = await this.props.navigation.getParam('id');
      let res = await beginLearning(id);
      this.init(res.data);
    } catch (e) {
      toast(e.message);
    }
  };

  render() {
    if (this.loading) return <Spinner page/>;
    return (
      <>
        {this.test_results?.mark  || (this.data?.settings && this.data.settings?.test !== 'failed') ? <BgGradient top/> : null }
        {this.test_results?.mark === 10
          ?
          <View style={{
            position: 'absolute',
            left: 0,
            top: -50,
            width: '100%',
            overflow: 'hidden',
            height: 250
          }}>
            {/*<Image style={[{width: 789, height: 800}]}*/}
            {/*       source={confetti}/>*/}
            <RepeatImage/>
          </View>
          :
          null
        }
        <TestHeader
          handleBack={this.props.handleBack}
          progress={this.props.header_progress}
        />
        {this.test_end
          ?
          <TestEnd
            showAchiv={this.showAchiv}
            test_results={toJS(this.test_results)}
            data={toJS(this.data)}
            test_end={toJS(this.test_end)}
            handleBack={this.endTestRoute}
          />
          :
          <Test
            changeTestProgress={this.props.changeTestProgress}
            data={toJS(this.data)}
            setAnswer={this.setAnswer}
            question_index={toJS(this.question_index)}
          />
        }
        <AchieveModal
          data={separateAchiveInTest(this.test_results?.mark, this.data?.json?.achievements)}
          visible={this.achiv_visible}
          close_btn={false}
          closeModal={this.closeAchiv}/>
        {/*<CustomModal visible={this.achiv_visible} onClose={this.closeAchiv} dark close_btn={false}>*/}
        {/*  <AchivModal achievements={} closeAchiv={this.closeAchiv}/>*/}
        {/*</CustomModal>*/}
      </>
    );
  }
}


export default withNavigation(TestContainer);
