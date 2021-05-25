import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {View, Text, Content} from 'native-base';
import Styles from "../../constants/Styles";
import Colors from "../../constants/Colors";
import ChecklistItem from "./ChecklistItem";
import CustomBtn from "../elements/CustomBtn";
import {translate} from "../../utils";
import {addSettings} from "../../actions/courses";

const Checklist = ({data, checklist, changeChecklist, doneChecklist}) => {
  const [btn_loading, setBtnLoading] = useState(false);
  const handleOk = async () => {
    setBtnLoading(true);
    await doneChecklist();
    setBtnLoading(false);
  };
  const handleCheck = async (i) => {
    if (data.progress) return null;
    let res = [];
    if (!checklist) {
      res = [i];
    } else {
      if (checklist.includes(i)) {
        res = checklist.filter(item => item !== i)
      } else {
        res = [...checklist, i];
      }
    }
    await changeChecklist(res);
    addSettings(data.id, {checklist: res});
  };

  const renderHeader = () => {
    return <View style={{paddingHorizontal: 24}}>
      <Text
        style={[Styles.text_muted, styles.progress_text]}>{checklist?.length || 0} / {data?.json?.body?.length || 0} </Text>
      <Text style={[Styles.title_20, {paddingTop: 32, paddingBottom: 40, flex: 0}]}>{data.name}</Text>
    </View>
  };

  return (
    <Content contentContainerStyle={styles.container} style={{flex: 1, height: '100%'}}>
      {renderHeader()}
      <View style={styles.content}>
        <View>
          {data?.json?.body?.map((item, i) => <ChecklistItem name={item?.text} i={i} checklist={checklist} key={i}
                                                             handleCheck={handleCheck}/>)}
          {data.progress ? <Text style={[Styles.title, {textAlign: 'center', paddingTop: 16}]}>{data?.json?.success_checklist}</Text> : null}
        </View>
        {!data.progress
          ?
          <CustomBtn
            loading={btn_loading}
            title={translate('Done')}
            width={247}
            wrap_style={{marginVertical: 24}}
            disabled={data?.json?.body?.length !== checklist?.length}
            onPress={handleOk}/>
          :
          null
        }
      </View>
    </Content>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: '100%',
  },
  content: {
    paddingHorizontal: 16,
    flex: 1,
    justifyContent: 'space-between',
    height: '100%',
    paddingBottom: 24
  },
  item_shadow: {
    marginVertical: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff'
  },
  text_checked: {
    color: Colors.text_muted,
    textDecorationLine: 'line-through'
  },
  progress_text: {
    textAlign: 'center',
  }
});

export default Checklist;
