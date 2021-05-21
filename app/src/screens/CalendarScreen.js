import React, {Component} from 'react';
import {NavigationEvents} from 'react-navigation';
import Layout from "../components/Layout";
import {toast, translate} from "../utils";
import ErrorIndicator from "../components/ErrorIndicator";
import {StatusBar} from "react-native";
import { getEventsMonth} from "../actions/events";
import CalendarContainer from "../containers/CalendarContainer";
import Spinner from "../components/Spinner";

class CalendarScreen extends Component {
    state = {
      ready: false,
      error: null,
      data: null,
  };

  didFocus = async () => {
    StatusBar.setBarStyle('light-content', false);
    if (!this.state.ready) {
      await this.init();
    }
  };

  init = async () => {
    try {
      let events = await getEventsMonth();
      this.setState({data: events, ready: true});
    } catch (e) {
      toast(e.message);
      this.setState({error: e, data: {}, ready: true});
    }
    this.setState({ready: true});
  };

  render() {
    if(this.state.error) return <ErrorIndicator error={this.state.error}/>;
    return (
      <Layout
        title={translate('CALENDAR_TITLE')}
        active={'events'}
        header
        headerLeftClick={() => this.props.navigation.goBack()}
      >
        <NavigationEvents onDidFocus={this.didFocus}/>
        {this.state.ready
        ?
            <CalendarContainer data={this.state.data} />
        :
        <Spinner/>
        }

      </Layout>
    );
  }
}

export default CalendarScreen;


