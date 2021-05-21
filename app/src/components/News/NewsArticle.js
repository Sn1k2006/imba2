import React from 'react';
import {Text} from 'native-base';
import Styles from "../../constants/Styles";
import RenderContentBody from "../RenderContentBody";


const NewsArticle = ({data, subscribed}) => {
  const renderHeader = () => {
    return <Text style={Styles.title_20}>{data.name}</Text>
  };

  return (
    <>
      {renderHeader()}
      <RenderContentBody content={data.body} courses={data.cards} subscribed={subscribed}/>
    </>
  );
};

export default NewsArticle;
