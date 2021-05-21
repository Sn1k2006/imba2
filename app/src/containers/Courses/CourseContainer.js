import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {observable, action, toJS} from 'mobx';
import {withNavigation} from 'react-navigation';
import Spinner from "../../components/Spinner";
import {addSettings, beginLearning, separateToolsFromData} from "../../actions/courses";
import {toast} from "../../utils";
import Course from "../../components/Course";
import {Animated, Platform, RefreshControl, ScrollView, StyleSheet} from "react-native";
import {Container, View} from "native-base";
import Tools from "../../components/Course/Tools";
import Colors from "../../constants/Colors";
import {translate} from "../../utils/index";
import CourseHead from "../../components/Course/CourseHead";
import Layout from "../../constants/Layout";
import CustomTabs from "../../components/elements/CustomTabs";
import LinearGradient from "react-native-linear-gradient";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CourseStickyHeader from "../../components/Course/CourseStickyHeader";
import MyStatusBar from "../../components/MyStatusbar";
import FreeCourseModal from "../../components/Course/FreeCourseModal";

const HEADING = Platform.OS === 'ios' ? 360 : 370;

@inject('appStore', 'userStore')
@observer
class CourseContainer extends Component {
  sticky = new Animated.Value(0);
  state = {
    active_tab: 0
  };
  @observable loading = true;
  @observable free_visible = null;
  @observable data = null;
  @observable tools = null;
  @observable active_index = null;
  @observable loading_tab_0 = false;
  @observable loading_tab_1 = true;
  @observable refreshing = false;


  @action init = (data) => {
    data = separateToolsFromData(data, this.props.parent);
    this.data = data.data;
    this.tools = data.tools;
    this.active_index = data.active_index;
    this.loading = false;
    this.loading_tab_0 = false;
  };

  @action checkFreeModal = async () => {
    const free = await this.props.navigation.getParam('free');
    const {parent, appStore, userStore} = this.props;
    if (free && !appStore.subscribed && !parent?.settings?.showFree && !userStore.user?.user_products?.includes(parent?.root) && parent.type === 'direction') {
      this.free_visible = this.data?.[this.active_index];
      await addSettings(parent.id, {showFree: 1});
    }
  };

  @action closeFreeModal = () => {
    this.free_visible = null
  };

  @action changeTab = (idx) => {
    const i = idx?.i || 0;
    const from = idx?.from || 0;
    if (from !== i) {
      this._horizontal_scroll.scrollTo({x: Layout.window.width * this.state.active_tab, animated: false});
      this.setState({active_tab: i})
      if (i === 0 && this.loading_tab_0) setTimeout(() => this.loading_tab_0 = false, 0);
      else if (i === 1 && this.loading_tab_1) setTimeout(() => this.loading_tab_1 = false, 0);
      if (from === 0) this.loading_tab_0 = true;
      else if (from === 1) this.loading_tab_1 = true;
    }
  };

  onScrollHorizontalEndDrag = (e) => {
    const index = e.nativeEvent.contentOffset.x / (Layout.window.width);
    this.changeTab({i: index, from: this.state.active_tab})
  };


  setCurrentPosition = (pos) => {
    if (!this.state.active_tab) this._vertical_scroll?.scrollTo({y: pos - 50});
  };

  componentDidMount() {
    this.init(this.props.data);
    this.checkFreeModal()
  }


  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      this.init(this.props.data);
    }
    if (prevState.active_tab !== this.state.active_tab) {
      this._horizontal_scroll.scrollTo({x: Layout.window.width * this.state.active_tab, animated: false});
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

  courseRouting = (item, product) => {
    this.loading = true;
    const {appStore, userStore, navigation, parent} = this.props;
    const {params} = navigation.state;
    if (product) {
      navigation.navigate({
        routeName: 'Subscribe',
        params: {name: parent.name, id: parent.id, type: parent.type, free: params?.free, root: parent.root},
        key: 'Course' + parent.id,
      });
    } else {
      if (item.type === 'end_section') return null;
      let name = null;
      if (item.type === 'section' || item.type === 'direction') {
        name = item.name;
      }
      let routeName = !appStore.subscribed && !params?.free && !userStore.user?.user_products?.includes(item?.root) ? 'Subscribe' : 'Course';
      if (item.type === 'test') routeName = "Test";
      navigation.navigate({
        routeName,
        params: {name, id: item.id, type: item.type, free: params?.free, root: item.root},
        key: 'Course' + item.id,
      });
    }
  };

  @action wrapScroll = (e) => {
    if (this.props.type === 'section') return;
    const {y} = e.nativeEvent.contentOffset;
    if (y >= HEADING - (Platform.OS === 'ios' ? 94 : 84)) {
      this.triggerSticky(true);
    } else {
      this.triggerSticky(false);
    }
  };

  triggerSticky = (value) => {
    Animated.timing(this.sticky, {
      toValue: Number(value),
      duration: 0
    }).start();
  };

  @action onRefresh = async () => {
    this.refreshing = true;
    await this.props.onRefresh();
    this.refreshing = false
  };

  render() {
    const {parent, handleBack, title, type, time_to_open, time_when_open, navigation} = this.props;
    if (this.loading) return <Spinner page/>;
    const interpolatedSticky = this.sticky.interpolate({
      inputRange: [0, 1],
      outputRange: [-HEADING - 50, 0]
    });
    const disabled_tools = !this.tools?.length || (!this.props.appStore.subscribed && !navigation.state?.params?.free);
    const minContentHeight = Layout.window.height - HEADING + (Platform.OS === 'ios' ? 140 : 165);
    return (
      <View style={{flex: 1}}>
        <Container style={{flex: 1}}>
          <LinearGradient style={{flex: 1}} colors={[Colors.second_bg, Colors.bg]}>
            {Platform.OS === 'android' ? <MyStatusBar/> : null}
            {type === 'section'
              ?
              <>
                <Header headerLeftClick={handleBack} title={title}/>
                <View style={{marginTop: 16}}>
                  <CustomTabs tabs={[translate('LESSONS'), translate('USEFUL_TOOLS')]}
                              disabled={[disabled_tools ? 1 : null]}
                              container_style={{paddingBottom: 16}}
                              onPress={(i) => this.changeTab({i, from: this.state.active_tab})}
                              active_idx={this.state.active_tab} imba/>
                </View>
              </>
              :
              null
            }
            <ScrollView
              ref={(scroll) => this._vertical_scroll = scroll}
              refreshControl={
                <RefreshControl
                  tintColor={Colors.tintColor}
                  refreshing={this.refreshing} onRefresh={this.onRefresh}
                  colors={[Colors.tintColor, Colors.secondColor]}/>
              }
              onScroll={this.wrapScroll}
              style={{flex: 1}}
              onMomentumScrollEnd={this.momentumScrollEnd}
              onEndReached={this.handleEndReached}
              onEndReachedThreshold={0.5}
              scrollEventThrottle={0.5}
            >
              <View style={[styles.container]}>
                {type === 'direction'
                  ?
                  <>
                    <CourseHead
                      data={parent}
                      index={this.props.index}
                      handleBack={handleBack}
                      courseRouting={this.courseRouting}
                      progress={parent?.progress}
                    />
                    <View style={{marginTop: -20}}>
                      <CustomTabs
                        tabs={[translate('LESSONS'), translate('USEFUL_TOOLS')]}
                        disabled={[disabled_tools ? 1 : null]}
                        onPress={(i) => this.changeTab({i, from: this.state.active_tab})}
                        active_idx={this.state.active_tab}
                        imba
                      />
                    </View>
                  </>
                  :
                  null
                }
                <View>
                  <ScrollView
                    ref={(scroll) => this._horizontal_scroll = scroll}
                    onMomentumScrollEnd={this.onScrollHorizontalEndDrag}
                    horizontal
                    scrollEnabled={!disabled_tools}
                    decelerationRate={'fast'}
                    scrollEventThrottle={1}
                    centerContent
                    style={{paddingTop: type === 'section' ? 16 : 24}}
                    pagingEnabled={true}
                    snapToInterval={Layout.window.width}
                    showsHorizontalScrollIndicator={false}
                    // keyboardShouldPersistTaps={'always'}
                  >
                    <Course
                      minHeight={minContentHeight}
                      setCurrentPosition={this.setCurrentPosition}
                      handleRoute={this.courseRouting}
                      data={toJS(this.data)}
                      active_index={toJS(this.active_index)}
                      get={this.get}
                      time_to_open={time_to_open}
                      time_when_open={time_when_open}
                      lock_loading={this.props.lock_loading}
                      loading_tab={this.loading_tab_0}
                    />
                    <Tools
                      minHeight={minContentHeight}
                      data={toJS(this.tools)}
                      loading_tab={this.loading_tab_1}
                    />
                  </ScrollView>
                </View>
              </View>
            </ScrollView>
            <CourseStickyHeader
              disabled_tools={disabled_tools}
              handleBack={handleBack}
              interpolated={interpolatedSticky}
              title={title}
              height={HEADING}
              active_idx={this.state.active_tab}
              changeTab={this.changeTab}
            />
          </LinearGradient>
          <Footer active={'courses'}/>
        </Container>
        <FreeCourseModal visible={toJS(this.free_visible)} closeModal={this.closeFreeModal} first/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default withNavigation(CourseContainer);
