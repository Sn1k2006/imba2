import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {observable, action, toJS} from 'mobx';
import {withNavigation} from 'react-navigation';
import Spinner from "../../components/Spinner";
import {toast} from "../../utils";
import ToolsArticle from "../../components/Course/ToolsArticle";

@observer
class ToolsArticleContainer extends Component {
  @observable loading = true;
  @observable data = null;

  @action init = (data) => {
    this.data = data;
    this.loading = false;
  };

  componentDidMount() {
    this.init(this.props.data);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.data !== this.props.data) {
      this.init(this.props.data);
    }
  }

  get = async () => {
    try {
      const data = await this.props.navigation.getParam('data');
      this.init(data);
    } catch (e) {
      toast(e.message);
    }
  };

  render() {
    if(this.loading) return <Spinner page/>;
    return (
      <ToolsArticle data={toJS(this.data)}/>
    );
  }
}

export default withNavigation(ToolsArticleContainer);