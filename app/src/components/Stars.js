import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Icon} from 'native-base';
import Icons from "./Icons";

const Stars = ({small = false, left = false, right = false, stars = null, dark = false, width, icon_size, height}) => {
  let size = small ? 48 : 156;
  let star_size = small ? 18 : 32;
  const unfillColor = dark ? '#E5EAFF' : '#ffffff';
  if (width) size = width;
  if (icon_size) star_size = icon_size;
  return (
    <View style={[
      styles.stars,
      small
        ? {width: size, height: height || 63}
        :{width: size, height: height || 50},
      left ? styles.stars_left : {},
      right ? styles.stars_right : {}
    ]}>
      {/*<View  style={{alignSelf: right ? 'flex-start' : 'flex-end'}}>{Icons.full_star(star_size,stars ? '#FFD15C' : '#ffffff')}</View>*/}
      {/*<View  style={{alignSelf: right ? 'flex-start' : 'flex-end'}}>{Icons.full_star(star_size,stars ? '#FFD15C' : '#ffffff')}</View>*/}
      {/*<View  style={{alignSelf: right ? 'flex-start' : 'flex-end'}}>{Icons.full_star(42,stars ? '#FFD15C' : '#ffffff')}</View>*/}
      <Icon name='star' type='FontAwesome' style={{alignSelf: right ? 'flex-start' : 'flex-end', fontSize: star_size, color: stars ? '#FFD15C' : unfillColor}}/>
      <Icon name='star' type='FontAwesome' style={{fontSize: star_size, color: stars > 1 ? '#FFD15C' : unfillColor}}/>
      <Icon name='star' type='FontAwesome' style={{alignSelf: right ? 'flex-start' : 'flex-end', fontSize: star_size, color: stars > 2 ? '#FFD15C' : unfillColor}}/>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: '#FFE498',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container_left: {
    // marginLeft: 20
  },
  stars: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  stars_right: {
    width: 28,
    flexDirection: 'column-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  stars_left: {
    width: 28,
    flexDirection: 'column-reverse',
    justifyContent: 'space-between',
  },
  star: {
  },
});

export default Stars;
