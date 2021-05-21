import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {observable, action, toJS} from 'mobx';
import {withNavigation} from 'react-navigation';
import Spinner from "../../components/Spinner";
import {beginLearning, finishedLearning} from "../../actions/courses";
import {toast} from "../../utils";
import Task from "../../components/Task";
import {taskChat} from "../../actions/task";

@observer
class TaskContainer extends Component {
  @observable loading = true;
  @observable data = null;
  @observable visible = false;

  @action init = (data) => {
    this.data = data;
    if(data?.task?.status === 'accepted') finishedLearning(this.data?.id);
    this.loading = false;
  };

  @action openModal = () => {
    this.visible = true;
  };

  componentDidMount() {
    this.init(this.props.data);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.data !== this.props.data) {
      this.init(this.props.data);
    }
  }

  get = async () => {
    try {
      const id = await this.props.navigation.getParam('id');
      let res = await beginLearning(id);
      await this.init(res.data);
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

  handleChat = async (obj) => {
    try {
      await taskChat({...obj, card: this.data.id});
      await this.get();
    } catch (e) {
      toast(e.message);
    }
  };

  render() {
    if (this.loading) return <Spinner page/>;
    return (
        <Task
          data={toJS(this.data)}
          learnMaterial={this.learnMaterial}
          handleChat={this.handleChat}
        />
    );
  }
}

export default withNavigation(TaskContainer);
