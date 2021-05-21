import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {observable, action, toJS} from 'mobx';
import {withNavigation} from 'react-navigation';
import Spinner from "../../components/Spinner";
import {beginLearning, finishedLearning} from "../../actions/courses";
import {toast} from "../../utils";
import Checklist from "../../components/Checklist/Checklist";
import CustomModal from "../../components/elements/CustomModal";
import ChecklistDoneModal from "../../components/Checklist/ChecklistDoneModal";

@observer
class ChecklistContainer extends Component {
  @observable loading = true;
  @observable data = null;
  @observable visible = false;

  @action init = (data) => {
    this.data = data;
    this.loading = false;
  };
  @action showEndModal = () => {
    this.visible = true;
  };
  @action closeEndModal = () => {
    this.visible = false;
    this.props.handleBack();
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

  doneChecklist = async () => {
   try {
     await finishedLearning(this.data.id, {checklist: this.props.checklist});
     await this.get();
     this.showEndModal();
   } catch (e) {
     toast(e.message);
   }
  };

  render() {
    if(this.loading) return <Spinner page/>;
    return (
      <>
      <Checklist  {...this.props} data={toJS(this.data)} doneChecklist={this.doneChecklist}/>
      <CustomModal visible={this.visible} onClose={this.closeEndModal} dark close_btn={false}>
        <ChecklistDoneModal text={this.data?.json?.success_checklist} handleOk={this.closeEndModal}/>
      </CustomModal>
      </>
    );
  }
}


export default withNavigation(ChecklistContainer);