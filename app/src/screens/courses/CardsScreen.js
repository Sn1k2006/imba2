import React, {Component} from 'react';
import {NavigationEvents} from 'react-navigation';
import Layout from '../../components/Layout';
import CardsContainer from '../../containers/Courses/CardsContainer';
import Spinner from '../../components/Spinner';
import {getCoursesList} from '../../actions/courses';
import {toast} from '../../utils';
import ErrorIndicator from '../../components/ErrorIndicator';
import {inject, observer} from 'mobx-react';
import {toJS} from 'mobx';
import {firebaseInitialization} from '../../actions/firebase';
import UserStore from '../../store/UserStore';
import {View} from 'react-native';

@inject('appStore', 'userStore')
@observer
class CardsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      data: null,
      error: null,
      refreshing: false,
      continue_el_loading: false,
      curr_lang: null
    }
  }

  async componentDidMount() {
    const fcm = await firebaseInitialization(); //Настройка пушей
    if (fcm) await UserStore.updateUser({fcm});
  }

  didFocus = async () => {
    await this.init();
  };

  willFocus = async () => {
    this.checkLoad();
    this.setState({continue_el_loading: true});
  };

  checkLoad = (arg_count = 0) => {
    setTimeout(() => {
      if (!this.state.ready && arg_count < 3) {
        this.init();
        this.checkLoad(arg_count + 1);
      }
    }, 2000);
  };

  init = async () => {
    try {
      let courses = await getCoursesList();
      this.setState({
        data: courses,
        ready: true,
        continue_el_loading: false,
        refreshing: false,
        curr_lang: toJS(this.props.appStore.ln)
      });
    } catch (e) {
      toast(e.message);
      this.setState({error: e, data: {}, ready: true, continue_el_loading: false, refreshing: false});
    }
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.init();
  };

  render() {
    if (this.state.error) return <ErrorIndicator error={this.state.error} />;
    return (
      <View style={{flex: 1}}>
        <Layout title={'Home'} active={'courses'} refreshing={this.state.refreshing} onRefresh={this.onRefresh} radialGrad
                container_style={{flexGrow: 1}}>
          <NavigationEvents onDidFocus={this.didFocus} onWillFocus={this.willFocus} />
          {this.state.ready
            ? <CardsContainer data={this.state.data} continue_el_loading={this.state.continue_el_loading} />
            : <Spinner page />
            // <CardsSkeleton />
          }
        </Layout>

      </View>
    );
  }
}

export default CardsScreen;


