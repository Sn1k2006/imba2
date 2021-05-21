import React, {Component} from 'react';
import {Animated, StyleSheet, Platform} from 'react-native';
import CustomTabs from "../elements/CustomTabs";
import Colors from "../../constants/Colors";
import {observer} from "mobx-react";
import {translate} from "../../utils/index";
import Header from "../Header";

@observer
class CourseStickyHeader extends Component {
  render(){

    return (
      <Animated.View style={[styles.stickyHeader, {top: this.props.interpolated, height: Platform.OS === 'ios' ? 150 : 138}]}>
        <Header headerLeftClick={this.props.handleBack} title={this.props.title}/>
        {/*<Text style={[Styles.item_title, styles.name]}  numberOfLines={1} ellipsizeMode='tail'>{this.props.title}</Text>*/}
        <CustomTabs
            disabled={[this.props.disabled_tools ? 1 : null]}
            style={{marginTop: 8}}
          tabs={[translate('LESSONS'), translate('USEFUL_TOOLS')]}
          onPress={(i) => this.props.changeTab({i, from: this.props.active_idx})}
          active_idx={this.props.active_idx}
          imba
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  stickyHeader: {
    position: 'absolute',
    left: 0,
    paddingTop: Platform.OS === 'ios' ? 0 : 24,
    flex: 1,
    backgroundColor: Colors.second_bg,
    // backgroundColor: 'red',
    justifyContent: 'space-between',
    width: '100%',
    paddingBottom: 24
  },
  name: {
    color: Colors.text,
    textAlign: 'center',
    paddingBottom: 0,
  },
});

export default CourseStickyHeader;
