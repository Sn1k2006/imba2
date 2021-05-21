import React, {Component} from 'react';
import {Animated, StyleSheet, Platform} from 'react-native';
import {Text} from 'native-base';
import CustomTabs from "../elements/CustomTabs";
import Colors from "../../constants/Colors";
import Styles from "../../constants/Styles";
import {inject, observer} from "mobx-react";
import {translate} from "../../utils/index";

@inject('userStore')
@observer
class ProfileStickyHeader extends Component {
  render(){
    return (
      <Animated.View style={[styles.stickyHeader, {top: this.props.interpolated, height: this.props.height}]}>
        <Text style={[Styles.item_title, styles.name]}  numberOfLines={1} ellipsizeMode='tail'>{this.props.user?.name}</Text>
        <CustomTabs
          tabs={[translate('Achievements'), translate('Notifications')]}
          onPress={(i) => this.props.changeTab({i, from: this.props.active_idx})}
          active_idx={this.props.active_idx}
          imba
          notif_index={this.props.userStore?.user?.notifications_count ? [1] : []}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  stickyHeader: {
    position: 'absolute',
    left: 0,
    paddingTop: Platform.OS === 'ios' ? 30 : 10,
    flex: 1,
    backgroundColor: Colors.second_bg,
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    paddingBottom: 16,
  },
  name: {
    color: Colors.text,
    textAlign: 'center',
    paddingBottom: 24,
  },
});

export default ProfileStickyHeader;
