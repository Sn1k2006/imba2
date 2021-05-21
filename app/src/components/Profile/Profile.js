import React, {Component} from 'react';
import {Animated, Keyboard, ScrollView, Platform, RefreshControl} from 'react-native';

import {inject, observer} from "mobx-react";
import {action, observable, toJS} from "mobx";
import ProfileHeader from "./ProfileHeader";
import ProfileStickyHeader from "./ProfileStickyHeader";
import ProfileContent from "./ProfileContent";
import CreateBlog from "../Blog/CreateBlog";
import CustomBtn from "../elements/CustomBtn";
import {toast} from "../../utils";
import {readNotification} from "../../actions/notifications";
import Colors from "../../constants/Colors";
import {NavigationEvents} from "react-navigation";

const HEADING = Platform.OS === 'ios' ? 138 : 126;


@inject('userStore', 'appStore')
@observer
class Profile extends Component {
  sticky = new Animated.Value(0);

  @observable scroll_enabled = true;
  @observable create_blog_modal_visible = false;
  @observable refreshing = false;
  @observable loading_tab_0 = false;
  @observable loading_tab_1 = true;
  @observable loading_tab_2 = true;
  @observable end_reached_tab_0 = false;
  @observable end_reached_tab_1 = false;
  @observable end_reached_tab_2 = false;
  @observable sticky_visible = false;
  @observable wrap_scrolling = true;
  @observable active_idx = 0;


  @action setEndReached = (name) => {
    this[name] = false;
  };
  @action toggleScrollEnabled = () => {
    this.scroll_enabled = !this.scroll_enabled;
  };

  @action changeTab = async (idx) => {
    Keyboard.dismiss();
    const i = idx?.i || 0;
    const from_i = idx?.from || 0;
    const {userStore} = this.props;
    if(i === 1 && i !== from_i && userStore?.user?.notifications_count) {
      await readNotification();
      userStore.get();
    }
    const from = idx?.from || 0;
    if (from !== i) {
      this.toggleScrollEnabled();
      this.active_idx = i;
      if (i === 0 && this.loading_tab_0) setTimeout(() => this.loading_tab_0 = false, 0);
      else if (i === 1 && this.loading_tab_1) setTimeout(() => this.loading_tab_1 = false, 0);
      if (from === 0) this.loading_tab_0 = true;
      else if (from === 1) this.loading_tab_1 = true;
    }
  };
  @action toggleSticky = (value) => {
    if (value) {
      this.triggerSticky(1);
      this.sticky_visible = value;
    } else {
      this.disableSticky();
    }
  };

  @action disableSticky = () => {
    this.sticky_visible = false;
    this.triggerSticky(0);
    Animated.timing(this.animatedTop, {
      toValue: 0,
      duration: 200,
      // useNativeDriver: true
    }).start();
  };
  @action showCreateBlogModal = () => {
    this.create_blog_modal_visible = true;
  };
  @action closeCreateBlogModal = () => {
    this.create_blog_modal_visible = false;
  };

  triggerSticky = (value) => {
    Animated.timing(this.sticky, {
      toValue: Number(value),
      // duration: value ? 200 : 0
      duration: 0
    }).start();
  };


  @action wrapScroll = (e) => {
    const {y} = e.nativeEvent.contentOffset;
    if (y >= HEADING + (Platform.OS === 'ios' ? 93 : 100)) {
      this.triggerSticky(true);
    } else {
      this.triggerSticky(false);
    }
  };

  @action childrenScroll = (e) => {
    const {y} = e.nativeEvent.contentOffset;
    if (y <= 0) {
      this.triggerSticky(false);
      this.wrap_scrolling = true;
    }
  };

  @action momentumScrollEnd = (e) => {
    const {contentOffset, contentSize, layoutMeasurement} = e.nativeEvent;
    const isEnd = (contentSize.height - layoutMeasurement.height - contentOffset.y) === 0;
    if (isEnd) {
      if(this.active_idx === 0) this.end_reached_tab_0 = true;
      else if(this.active_idx === 1) this.end_reached_tab_1 = true;
    }
  };

  @action onRefresh = async () => {
    this.refreshing = true;
    const {userStore} = this.props;
    try {
      if(this.active_idx === 1 && userStore?.user?.notifications_count) {
        await readNotification();
        userStore.get();
      }
      await this.props.init();
    } catch (e) {
      toast(e.message);
    }
    this.refreshing = false;
  };

  didFocus = async () => {
    const {userStore} = this.props;
    if(this.active_idx === 1 && userStore?.user?.notifications_count) {
      await readNotification();
    }
  };


  render() {
    const {userStore, appStore, ...otherProps} = this.props;
    const interpolatedSticky = this.sticky.interpolate({
      inputRange: [0, 1],
      outputRange: [-HEADING -50, 0]
    });

    return (
      <>
        <NavigationEvents onDidFocus={this.didFocus}/>
        <ScrollView
          refreshControl={
            <RefreshControl
              tintColor={Colors.tintColor}
              colors={[Colors.tintColor, Colors.secondColor]}
              refreshing={this.refreshing} onRefresh={this.onRefresh} />
          }
          onScroll={this.wrapScroll}
          style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 16 : 0}}
          // contentContainerStyle={{flexGrow: 1}}
          onMomentumScrollEnd={this.momentumScrollEnd}
          onEndReached={this.handleEndReached}
          onEndReachedThreshold={0.5}
          scrollEventThrottle={0.5}
        >
          <ProfileHeader
            user={toJS(userStore.user)}
            languages={toJS(appStore.languages)}
            ln={toJS(appStore.ln)}
            setLang={toJS(appStore.setLang)}
          />
          <ProfileContent
            sticky_visible={this.sticky_visible}
            scroll_enabled={this.scroll_enabled}
            addBlog={this.showCreateBlogModal}
            header_height={HEADING}
            active_idx={this.active_idx}
            changeTab={this.changeTab}
            loading_tab_0={this.loading_tab_0}
            loading_tab_1={this.loading_tab_1}
            end_reached_tab_0={this.end_reached_tab_0}
            end_reached_tab_1={this.end_reached_tab_1}
            setEndReached={this.setEndReached}
            hideAddButton={this.hideAddButton}
            {...otherProps}
          />
        </ScrollView>
        <ProfileStickyHeader
          interpolated={interpolatedSticky}
          user={userStore.user}
          height={HEADING}
          active_idx={this.active_idx}
          changeTab={this.changeTab}
        />
        { (this.props.finished_courses?.length && this.active_idx === 1)
        || (this.props.my_blog?.data?.length && this.active_idx === 2)
          ?
          <CustomBtn
            btn_style={{width: 52, height: 52, paddingHorizontal: 0}}
            wrap_style={{position: 'absolute', bottom: 78, right: 24, zIndex: 1,}}
            icon={'plus'}
            onPress={this.showCreateBlogModal}
          />
          :
          null
        }
        <CreateBlog
          handleOk={this.props.afterCreateBlog}
          visible={this.create_blog_modal_visible}
          onClose={this.closeCreateBlogModal}
          courses={this.props.finished_courses}
          courses_filtered
        />
      </>
    );
  }
}

export default Profile;
