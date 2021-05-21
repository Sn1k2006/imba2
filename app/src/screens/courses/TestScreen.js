import React, {Component} from 'react';
import {Platform, SafeAreaView} from 'react-native';
import {Container, View} from 'native-base';
import {beginLearning, finishedLearning} from "../../actions/courses";
import {toast} from "../../utils";
import TestContainer from "../../containers/Courses/TestContainer";
import ErrorIndicator from "../../components/ErrorIndicator";
import Spinner from "../../components/Spinner";
import {NavigationEvents} from "react-navigation";
import Colors from "../../constants/Colors";
import LinearGradient from "react-native-linear-gradient";
import MyStatusBar from "../../components/MyStatusbar";

class TestScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      data: null,
      parent: null,
      error: null,
      header_progress: null,
      type: 'section'
    }
  }

  componentDidMount() {
    this.init();
  }


  init = async () => {
    let header_progress = null;
    try {
      const id = await this.props.navigation.getParam('id');
      let course = await beginLearning(id);
      this.setState({
        data: course.data,
        parent: course.parent,
        ready: true,
        header_progress,
      });
      if (!course.data.type && !course.data?.length) {
        await finishedLearning(id);
      }
    } catch (e) {
      toast(e.message);
      this.setState({error: e, data: {}, parent: null, ready: true, header_progress});
    }
  };

  handleBack = async () => {
    const free = await this.props.navigation.getParam('free');
    const {parent} = this.state;
    this.props.navigation.replace('Course', {id: parent.id, name: parent?.json?.name, type: parent.type, free});
  };

  changeTestProgress = (curr_question) => {
    if (curr_question === null) return this.setState({header_progress: null});
    const header_progress = {all: this.state.data?.json?.questions?.length, done: curr_question || 0};
    this.setState({header_progress});
  };

  render() {
    if (this.state.error) return <ErrorIndicator error={this.state.error}/>;
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.second_bg}}>
      <Container>
        <LinearGradient style={{flex: 1}} colors={[Colors.second_bg, Colors.bg]}>
          <MyStatusBar translucent={true} hidden={false} backgroundColor={'transparent'}/>

          <NavigationEvents onDidFocus={this.didFocus} onDidBlur={this.didBlur} onWillBlur={this.willBlur}
                            onWillFocus={this.willFocus}/>
          {this.state.ready
            ?
            <>
            <TestContainer
              progress={this.state.header_progress}
              parent={this.state.parent}
              handleBack={this.handleBack}
              data={this.state.data}
              changeTestProgress={this.changeTestProgress}
            />
            </>
            :
            <Spinner/>
          }
        </LinearGradient>
      </Container>
        {Platform.OS === 'ios' ?
            <View style={{position: 'absolute', zIndex: -1, bottom: 0, left: 0, width: '100%', height: 70, backgroundColor:   Colors.bg}}/>
            :
            null
        }
      </SafeAreaView>
    );
  }
}

export default TestScreen;
