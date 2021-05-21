import React, {Component} from 'react';
import {observer} from "mobx-react";
import {action, observable} from "mobx";
import Profile from "../../components/Profile";



@observer
class ProfileContainer extends Component {
  @observable achievements = null;

  @action init = () => {
    this.achievements = this.props.achievements?.data;
  };


  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.data !== this.props.data) {
      this.init();
    }
  }

  render(){
    return (
      <Profile init={this.props.init}/>
      // <ParallaxDemo />
    );
  }
}

export default ProfileContainer;