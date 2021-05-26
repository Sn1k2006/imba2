import React, {PureComponent} from 'react';
import {StyleSheet} from 'react-native';
import {View} from 'native-base';
import StarBgIcons from './Icons/StarBgIcons';

class StarBg extends PureComponent {
  render() {
    const {size, style, children} = this.props;
    return (
      <View style={[styles.container, {width: size, height: size}, style]}>
        {StarBgIcons.border(152)}
        <View style={styles.bottom}>
          {StarBgIcons.filledBig()}
        </View>
        {children || null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  bottom: {
    position: 'absolute',
    bottom: 0,
  }
});

export default StarBg;
