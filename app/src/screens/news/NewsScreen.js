import React, {Component} from 'react';
import {NavigationEvents} from 'react-navigation';
import Layout from "../../components/Layout";
import Spinner from "../../components/Spinner";
import NewsContainer from "../../containers/News/NewsContainer";
import {getNewsList} from "../../actions/news";
import {toast} from "../../utils";
import ErrorIndicator from "../../components/ErrorIndicator";
import {StatusBar} from "react-native";

class NewsScreen extends Component {
  state = {
    ready: false,
    error: null,
    data: null
  };

  didFocus = async () => {
    StatusBar.setBarStyle('light-content', false);
    await this.init();
  };

  init = async () => {
    try {
      let news = await getNewsList();
      this.setState({data: news, ready: true});
    } catch (e) {
      toast(e.message);
      this.setState({error: e, data: {}, ready: true});
    }
    this.setState({ready: true});
  };

  render() {
    if (this.state.error) return <ErrorIndicator error={this.state.error}/>;
    return (
      <Layout title={'News'} active={'news'} noContent>
        <NavigationEvents onDidFocus={this.didFocus}/>
        {this.state.ready
          ? <NewsContainer data={this.state.data}/>
          : <Spinner page/>
          // <CardsSkeleton />
        }
      </Layout>
    );
  }
}

export default NewsScreen;


