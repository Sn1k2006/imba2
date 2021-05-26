import React, {useEffect, useState} from 'react';
import {Button, Text, View} from 'native-base';
import {StyleSheet, TouchableOpacity} from "react-native";
import Progress from "../Progress";
import {getPercent} from "../../actions/courses";
import Colors from "../../constants/Colors";
import Styles from "../../constants/Styles";
import Icons from "../Icons";

const TestHeader = ({handleBack, progress}) => {
  const [centerWidth, setCenterWidth] = useState(0);
  const setWidth = (event) => {
    let {width} = event.nativeEvent.layout;
    setCenterWidth(width);
  };
  return (
    <View style={styles.container}>
      <Button transparent style={styles.btn}>
        <TouchableOpacity
          hitSlop={{top: 15, bottom: 15, left: 15, right: 15}}
          onPress={handleBack}>
          {Icons.close(32, '#ffffff')}
        </TouchableOpacity>
      </Button>
      {progress
        ?
        <View style={styles.center}>
          <View style={{width: '100%'}} onLayout={setWidth}>

            <Progress progress={getPercent(progress.all, progress.done)} width={centerWidth} color={Colors.tintColor}
                      color2={'#FCEB55'} unfilledColor={'#525559'}/>
          </View>
        </View>
        :
        null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 55,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 24
  },
  center: {
    flex: 1,
    paddingLeft: 24
  }
});

export default TestHeader;
