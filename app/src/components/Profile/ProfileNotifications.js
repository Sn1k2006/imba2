import React, {Component} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {View} from 'native-base';
import Layout from "../../constants/Layout";
import {action, observable, toJS} from "mobx";
import {observer} from "mobx-react";
import Spinner from "../Spinner";
import {toast, translate} from "../../utils";
import AttentionBg from "../AttentionBg";
import ProfileNotifListItem from "./ProfileNotifListItem";
import {getNotifList} from "../../actions/notifications";

@observer
class ProfileNotifications extends Component {

  @observable preload = false;
  @observable loading = true;
  @observable visible = false;
  @observable modal_data = null;
  @observable data = null;
  @observable meta = {};

  @action init = () => {
    const {notifications} = this.props;
    this.data = notifications?.data || [];
    this.meta = notifications?.meta?.pagination || {};
    this.loading = false
  };


  @action handleEndReached = async () => {
    if (this.meta.current_page < this.meta.total_pages && !this.preload) {
      try {
        this.preload = true;
        const result = await getNotifList(this.meta.current_page + 1);
        this.data = [...toJS(this.data), ...result.data];
        this.meta = result?.meta?.pagination || {};
      } catch (e) {
        toast(e.message);
      }
      this.preload = false;
    }
    this.props.setEndReached('end_reached_tab_1');
  };

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.notifications !== this.props.notifications) {
      this.init();
    }
    if (this.props.end_reached && !prevProps.end_reached) this.handleEndReached()
  }

  renderFooter = () => {
    return <View style={{paddingBottom: 8}}>{this.preload ? <Spinner/> : null}</View>
  };

  renderEmpty = () => {
    if (this.loading || !this.props.notifications) return <Spinner/>;
    return <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
      <AttentionBg  title={translate('No_notifications')} />
    </View>
  };

  render() {
    const {removeNotificationFromList} = this.props;
    return (
        <View style={{width: Layout.window.width, minHeight:this.props.minHeight, flex: 1}}>
        {this.props.loading_tab
          ?
          <Spinner/>
          :
          <>
            <FlatList
              alwaysBounceVertical={false}
              data={this.data || []}
              extraData={this.data || []}
              renderItem={({item}) => <ProfileNotifListItem data={toJS(item)} removeNotificationFromList={removeNotificationFromList}/>}
              // renderItem={({item}) => <View style={{height: 50, flex: 1}}><Text>123123123</Text></View>}
              ListFooterComponent={this.renderFooter()}
              ListEmptyComponent={this.renderEmpty()}
              style={styles.container}
              contentContainerStyle={{flex: 1}}
              keyExtractor={item => String(item.id)}
            />
            {/*{!this.data?.length ? this.renderEmpty() : null}*/}
            {/*<SwipeListView*/}
            {/*  style={{marginTop: 24}}*/}
            {/*  data={this.data || []}*/}
            {/*  renderItem={({item}, rowMap) => <ProfileNotifListItem data={toJS(item)} />}*/}
            {/*  renderHiddenItem={ ({item}, rowMap) => (*/}
            {/*    <View style={styles.swipe_item}>*/}
            {/*      <TouchableOpacity onPress={() => removeNotificationFromList(item?.id)}>*/}
            {/*      {Icons.trash(32, Colors.thirdColor)}*/}
            {/*      </TouchableOpacity>*/}
            {/*    </View>*/}
            {/*  )}*/}
            {/*  // leftOpenValue={75}*/}
            {/*  rightOpenValue={-65}*/}
            {/*/>*/}
          </>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  swipe_item: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  container: {
    paddingTop: 12,
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
});

export default ProfileNotifications;
