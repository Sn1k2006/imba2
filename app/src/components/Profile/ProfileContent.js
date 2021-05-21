import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Platform} from 'react-native';
import ProfileAchievements from "./ProfileAchievements";
import Layout from "../../constants/Layout";
import CustomTabs from "../elements/CustomTabs";
import {inject, observer} from "mobx-react";
import {translate} from "../../utils";
import ProfileNotifications from "./ProfileNotifications";

@inject('userStore')
@observer
class ProfileContent extends Component {

  onScrollEndDrag = (e) => {
    const index = e.nativeEvent.contentOffset.x / (Layout.window.width);
    this.props.changeTab({i: index, from: this.props.active_idx})
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.active_idx !== this.props.active_idx) {
      this._scroll.scrollTo({x: Layout.window.width * this.props.active_idx, animated: false});
    }
  }

  render() {
    const {
      active_idx,
      changeTab,
      loading_tab_1,
      loading_tab_0,
      end_reached_tab_0,
      end_reached_tab_1,
      sticky_visible,
      scroll_enabled,
      userStore,
      ...otherProps
    } = this.props;
    const minContentHeight = Layout.window.height - otherProps.header_height - (Platform.OS === 'ios' ? 35  : 60);
    return (
      <View style={[styles.container]}>
        <CustomTabs tabs={[translate('Achievements'), translate('Notifications')]}
                    onPress={(i) => this.props.changeTab({i, from: this.props.active_idx})}
                    active_idx={this.props.active_idx} imba notif_index={userStore?.user?.notifications_count ? [1] : []}/>
        <ScrollView
          scrollEnabled={scroll_enabled}
          ref={(scroll) => this._scroll = scroll}
          horizontal
          decelerationRate={'fast'}
          scrollEventThrottle={1}
          itemsPerInterval={1}
          centerContent
          pagingEnabled={true}
          snapToInterval={Layout.window.width}
          onMomentumScrollEnd={this.onScrollEndDrag}
          showsHorizontalScrollIndicator={false}
          // keyboardShouldPersistTaps={'always'}
        >
            <ProfileAchievements
                minHeight={minContentHeight}
              end_reached={end_reached_tab_0}
              loading_tab={loading_tab_0}
              {...otherProps}/>
            <ProfileNotifications
                minHeight={minContentHeight}
              loading_tab={loading_tab_1}
              active_idx={active_idx}
              end_reached={end_reached_tab_1}
              {...otherProps}/>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minHeight: 1000
  },
  tabs_wrap: {
    width: '100%',
  }
});

export default ProfileContent;
