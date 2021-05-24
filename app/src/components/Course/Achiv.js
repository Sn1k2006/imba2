import React from 'react';
import {StyleSheet, View} from 'react-native';
import {addHostToPath} from "../../utils";
import FastImage from "react-native-fast-image";
import Icons from "../Icons";

const Achiv = ({achiv}) => {
    return (
      <View style={[  styles.container]}>
        {achiv
        ?
          <FastImage source={{uri: addHostToPath(achiv?.image)}} style={styles.image}/>
        :
          Icons.medal(32, '#ffffff')
        }

      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE498',
    width: 48,
    height: 48,
    borderRadius: 96
  },
  image: {
    width: 48, height: 48,
    resizeMode: 'cover',
    borderRadius: 96
  }
});

export default Achiv;
