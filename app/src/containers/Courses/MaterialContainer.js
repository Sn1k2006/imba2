import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {observable, action, toJS} from 'mobx';
import {withNavigation} from 'react-navigation';
import Spinner from "../../components/Spinner";
import {beginLearning, finishedLearning} from "../../actions/courses";
import {toast} from "../../utils";
import Material from "../../components/Material";

@observer
class MaterialContainer extends Component {
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
      const id = await this.props.navigation.getParam('id');
      let res = await beginLearning(id);
      this.init(res.data);
    } catch (e) {
      toast(e.message);
    }
  };

  learnMaterial = async () => {
    try {
      await finishedLearning(this.data?.id);
      this.props.handleBack();
    } catch (e) {
      toast(e.message);
    }
  };

  render() {
    if(this.loading) return <Spinner page/>;
    return (
      <Material data={toJS(this.data)} learnMaterial={this.learnMaterial}/>
    );
  }
}

export default withNavigation(MaterialContainer);