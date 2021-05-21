import React, {Component} from 'react';
import {StyleSheet, FlatList, Platform} from 'react-native';
import {View} from 'native-base';
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import {action, observable, toJS} from "mobx";
import {observer} from "mobx-react";
import Spinner from "../Spinner";
import ProfileAchieveListItem from "./ProfileAchieveListItem";
import AchieveModal from "../AchieveModal";
import {toast, translate} from "../../utils";
import {getAchievementsList} from "../../actions/achievements";
import AttentionBg from "../AttentionBg";

@observer
class ProfileAchievements extends Component {

  @observable preload = false;
  @observable loading = true;
  @observable visible = false;
  @observable modal_data = null;
  @observable data = null;
  @observable meta = {};

  @action init = () => {
    const {achievements} = this.props;
    this.data = achievements?.data || [];
    this.meta = achievements?.meta?.pagination || {};
    this.loading = false
  };


  @action showModal = (data) => {
    this.modal_data = data;
    this.visible = true;
  };
  @action closeModal = () => {
    this.visible = false;
    this.modal_data = null;
  };
  @action handleEndReached = async () => {
    if (this.meta.current_page < this.meta.total_pages && !this.preload) {
      try {
        this.preload = true;
        const result = await getAchievementsList(this.meta.current_page + 1);
        this.data = [...toJS(this.data), ...result.data];
        this.meta = result?.meta?.pagination || {};
      } catch (e) {
        toast(e.message);
      }
      this.preload = false;
    }
    this.props.setEndReached('end_reached_tab_0');
  };

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.achievements !== this.props.achievements) {
      this.init();
    }
    if (this.props.end_reached && !prevProps.end_reached) this.handleEndReached()
  }

  renderFooter = () => {
    return <View style={{paddingBottom: 8}}>{this.preload ? <Spinner/> : null}</View>
  };

  renderEmpty = () => {
    if (this.loading || !this.props.achievements) return <Spinner/>;
    return <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
      <AttentionBg  title={translate('NO_ACHIEVEMENTS')} />
    </View>
  };

  render() {
    // if (this.loading || this.props.loading_tab) return <View style={{flex: 1, backgroundColor: Colors.bg, width: Layout.window.width}}><Spinner/></View>;
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
              renderItem={({item}) => <ProfileAchieveListItem data={item} openModal={this.showModal}/>}
              // renderItem={({item}) => <View style={{height: 50, flex: 1}}><Text>123123123</Text></View>}
              ListFooterComponent={this.renderFooter()}
              ListEmptyComponent={this.renderEmpty()}
              style={styles.container}
              contentContainerStyle={{flex: 1}}
              keyExtractor={item => String(item.id)}
            />
            <AchieveModal
              stars
              data={toJS(this.modal_data)}
              test={toJS(this.modal_data?.card_id)}
              visible={toJS(this.visible)}
              closeModal={this.closeModal}
            />
          </>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
});

export default ProfileAchievements;
