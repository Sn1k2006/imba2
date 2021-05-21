import React, {useState} from 'react';
import {StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {View, Text} from 'native-base';
import Styles from "../../constants/Styles";
import {toast} from "../../utils";
import ShadowView from "react-native-simple-shadow-view";
import CustomCheckbox from "../elements/CustomCheckbox";
import Colors from "../../constants/Colors";

const ChecklistItem = ({handleCheck, i, checklist, name}) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    try {
      setLoading(true);
      await handleCheck(i);
    } catch (e) {
      toast(e.message);
    }
    setLoading(false);
  };
  let checked = checklist?.includes(i);
  return (
    <TouchableWithoutFeedback key={i} onPress={handleClick} disabled={loading}>
      <ShadowView style={[Styles.shadow, styles.item_shadow]}>
        <View style={styles.item}>
            <CustomCheckbox style={{marginRight: 16}} checked={checked}/>
          <Text style={[Styles.input, {flex: 1}, checked ? styles.text_checked : {}]}>{name}</Text>
        </View>
      </ShadowView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
  },
  item_shadow: {
    marginVertical: 16,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    padding: 16,
    paddingRight: 24,
    backgroundColor: Colors.item_bg,
    width: '100%'
  },
  text_checked: {
    color: Colors.text_muted,
    textDecorationLine: 'line-through'
  },
});

export default ChecklistItem;