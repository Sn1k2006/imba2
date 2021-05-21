import React, {Component} from 'react';
import {NavigationEvents} from 'react-navigation';
import {StatusBar} from 'react-native';
import Layout from "../../components/Layout";
import Spinner from "../../components/Spinner";
import NewsArticleContainer from "../../containers/News/NewsArticleContainer";
import ErrorIndicator from "../../components/ErrorIndicator";
import {getNews} from "../../actions/news";
import {toast} from "../../utils";
import {observer} from "mobx-react";

@observer
class NewsArticleScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      data: null,
      error: null,
    }
  }

  didFocus = () => {
    if (!this.state.ready) {
      this.init();
    }
  };
  willBlur = () => {
    this.setState({ready:false})
    StatusBar.setBarStyle('light-content', false)
  };

  init = async () => {
    const id = await this.props.navigation.getParam('id');
    try {
      let news = await getNews(id);
      this.setState({data: news, ready: true});
    } catch (e) {
      toast(e.message);
      this.setState({error: e, data: {}, ready: true});
    }
  };
  backRoute = () => {
    this.props.navigation.goBack();
  };

  render() {
    if (this.state.error) return <ErrorIndicator error={this.state.error}/>;
    return (
      <Layout header headerLeftClick={this.backRoute} active={'news'}>

        <NavigationEvents onDidFocus={this.didFocus} onWillBlur={this.willBlur}/>
        {this.state.ready
          ? <NewsArticleContainer data={this.state.data} />
          : <Spinner />
        }
      </Layout>
    );
  }
}

export default NewsArticleScreen;


