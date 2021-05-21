import React, {Component} from 'react';
import {withNavigation} from 'react-navigation';
import {FlatList, View} from 'react-native';
import {action, observable, toJS,} from "mobx";
import {getCourse} from "../../actions/courses";
import {toast} from "../../utils";
import {observer} from "mobx-react";
import Spinner from "../Spinner";
import ToolsListItem from "./ToolsListItem";
import NoResults from "../NoResults";
import Layout from "../../constants/Layout";

@observer
class Tools extends Component {
  @observable loading = true;
  @observable data = null;

  @action init = () => {
    this.data = this.props.data;
    this.loading = false;
  };
  @action get = async () => {
    try {
      const id = '';
      let res = await getCourse(id);
      this.data = res.data;
    } catch (e) {
      toast(e.message);
    }
  };

  componentDidMount() {
    this.init();
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.data !== this.props.data) {
      this.init();
    }
  };

  handleRoute = (data) => () => {
    this.props.navigation.navigate('ToolsArticle', {data})
  };

  render(){
    if(this.loading) return <Spinner page/>;

    return (
      <View style={{width: Layout.window.width,  minHeight: this.props.minHeight, justifyContent: 'flex-start'}}>
        {this.props.loading_tab
          ?
          <Spinner />
          :
            this.data?.length
                ?this.data.map(item => (
                    <ToolsListItem data={item} onPress={this.handleRoute} index={item.id} key={item.id}/>
            ))
                :<NoResults />

        }
      </View>
    );
  }
}

export default withNavigation(Tools);
