import React from 'react';
import {Text, View} from 'native-base';
import Styles from "../../constants/Styles";
import RenderContentBody from "../RenderContentBody";


const ToolsArticle = ({data}) => {

  const renderHeader = () => {
    return <Text style={Styles.title_20}>{data.name}</Text>
  };
  return (
    <View style={{paddingHorizontal: 0}}>
      {renderHeader()}
      <RenderContentBody content={data?.json?.body} image_padding={0}/>
    </View>
  );
};

export default ToolsArticle;
