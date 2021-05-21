import React, {useEffect, useState} from 'react';
import {withNavigation} from 'react-navigation';
import {View} from 'native-base';
import Layout from "./Layout";
import AttentionBg from "./AttentionBg";
import UserStore from "../store/UserStore";
import {translate} from "../utils";
import CustomBtn from "./elements/CustomBtn";

const ErrorIndicator = ({error, navigation}) => {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (error?.code === 401) {
      UserStore.logOut();
    } else {
      setLoading(false);
    }
  }, []);
  return (
    <Layout header={false}>
      {loading
        ?
        null
        :
        <View style={{alignItems: 'center'}}>
          <AttentionBg icon={'error_girl'} color={'#F8A5A5'} title={translate('ERROR_OCCURRED')}
                       text={JSON.stringify(error?.message) || ''}/>
          <CustomBtn title={translate('Refresh')} onPress={() => navigation.replace('Courses')}/>
        </View>
      }
    </Layout>
  );
};

export default withNavigation(ErrorIndicator);