import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

class Drawer extends Component {
  render(){
    return (
      <View style={styles.container}>
        <Text>Drawer</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
});

export default Drawer;