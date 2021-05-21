import React, {Component} from 'react';
import NewsArticle from "../../components/News/NewsArticle";
import {inject, observer} from "mobx-react";
import {action, observable, toJS} from "mobx";

@inject('appStore')
@observer
class NewsArticleContainer extends Component {
  @observable data = null;

  @action init = () => {
    this.data = this.props.data;
  };

  componentDidMount() {
    this.init();
  }

  render() {
    return (
        <NewsArticle data={toJS(this.data || {})} subscribed={toJS(this.props.appStore.subscribed)}/>
    );
  }
}

export default NewsArticleContainer;
