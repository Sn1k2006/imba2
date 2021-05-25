import React from 'react';
import {StyleSheet, TouchableOpacity, Platform, ScrollView, TouchableWithoutFeedback} from 'react-native';
import {withNavigation} from 'react-navigation';
import {View, Text, Content} from 'native-base';
import Styles from "../../constants/Styles";
import RenderContentBody from "../RenderContentBody";
import CustomBtn from "../elements/CustomBtn";
import {translate} from "../../utils/index";
import TaskChat from "./TaskChat";
import CustomInput from "../elements/CustomInput";
import Colors from "../../constants/Colors";
import Icons from "../Icons";
import TaskStatus from "./TaskStatus";
import Spinner from "../Spinner";
import {observer} from "mobx-react";
import {action, observable, toJS} from "mobx";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Cropper from '../Cropper';
import File from "../File";
import Layout from "../../constants/Layout";
import LinearGradient from "react-native-linear-gradient";

@observer
class Task extends React.Component {
  @observable body = '';
  @observable loading_files = false;
  @observable content_height = null;
  @observable files = [];
  @observable scrollPos = 0;
  @observable scroll_to_status = null;
  @observable loading = false;
  @observable show_btn = true;
  @action handleChange = (type, value) => {
    if (type === 'files') {
      value = [...this.files, ...value];
    }
    this[type] = value;
  };
  @action removeFileFromList = (id) => {
    this.files = this.files.filter(file => file.id !== id);
  };
  @action getContentHeight = (w, h) => {
    this.content_height = h;
    const diff = h - Layout.window.height;
    if (!this.scroll_to_status && diff > 200) this.scroll_to_status = 'bottom'
  };
  @action  handleSubmit = async () => {
    const {data} = this.props;
    this.loading = true;
    this.scrollTo();
    let files = [];
    if (this.files?.length) {
      this.files.map(file => files.push(file.id));
    }
    let obj = {body: toJS(this.body), files};
    if (data?.task) obj.task = data?.task.id;
    this.inputEl.blur();
    this.body = '';
    this.files = [];
    await this.props.handleChat(obj);
    setTimeout(this.scrollTo,0);
    this.loading = false
  };

  addFile = async () => {
    let images = await Cropper.multiGet(() => this.handleChange('loading_files', true));
    if (images?.length) {
      this.handleChange('files', images);
      this.handleChange('loading_files', false);
    }
    this.loading = false;
  };

  @action handleScroll = (e) => {
    const {contentSize, layoutMeasurement, contentOffset} = e.nativeEvent
    const content_height = contentSize.height;
    const scroll = layoutMeasurement.height + contentOffset.y;
    const diff = content_height - scroll;
    if (diff <= 200 && this.scroll_to_status) {
      this.scroll_to_status = 'hide';
    } else if (diff > 200 && (!this.scroll_to_status || this.scroll_to_status !== 'bottom')) {
      this.scroll_to_status = 'bottom';
    }
  }

  scrollTo = () => {
    this.scrollView._root.scrollToEnd({animated: true});
  };

  renderHeader = () => {
    const {data} = this.props;
    return <View style={{paddingHorizontal: 24, paddingBottom: 16}}>
      {this.props.data.name ? <Text style={[Styles.title_20]}>{this.props.data.name}</Text>: null }
      <TaskStatus status={data.task?.status}/>
    </View>
  };
  renderFooter = () => {
    if ((this.props.data.progress || !this.show_btn) && !this.files?.length) return null;
    return <View style={styles.footer}>
      <ScrollView bounces={false}>
        <View style={{padding: this.files?.length ? 16 : 0, backgroundColor: '#2d3035'}}>
          {this.files?.length ? <Text
            style={[Styles.input, {marginBottom: 16}]}>{translate(this.files?.length === 1 ? 'File' : 'Files')}</Text> : null}
          {this.loading_files ? <Spinner/> : null}
          {this.files?.map((file, i) => (
            <View key={file.id + i} style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
              paddingLeft: 16
            }}>
              <File file={file} style={{paddingRight: 8}}/>
              <TouchableOpacity
                onPress={() => this.removeFileFromList(file.id)}>{Icons.circle_close(32, Colors.text_muted)}</TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={[styles.footer_input]}>
        <TouchableOpacity onPress={this.addFile}>
          <View style={{paddingBottom: Platform.OS === 'ios' ? 0 : 16}}>
            {Icons.file(32, '#fff')}
          </View>
        </TouchableOpacity>
        <CustomInput
          setRef={(ref) => this.inputEl = ref}
          onFocus={this.handleFocus}
          multiline
          style={{flex: 1, borderBottomWidth: 0, paddingBottom: Platform.OS === 'ios' ? 0 : 16, maxHeight: 150}}
          containerStyle={{flex: 1, borderBottomWidth: 0, top: -3, paddingRight: 24}}
          value={this.body}
          onChange={(e) => this.handleChange('body', e)}
          placeholder={translate('TO_ANSWER')}
          returnKeyType='go'
          onSubmitEditing={this.handleSubmit}
        />
        <View style={{alignSelf: 'flex-end', paddingBottom: Platform.OS === 'ios' ? 0 : 16}}>
          {this.body || this.files?.length
            ?
            <CustomBtn icon={'telegram'} width={32} btn_style={{height: 32, minHeight: 32}}
                       onPress={this.handleSubmit}/>
            :
            null
          }
        </View>
      </View>
    </View>
  };

  render() {
    const {data, handleChat} = this.props;
    return (
      <KeyboardAwareScrollView
        style={{flex: 1}} contentContainerStyle={{flex: 1}} extraHeight={200} bounces={false}
        keyboardShouldPersistTaps="handled">
        <View style={{flex: 1}}>
          <Content
            style={styles.container}
            ref={(r) => this.scrollView = r}
            contentContainerStyle={{flexGrow: 1}}
            onScroll={this.handleScroll}
            onContentSizeChange={this.getContentHeight}
            snapToInterval={1}
          >
            <View style={{flex: 1}}>
              {this.renderHeader()}
              <View onLayout={(e) => this.scrollPos = e.nativeEvent.layout.y + e.nativeEvent.layout.height}>
                <RenderContentBody content={data?.json?.body} style={{paddingHorizontal: 16}} containerStyle={{marginTop: 0}}/>
              </View>
              <LinearGradient style={styles.gradient}
                              colors={['#00000080', '#152C4A00']} />
              {data?.task || this.loading
                ?
                <View style={{paddingTop: 8}}>
                  <TaskChat
                    scrollTo={this.scrollTo}
                    handleChat={handleChat}
                    chat={this.props.data?.task?.chat_order}
                  />
                  {this.loading ? <Spinner/> : null}
                </View>
                :
                null
              }
            </View>
          </Content>
          {this.scroll_to_status === 'bottom'
            ?
            <TouchableWithoutFeedback onPress={() => this.scrollTo('bottom')}>
              <View style={styles.scroll_btn}>
                {Icons.chevron_bottom(32, '#fff')}
              </View>
            </TouchableWithoutFeedback>
            :
            null
          }
        </View>
        {this.renderFooter()}
      </KeyboardAwareScrollView>
    );
  }
}

const
  styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
    },
    footer: {
      // maxHeight: Layout.window.height / 2.5,
      flex: 0,
      maxHeight: 400,
      // justifyContent: 'space-between',
      backgroundColor: Colors.second_bg,
    },
    footer_input: {
      flexDirection: 'row',
      alignItems: Platform.OS === 'ios' ? 'center' : 'flex-end',
      paddingLeft: 24,
      paddingRight: 24,
      flex: 0,
      paddingVertical: 16,
      marginBottom: Platform.OS === 'ios' ? 0 : -16
    },
    scroll_btn: {
      position: 'absolute',
      bottom: 40,
      right: 24,
      backgroundColor: Colors.bg,
      borderWidth: 2,
      borderColor: '#fff',
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    gradient: {
      width: '100%',
      height: 10
    },

  });

export default withNavigation(Task);
