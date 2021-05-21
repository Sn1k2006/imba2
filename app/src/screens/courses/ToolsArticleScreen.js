import React, {Component} from 'react';
import {NavigationEvents} from 'react-navigation';
import Layout from "../../components/Layout";
import Spinner from "../../components/Spinner";
import ErrorIndicator from "../../components/ErrorIndicator";
import {toast} from "../../utils";
import ToolsArticleContainer from "../../containers/Courses/ToolsArticleContainer";


class ToolsArticleScreen extends Component {
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

  init = async () => {
    try {
      const data = await this.props.navigation.getParam('data');
      this.setState({data, ready: true});
    } catch (e) {
      toast(e.message);
      this.setState({error: e, data: {}, ready: true});
    }
  };
  backRoute = () => {
    const { navigation } = this.props;
    navigation.goBack();
    setTimeout(() => navigation.setParams({poll: true}), 10)
  };

  render() {
    if (this.state.error) return <ErrorIndicator error={this.state.error}/>;
    return (
      <Layout header headerLeftClick={this.backRoute}>
        <NavigationEvents onDidFocus={this.didFocus}/>
        {this.state.ready
          ? <ToolsArticleContainer data={this.state.data} />
          : <Spinner />
        }
      </Layout>
    );
  }
}

export default ToolsArticleScreen;


