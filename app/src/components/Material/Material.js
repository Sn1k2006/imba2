import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {withNavigation} from 'react-navigation';
import {View, Text, Content} from 'native-base';
import Styles from "../../constants/Styles";
import RenderContentBody from "../RenderContentBody";
import CustomBtn from "../elements/CustomBtn";
import Colors from "../../constants/Colors";
import {translate} from "../../utils/index";
import MyStatusBar from "../MyStatusbar";

const Material = ({data, learnMaterial, navigation}) => {
  const [btn_loading, setBtnLoading] = useState(false);

  const handleClick = async () => {
    setBtnLoading(true);
    await learnMaterial();
    setBtnLoading(false);
  };

  const renderHeader = () => {
    return <Text style={[Styles.title_20, {paddingHorizontal: 24}]}>{data.name}</Text>
  };
  const renderFooter = () => {
    if (data.progress) return null;
    return <View style={{paddingTop: 16}}>
      <CustomBtn title={translate('STUDIED')} width={260} wrap_style={{paddingBottom: 32}} loading={btn_loading}
                 onPress={handleClick}/>
      <CustomBtn title={translate('CONTINUE_LATER')} type='outline' width={260} bgc={'#fff'} color={'#fff'}
                 onPress={() => navigation.goBack()}/>
    </View>
  };
  return (
    <Content style={styles.container}>
      {renderHeader()}
      <View style={{paddingHorizontal: 24}}>
        <RenderContentBody content={data?.json?.body} footer={renderFooter} style={{paddingBottom: 24}}/>
      </View>
    </Content>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
});

export default withNavigation(Material);