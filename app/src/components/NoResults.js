import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Text} from 'native-base';
import Styles from "../constants/Styles";
import {translate} from "../utils";

const NoResults = ({text}) => {
    return (
      <View style={styles.container}>
        <Text style={[Styles.text_muted, {fontSize: 16}]}>{text || translate('Nothing_found')}</Text>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    alignItems: 'center'

  },
});

export default NoResults;
