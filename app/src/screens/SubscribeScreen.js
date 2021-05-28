import React, {Component} from 'react';
import {SafeAreaView, Platform, Linking, TouchableOpacity} from 'react-native';
import {Text, View} from 'native-base';
import Layout from "../components/Layout";
import {api, toast, translate} from "../utils";
import {inject, observer} from "mobx-react";
import Styles from "../constants/Styles";
import {StyleSheet} from "react-native";
import CustomBtn from "../components/elements/CustomBtn";
import SubscribeItem from "../components/Subscribe/SubscribeItem";
import {buyPurchase, errorPurchase, isSubscribed} from "../actions/inAppPurchase";
import Spinner from "../components/Spinner";
import {action, observable, toJS} from "mobx";
import {
  consumePurchaseAndroid,
  finishTransactionIOS,
  finishTransaction,
  purchaseErrorListener,
  purchaseUpdatedListener,
  getAvailablePurchases,
} from 'react-native-iap';
import {getBundleId} from "react-native-device-info";
import Colors from "../constants/Colors";
import SubDescription from "../components/Subscribe/SubDescription";
import {beginLearning, getCourse} from "../actions/courses";

@inject('appStore', 'userStore')
@observer
class SubscribeScreen extends Component {
  timeout = null;
  purchaseUpdateSubscription = null;
  purchaseErrorSubscription = null;
  @observable show_hide = 0;
  @observable root_name = '';
  @observable loading = true;
  @observable error = false;
  @observable count_loading = 0;
  @observable loading_bth = false;
  @observable otherAccount = false;
  @observable products = [];
  @observable active = null;

  @action init = async (refresh, load_count = 0) => {
    const {products, inAppPurchase, setSubscribed, subscribed} = this.props.appStore;
    const {user} = this.props.userStore;
    const {params} = this.props.navigation.state;

    await beginLearning(params.id);
    let root_course;
    try {
      root_course = await getCourse({root: params.root});
      this.root_name = root_course?.name;
    } catch (e) {

    }
    if (refresh) this.loading_bth = true;
    if (!products?.length) {
      await inAppPurchase(!this.timeout);
      this.timeout = setTimeout(() => {
        let count = load_count + 1;
        if (count > 5) {
          this.error = true;
          this.loading = false;
          this.loading_bth = false;
        } else this.init(null, count);
      }, 2000);
    } else {
      let res_products = products;
      let available = [];
      try {
        available = await getAvailablePurchases();
      } catch (e) {
      }
      if (available?.length) {
        const check_sub = await isSubscribed(available);
        if (check_sub === 'active' && user?.user_products?.includes(params?.root)) {
          this.props.navigation.replace(params?.type === 'test' ? 'Test' : 'Course', params);
          setSubscribed(true);
          return;
        } else if (check_sub && !user?.user_products?.includes(params?.root)) res_products = products.filter(item => item.type === 'inapp');
        else if (check_sub) this.otherAccount = true;
      }
      if (subscribed) res_products = products.filter(item => item.type !== 'subs');
      if (!root_course?.has_poll || user?.user_products?.includes(params?.root)) {
        res_products = products.filter(item => item.type !== 'inapp');
      }
      if (res_products) {
        this.products = res_products;
        this.active = res_products.find(item => item.productId === 'imba_group_product') || res_products[0];
      }
      this.loading = false;
      this.loading_bth = false;
    }
  };

  @action handleClick = (data) => {
    if(!this.loading_bth) this.active = data;
  };
  @action showHideSub = () => {
    this.show_hide = this.show_hide + 1;
  };

  componentWillUnmount() {
    clearTimeout(this.timeout);
    this.timeout = null;
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  }

  componentDidMount() {
    // console.log('params', this.props.navigation.state.params);
    // this.props.navigation.replace(params?.type === 'test' ? 'Test' : 'Course', params);
    this.purchaseUpdateSubscription = purchaseUpdatedListener(this.purchaseUpdated);
    this.purchaseErrorSubscription = purchaseErrorListener(this.purchaseError);
    this.init()
  }

  handleClose = () => {
    this.props.navigation.goBack();
  };
  purchaseUpdated = async (purchase) => {
    const receipt = purchase.transactionReceipt;
    if (receipt) {
      try {
        if (Platform.OS === 'ios') {
          await finishTransactionIOS(purchase.transactionId);
        }
        await finishTransaction(purchase);
        if (Platform.OS === 'android' && this.active?.type === 'inapp') {
          await consumePurchaseAndroid(purchase.purchaseToken);
        }
      } catch (ackErr) {
        console.log('ackErr', ackErr);
      }
    }
    this.loading_bth = false;
  };
  purchaseError = (e) => {
    console.log('ERROR', e);
    if (e.responseCode === '-1005') toast(e.message);
    if (e.responseCode === 7 && Platform.OS === 'android') {
      // const {params} = this.props.navigation.state;
      // this.props.navigation.replace(params?.type === 'test' ? 'Test' : 'Course', params);
      // return this.props.appStore.getAppInfo();
    }
    errorPurchase({...e, platform: Platform.OS});
    this.loading_bth = false;
  };

  handleSubmit = async () => {
    const {products, hide_products, setSubscribed} = this.props.appStore;
    let result;
    try {
      if (!this.active) return toast(translate('SELECT_PRODUCT'));
      this.loading_bth = true;
      result = await buyPurchase(this.active.productId, this.active.type);
      if (result) {
        setTimeout(() => this.loading_bth = true, 200);
        const bundle_id = getBundleId();
        const {params} = this.props.navigation.state;
        let sub_res = await api('/users/subscribe',
          {
            ...result,
            purchase_info: toJS(this.active),
            bundle_id,
            products: [...(toJS(products) || []), ...(toJS(hide_products) || [])],
            begin_card: params.id
          },
          'POST');
        this.props.userStore.updateUserObj({user_products: sub_res?.data?.user_products});
        setSubscribed(Boolean(sub_res?.data?.subscribed === 'sub'));
        if (sub_res?.data?.poll) {
          this.props.navigation.replace('Course', {id: sub_res?.data.poll, type: 'poll'});
        } else {
          this.props.navigation.replace(params?.type === 'test' ? 'Test' : 'Course', params);
        }
      }
    } catch (e) {
      toast(e.message);
    }
    if (!result) this.loading_bth = false;
  };

  landLink = (type) => () => {
    const url = `https://esports-masters.flycricket.io/${type}.html`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        toast("Don't know how to open URI: " + url);
      }
    });
  };

  renderOtherAccount = () => {
    const {app_info} = this.props.appStore;
    return <SafeAreaView style={styles.container}>
      <View style={{flex: 1, justifyContent: 'center', paddingBottom: 120}}>
        <Text style={[Styles.text_muted, {textAlign: 'center'}]}>
          {translate('ONE_MORE_ACCOUNT_1', 'change', app_info?.name || '')}
        </Text>
      </View>
      <CustomBtn
        disabled={this.loading}
        title={translate('Refresh')}
        loading={this.loading_bth}
        width={246}
        wrap_style={{marginTop: 8, marginBottom: 8}}
        onPress={() => this.init(true)}/>
    </SafeAreaView>
  };

  render() {
    const {hide_products, subscribed} = this.props.appStore;
    return (
        <>
      <Layout
        footer={false} header close content_style={{flexGrow: 1}}
        headerLeftClick={this.handleClose}
        right_icon={true}
        headerRightClick={this.showHideSub}
      >
        {this.loading
          ?
          <Spinner/>
          :
          this.otherAccount
            ?
            this.renderOtherAccount()
            :
            <SafeAreaView style={styles.container}>
              {!this.products?.length || this.error
                ?
                <Text style={[Styles.title_20, {paddingTop: 64}]}>{translate('NO_PRODUCTS')}</Text>
                :
                <>
                  <Text style={[Styles.title, styles.title]}>
                    {translate(subscribed ? 'SUBSCRIBE_TITLE_2' : 'SUBSCRIBE_TITLE_1')}
                  </Text>
                  <View style={{flex: 1, justifyContent: 'center'}}>
                    <View style={styles.items}>
                      {this.products.map(product => (
                        <SubscribeItem
                          root_name={toJS(this.root_name)}
                          onClick={this.handleClick}
                          data={product}
                          key={product.productId}
                          active={this.active?.productId === product.productId}
                        />
                      ))}
                      {(hide_products?.length && this.show_hide >= 10)
                        ?
                        hide_products.map(product => (
                          <SubscribeItem
                            onClick={this.handleClick}
                            data={product}
                            key={product.productId}
                            active={this.active?.productId === product.productId}
                          />
                        ))
                        :
                        null
                      }
                    </View>
                    <SubDescription data={this.active}/>
                  </View>
                  <View>
                    <CustomBtn
                      disabled={this.loading || !this.active}
                      title={translate('Continue')}
                      loading={this.loading_bth}
                      width={246}
                      wrap_style={{marginTop: 8, marginBottom: 8}}
                      onPress={this.handleSubmit}/>
                    {Platform.OS === 'ios'
                      ?
                      <View style={{flexDirection: 'row', justifyContent: 'center', paddingTop: 16, flexWrap: 'wrap'}}>
                        <TouchableOpacity onPress={this.landLink('privacy')}>
                          <Text style={[Styles.text_muted, styles.land_link]}>{translate('Policy')}</Text>
                        </TouchableOpacity>
                        <Text style={Styles.text_muted}> {translate('and')} </Text>
                        <TouchableOpacity onPress={this.landLink('terms')}>
                          <Text style={[Styles.text_muted, styles.land_link]}>{translate('Terms')}</Text>
                        </TouchableOpacity>
                      </View>
                      :
                      null
                    }
                  </View>
                </>
              }
            </SafeAreaView>
        }
      </Layout>
        </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    // backgroundColor: 'red',
  },
  title: {
    textAlign: 'center',
    maxWidth: 220,
    alignSelf: 'center',
    marginBottom: 32,
  },
  items: {
    maxWidth: 310,
    width: '100%',
    alignSelf: 'center',
  },

  land_link: {
    color: Colors.tintColor
  },
});

export default SubscribeScreen;



