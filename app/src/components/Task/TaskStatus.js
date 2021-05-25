import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {View, Text} from 'native-base';
import {observer} from "mobx-react";
import Styles from "../../constants/Styles";
import {translate} from "../../utils";
import Icons from "../Icons";
import Colors from '../../constants/Colors';

@observer
class TaskStatus extends Component {

  render(){
    if(!this.props.status) return null;
    const {status} = this.props;
    let color = '#FFDD00';
    if(status === 'rework') color = '#FC2A52'
    else if(status === 'accepted') color = Colors.tintColor
    return (
      <View style={styles.container}>
        <View style={{paddingBottom: 4}}>
          {Icons[`task_${status}`](28, color)}
        </View>
        <Text style={[Styles.item_title]}>{translate(`Task_${status}`)}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingHorizontal: 32,
    alignItems: 'center'
  },
});

export default TaskStatus;
