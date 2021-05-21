import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {observable, action, toJS} from 'mobx';
import Spinner from "../components/Spinner";
import {toast} from "../utils";
import {getEventsMonth} from "../actions/events";
import Calendar from "../components/Calendar/Calendar";

@observer
class CalendarContainer extends Component {
  @observable data = null;
  @observable loading = true;

  @action init = () => {
    this.data = this.props.data;
    this.loading = false;
  };
  @action get = async (data = {}) => {
    try {
      const res = await getEventsMonth(data);
      this.data = res;
      return res;
    } catch (e) {
      toast(e.message);
    }
  };
  componentDidMount() {
    this.init();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.ready !== this.props.ready) {
      this.init();
    }
  }

  render() {
    if(this.loading) return null;
    return (
      <>
        <Calendar
          data={toJS(this.data)}
          get={this.get}
        />
      </>
    );
  }
}

export default CalendarContainer;
