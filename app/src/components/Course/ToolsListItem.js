import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text} from 'native-base';
import Styles from "../../constants/Styles";
import Colors from "../../constants/Colors";
import Icons from "../Icons";
import {separateLinkFromTools} from "../../actions/courses";
import {translate} from "../../utils";

const ToolsListItem = ({data, onPress}) => {
  const res = separateLinkFromTools(data?.json?.body);
  const renderSubTitle = (sub_title) => {
    let str = sub_title || 'Инструменты';
    if(sub_title?.toLowerCase() === 'инструменты'){
      str = translate('tools')
    }
    return str;
  };
  const {links = []} = res;
  return (
    <TouchableOpacity onPress={onPress(data)}>
        <View style={styles.container}>
          <View style={styles.logo}>{Icons.tools(32, links.length ? '#fff' : Colors.thirdColor)}</View>
          <View style={styles.info}>
            <Text style={[Styles.small_text_muted, styles.sub_title]} numberOfLines={1}
                  ellipsizeMode='tail'>{renderSubTitle(data?.json?.sub_title)}</Text>
            <Text style={Styles.item_title} numberOfLines={1} ellipsizeMode='tail'>{data.name}</Text>
            {links?.length ?
              <Text style={[styles.link]} numberOfLines={1} ellipsizeMode='tail'>{res.links[0].link}</Text> : null}
          </View>
        </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    marginHorizontal: 16,
    flex: 1,
    height: 80,
    backgroundColor: Colors.item_bg,
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sub_title: {
    paddingBottom: 8,
  },
  logo: {
    backgroundColor: Colors.item_bg,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0,
    borderRadius: 96,
    marginRight: 24,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  link: {
    color: Colors.tintColor,
  },
});

export default ToolsListItem;
