import React, {Component} from 'react';
import {NavigationEvents} from 'react-navigation';
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import {toast} from "../utils";
import ErrorIndicator from "../components/ErrorIndicator";
import {StatusBar} from "react-native";
import {getEventsList} from "../actions/events";
import EventsContainer from "../containers/EventsContainer";

class EventsScreen extends Component {
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
      let events = await getEventsList();
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
        active={'events'}
        noContent
        right_icon={'calendar'}
        header
        back={false}
        progress={false}
        headerRightClick={() => this.props.navigation.navigate('Calendar')}
      >
        <NavigationEvents onDidFocus={this.didFocus}/>
        {this.state.ready
          ? <EventsContainer data={this.state.data}/>
          : <Spinner page/>
          // <CardsSkeleton />
        }
      </Layout>
    );
  }
}

export default EventsScreen;


