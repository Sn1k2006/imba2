import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {View, Text} from 'native-base';
import SkeletonLoader from 'react-native-skeleton-loader';

class CardsSkeleton extends Component {
  render() {
    return (
      <View style={styles.container}>
        <SkeletonLoader type="square" size={110} loading={true}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default CardsSkeleton;