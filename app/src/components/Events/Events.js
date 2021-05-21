import React, {useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {withNavigation} from 'react-navigation';
import {View, Text} from 'native-base';
import Styles from "../../constants/Styles";
import Colors from "../../constants/Colors";
import Spinner from "../Spinner";
import {translate} from "../../utils/index";
import EventsListItem from "./EventsListItem";
import NoResults from "../NoResults";


const Events = ({data, meta, get, count_today, onEndReached}) => {
  let FlatListView_Ref = null;
  const [refresh, setRefresh] = useState(false);
  const [preload, setPreload] = useState(false);
  const handleRefresh = async () => {
    setRefresh(true);
    await get(1);
    setRefresh(false);
  };
  const handleEndReached = async () => {
    const {current_page, total_pages} = meta;
    if(current_page >= total_pages || preload || refresh) return null;
    setPreload(true);
    await onEndReached(current_page + 1);
    setPreload(false);
  };

  const renderHeader = () => {
    return <Text style={[Styles.page_padding, Styles.title, {paddingHorizontal: 16, paddingBottom: 20, paddingTop: 0}]}>{translate('EVENTS')} <Text
      style={[Styles.title, {color: Colors.thirdColor}]}>{count_today || ''}</Text></Text>
  };
  const renderFooter = () => {
    return <View style={{paddingBottom: 8}}>{preload ? <Spinner/> : null}</View>
  };


  return (
      <FlatList
        ref={(ref) => FlatListView_Ref = ref}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={handleRefresh} tintColor={Colors.tintColor}  colors={[Colors.tintColor, Colors.secondColor]}/>}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={renderHeader()}
        ListFooterComponent={renderFooter()}
        ListEmptyComponent={() => <NoResults />}
        data={data}
        extraData={data}
        renderItem={({item}) => <EventsListItem data={item} />}
        keyExtractor={item => String(item.id)}
      />
  );
};

export default withNavigation(Events);
