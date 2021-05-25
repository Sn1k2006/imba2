import React, {Component} from 'react';
import {StyleSheet, Animated, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import {View} from 'native-base';
import CustomInput from "../elements/CustomInput";
import {observer} from "mobx-react";
import {action, observable} from "mobx";
import Colors from "../../constants/Colors";
import Icons from "../Icons";
import Layout from "../../constants/Layout";
import {translate} from "../../utils/index";

@observer
class BlogHeadFilters extends Component {
  animated = new Animated.Value(0);
  @observable value = '';
  @observable visible = false;

  @action toggleVisible = () => {
    this.visible = !this.visible;
    this.triggerSearch();
    if(this._search && this.visible) this._search.focus();
  };
  @action handleChange = (e, isClose) => {
    if(isClose) this.toggleVisible();
    this.value = e;
    this.props.onSearchChange(e);
  };

  handleBlur = () => {
    if(!this.value) this.toggleVisible()
  };
  setRef = (ref) => {
    this._search = ref
  };
  triggerSearch = () => {
    Animated.timing(this.animated, {
      toValue: Number(this.visible),
      duration: this.visible ? 200 : 0,
      useNativeDriver: true
    }).start();
  };

  render() {
    const interpolatedSearch = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [Layout.window.width, 0]
    });
    return (
      <View style={styles.header}>
        <View style={{flex: 1, alignItems: 'flex-end', overflow: 'hidden'}}>
            <Animated.View style={[styles.search_wrap, {transform: [{translateX: interpolatedSearch}]}]}>
            <CustomInput
              focus={this.visible}
              setRef={this.setRef}
              onBlur={this.handleBlur}
              containerStyle={{width: '100%', flex: 1}}
              style={{width: '100%', flex: 1}}
              onChange={this.handleChange}
              value={this.value}
              left_icon={'search'}
              right_icon={this.value ? 'close' : null}
              rightClick={() => this.handleChange('', true)}
              placeholder={translate('Search')}
            />
            </Animated.View>

          {this.visible
            ?
            null
            :
            <TouchableWithoutFeedback
              onPress={this.toggleVisible}
              hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
              <View style={styles.btn}>{Icons.search(22, Colors.text_muted)}</View>
            </TouchableWithoutFeedback>
          }
        </View>
        <TouchableOpacity
          onPress={this.props.showFilters}
          hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
          <View style={[styles.btn, {marginLeft: 16}]}>
            {this.props.fillFilters ?
            Icons.filters_fill(22, Colors.tintColor)
            :
            Icons.filters(22, Colors.text_muted)
            }
          </View>
        </TouchableOpacity>


      </View>
    );
  };
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    height: 64,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: Colors.bg,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  search_wrap: {
    position: 'absolute',
    left: 0,
    right: 0
  },
  btn: {
    flex: 0,
    width: 40,
    height: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    paddingLeft: 16,
    flex: 1,
    fontSize: 16,
    borderBottomWidth: 0,
    paddingVertical: 4,
  },
  input_wrap: {
    left: 0,
    width: '100%',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    marginLeft: 0,
  },
});

export default BlogHeadFilters;
