import React, {Component} from 'react';
import {StyleSheet, Linking, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import {View, Text} from 'native-base';
import CustomModal from "../elements/CustomModal";
import CustomBtn from "../elements/CustomBtn";
import Avatar from "../Avatar";
import Styles from "../../constants/Styles";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";
import {toast, translate} from "../../utils";
import Icons from "../Icons";
import ShadowView from "react-native-simple-shadow-view/src/ShadowView";
import {observer} from "mobx-react";
import {action, observable} from "mobx";

// status 1 = wait
// status 2 = confirm
// status 3 = reject

@observer
class BlogOwnModal extends Component {
  @observable visible = false;
  @observable accept_visible = false;

  @action toggleMenu = () => {
    this.visible = !this.visible;
  };
  @action hideMenu = () => {
    this.visible = false;
  };

  @action showAcceptVisible = () => {
    this.accept_visible = true;
  };
  @action closeAcceptVisible = () => {
    this.accept_visible = false;
  };
  handleClose = () => {
    this.hideMenu();
    this.props.closeModal();
  };

  handlePress = () => {
    const {data} = this.props;
    Linking.canOpenURL(data?.link).then(supported => {
      if (supported) {
        Linking.openURL(data?.link);
      } else {
        toast("Don't know how to open URI: " + data?.link);
      }
    });
  };
  renderButtons = () => {
    const {data} = this.props;
    if (data.status === 1) {
      return (
        <View style={[styles.btn_wrap, {backgroundColor: '#F8D7A5'}]}>
          {Icons.clock(32, '#fff')}
          <Text style={[Styles.text, {color: '#fff', flex: 1, paddingLeft: 12}]}>{translate('BLOG_AWAIT')}</Text>
        </View>
      )
    } else if (data.status === 2) {
      return (
        <CustomBtn title={translate('Go_to')} full onPress={this.handlePress} wrap_style={{marginTop: 44}}/>
      )
    } else if (data.status === 3) {
      return (
        <View style={[styles.btn_wrap, {backgroundColor: '#F8A5A5'}]}>
          {Icons.close(32, '#fff')}
          <Text style={[Styles.text, {color: '#fff', flex: 1, paddingLeft: 12}]}>{translate('BLOG_REJECT')}</Text>
        </View>
      )
    }
  };
  handleEdit = () => {
    this.props.editBlogOpen();
    this.hideMenu()
  };

  handleRemove = () => {
    this.props.removeBlog();
    this.hideMenu();
    this.closeAcceptVisible();
  };

  render() {
    const {visible, data, user} = this.props;
    if (!data) return null;
    return (
      <>
        <CustomModal
          visible={visible}
          onClose={this.handleClose}
          dark
          left_icon='more'
          leftIconClick={this.toggleMenu}
          accept={this.accept_visible}
          onAcceptOk={this.handleRemove}
          accept_text={translate('CONFIRM_DELETE_BLOG')}
          onCloseAccept={this.closeAcceptVisible}
          accept_btn_text={translate('Delete')}
        >
          <TouchableWithoutFeedback onPress={this.hideMenu}>
            <View>
              <Avatar image={user?.avatar} progress={0}/>
              <Text style={[Styles.title_bold, styles.name]}>{user?.name}</Text>
              <Text style={styles.blog_name}>{data?.name}</Text>
              <Text style={[Styles.text_muted, {textAlign: 'center'}]}>{data?.description}</Text>
              {this.renderButtons()}
            </View>
          </TouchableWithoutFeedback>
          {this.visible
            ?
            <ShadowView style={[Styles.shadow, styles.shadow]}>
              <TouchableWithoutFeedback
                onPress={this.toggleMenu}
                hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
                <View style={styles.settings_wrap}>{Icons.close(32, Colors.text_muted)}</View>
              </TouchableWithoutFeedback>
              <View style={{marginTop: 16}}>
              <TouchableOpacity
                onPress={this.showAcceptVisible}
                hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  {Icons.trash(24, Colors.text_muted)}
                  <Text style={[Styles.input, {paddingLeft: 8}]}>{translate('Delete')}</Text>
                </View>
              </TouchableOpacity>
              </View>
              <View style={{marginTop: 16}}>
              <TouchableOpacity
                onPress={this.handleEdit}
                hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}>
                <View style={{alignItems: 'center', flexDirection: 'row'}}>
                  {Icons.edit(24, Colors.text_muted)}
                  <Text style={[Styles.input, {paddingLeft: 8}]}>{translate('Edit')}</Text>
                </View>
              </TouchableOpacity>
              </View>
            </ShadowView>
            :
            null
          }
        </CustomModal>
      </>
    )
  }
}

const styles = StyleSheet.create({
  name: {
    color: Colors.title,
    textAlign: 'center',
    paddingTop: 20,
    paddingHorizontal: 8,
  },
  blog_name: {
    paddingTop: 24,
    fontSize: 16,
    lineHeight: 19,
    paddingBottom: 16,
    color: Colors.secondColor,
    fontFamily: Fonts.medium,
    textAlign: 'center',
  },
  btn_wrap: {

    marginHorizontal: -32,
    paddingHorizontal: 32,
    marginBottom: -24,
    paddingVertical: 24,
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center'
  },
  shadow: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 160,
    borderRadius: 0,
    backgroundColor: '#ffffff',
  },
  settings_wrap: {
    marginLeft: -16
  }
});

export default BlogOwnModal;