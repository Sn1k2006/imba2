import React, {Component} from 'react';
import {Platform} from 'react-native';
import Layout from "../../components/Layout";
import {beginLearning, finishedLearning} from "../../actions/courses";
import ErrorIndicator from "../../components/ErrorIndicator";
import {NavigationEvents} from "react-navigation";
import Spinner from "../../components/Spinner";
import CourseContainer from "../../containers/Courses/CourseContainer";
import MaterialContainer from "../../containers/Courses/MaterialContainer";
import ChecklistContainer from "../../containers/Courses/ChecklistContainer";
import {StatusBar, SafeAreaView} from "react-native";
import PollContainer from "../../containers/Courses/PollContainer";
import TaskContainer from "../../containers/Courses/TaskContainer";
import MyStatusBar from "../../components/MyStatusbar";
import Colors from "../../constants/Colors";
import RadialGradient from "react-native-radial-gradient";

class CourseScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      index: 0,
      data: null,
      parent: null,
      time_to_open: null,
      name: null,
      error: null,
      header_progress: null,
      checklist: null,
      section_loading: false,
      lock_loading: false,
      type: 'section',
      free_visible: false
    }
  }


  componentDidMount() {
    this.getName();
  }


  didFocus = async () => {
    StatusBar.setBarStyle('light-content', false);
    await this.init();
  };

  willFocus = async () => {
    this.setState({lock_loading: true, ready: false});
  };

  getName = async () => {
    const name = await this.props.navigation.getParam('name');
    const type = await this.props.navigation.getParam('type') || 'direction';
    this.setState({name, type});
  };

  init = async () => {
    let header_progress = null;
    let checklist = null;
    try {
      await this.getName();
      const id = await this.props.navigation.getParam('id');
      const index = await this.props.navigation.getParam('index');
      let course = await beginLearning(id);
      if (course.data?.type === 'checklist') {
        checklist = course.data?.settings?.checklist;
        header_progress = {all: course.data?.json?.body?.length, done: checklist?.length || 0}
      }
      this.setState({
        data: course.data,
        index: index,
        parent: course.parent,
        time_to_open: course.time_to_open,
        time_when_open: course.time_when_open,
        ready: true,
        header_progress,
        checklist,
        lock_loading: false,
      });
      if (!course.data.type && !course.data?.length) {
        finishedLearning(id);
      }
    } catch (e) {
      this.setState({error: e, data: {}, parent: null, ready: true, header_progress, checklist, lock_loading: false});
    }
  };

  handleBack = async () => {
    const {data, parent} = this.state;
    const prevRoute = await this.props.navigation.getParam('prevRoute');
    const free = await this.props.navigation.getParam('free');
    if (prevRoute === 'NewsArticle') {
      this.props.navigation.navigate('NewsArticle');
    } else if (data?.type) {
      this.props.navigation.replace('Course', {id: parent.id, name: parent?.json?.name, type: parent.type, free: free});
    } else if (this.state.parent?.json?.type === 'section') {
      this.props.navigation.replace('Course', {
        id: parent?.parent?.id,
        name: parent?.parent?.name,
        free: free,
        type: this.state.parent?.parent?.type
      });
    } else if (parent?.json?.type === 'direction') {
      this.props.navigation.navigate('Courses', {type: 'direction', free: free});
    } else {
      this.props.navigation.goBack();
    }
  };

  setSectionLoading = () => {
    this.setState({section_loading: true});
  };

  changeChecklist = (checklist) => {
    const header_progress = {all: this.state.data?.json?.body?.length, done: checklist?.length || 0};
    this.setState({checklist, header_progress});
  };

  courseRefresh = async () => {
    const id = await this.props.navigation.getParam('id');
    let course = await beginLearning(id);
    this.setState({
      data: course.data,
      parent: course.parent,
    });
  };


  render() {
    if (this.state.error) return <ErrorIndicator error={this.state.error}/>;
    return (
      <SafeAreaView style={{flex: 1, height: '100%', backgroundColor: Colors.second_bg}}>
        {Platform.OS === 'ios'
          ?
          <MyStatusBar translucent={true} hidden={false} backgroundColor={'transparent'} padding={false}/>
          :
          null
        }
        <MyStatusBar translucent={true} hidden={false} backgroundColor={'transparent'} padding={false}/>
        <NavigationEvents onDidFocus={this.didFocus} onDidBlur={this.didBlur} onWillBlur={this.willBlur}
                          onWillFocus={this.willFocus}/>
        {Array.isArray(this.state.data)
          ?
          this.state.ready
            ?
            <CourseContainer
              onRefresh={this.courseRefresh}
              handleBack={this.handleBack}
              index={this.state.index}
              data={this.state.data}
              type={this.state.type}
              parent={this.state.parent}
              time_to_open={this.state.time_to_open}
              time_when_open={this.state.time_when_open}
              title={this.state.name}
              lock_loading={this.state.lock_loading}/>
            : <Spinner page/>
          :
          <Layout title={this.state.name}
                  header={this.state.type !== 'direction'}
                  close={this.state.type === 'poll' || this.state.data?.type === 'poll'}
                  headerLeftClick={this.handleBack}
                  progress={this.state.header_progress}
                  footer={this.state.type !== 'poll' && this.state.data?.type !== 'poll' && this.state.type !== 'task' && this.state.data?.type !== 'task'}
                  noContent
                  active='courses'
          >

            {this.state.ready
              ?
              <>
                {/*{Platform.OS === 'android' ? <MyStatusBar /> : null}*/}
                {this.state.data?.type === 'material'
                  ? <MaterialContainer
                    data={this.state.data}
                    setSectionLoading={this.setSectionLoading}
                    handleBack={this.handleBack}/>
                  : null}
                {this.state.data?.type === 'checklist'
                  ? <ChecklistContainer
                    data={this.state.data}
                    handleBack={this.handleBack}
                    changeChecklist={this.changeChecklist}
                    checklist={this.state.checklist}
                  />
                  : null
                }
                {this.state.data?.type === 'poll'
                  ? <PollContainer
                    handleBack={this.handleBack}
                    data={this.state.data}
                  />
                  : null}
                {this.state.data?.type === 'task'
                  ? <TaskContainer
                    handleBack={this.handleBack}
                    data={this.state.data}
                  />
                  : null}
              </>
              : <Spinner/>
            }

          </Layout>
        }
      </SafeAreaView>
    );
  }
}


export default CourseScreen;


