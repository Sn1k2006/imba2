import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {observable, action,} from 'mobx';
import Spinner from "../components/Spinner";
import {toast} from "../utils";
import {getEventsList} from "../actions/events";
import Events from "../components/Events/Events";

@observer
class EventsContainer extends Component {
  @observable data = null;
  @observable meta = null;
  @observable count_today = null;

  @action init = () => {
    this.data = this.props.data.data;
    this.count_today = this.props.data.count_today;
    this.meta = this.props.data.meta?.pagination;
  };
  @action get = async (page = 1) => {
    try {
      let res = await getEventsList(page);
      this.data = res.data;
      this.count_today = res.count_today;
      this.meta = res.meta?.pagination;
    } catch (e) {
      toast(e.message);
    }
  };
  @action onEndReached = async (page) => {
    try {
      let res = await getEventsList(page);
      this.data = [...this.data, ...res.data];
      this.meta = res.meta?.pagination;
    } catch (e) {
      toast(e.message);
    }
  };

  componentDidMount() {
    this.init();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.data !== this.props.data) {
      this.init();
    }
  }

  render() {
    if(this.loading) return <Spinner page/>;
    return (
      <>
        <Events
          data={this.data}
          meta={this.meta}
          count_today={this.count_today}
          get={this.get}
          onEndReached={this.onEndReached}
        />
      </>
    );
  }
}

export default EventsContainer;