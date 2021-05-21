import React from 'react';
import {StyleSheet, Image, View} from 'react-native';
import {separateAchiveInTest} from "../../actions/achievements";
import {addHostToPath} from "../../utils";
import ShadowView from "react-native-simple-shadow-view/src/ShadowView";
import Styles from "../../constants/Styles";
import Icons from "../Icons";

const Achiv = ({achiv}) => {
    return (
      <View style={[  styles.container]}>
        {achiv
        ?
          <Image source={{uri: addHostToPath(achiv?.image)}} style={styles.image}/>
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