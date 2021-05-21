import React, {useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text} from 'native-base';
import ShadowView from "react-native-simple-shadow-view";
import Styles from "../../constants/Styles";
import Avatar from "../Avatar";
import Like from "../Like";
import Colors from "../../constants/Colors";
import Fonts from "../../constants/Fonts";
import {toast} from "../../utils";
import {rating} from "../../actions/rating";
import Icons from "../Icons";

const BlogListItem = ({data, openModal, own, user}) => {
  const [like, setLike] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    setLike(Boolean(data.own_rating_count));
    setCount(data.rating_count || 0);
  }, []);
  const handleLike = async () => {
    if(like) {
      setCount(count - 1);
    } else {
      setCount(count + 1);
    }
    setLike(!like);
    try {
      rating(data.id, 'blog', !like);
    } catch (e) {
      toast(e.message)
    }
  };
  const renderImage = () => {
    if(!own) return <Avatar small image={data?.user_id?.avatar}/>
    if(data.status === 1) return <View style={[styles.status_wrap, {backgroundColor: '#F8D7A5'}]}>{Icons.clock(32, '#fff')}</View>;
    if(data.status === 2) return <View style={[styles.status_wrap, {backgroundColor: '#00D9CD'}]}>{Icons.check(32, '#fff')}</View>;
    if(data.status === 3) return <View style={[styles.status_wrap, {backgroundColor: '#F8A5A5'}]}>{Icons.close(32, '#fff')}</View>;
  };
  return (
    <TouchableOpacity onPress={() => openModal(data, own)}>
      <ShadowView style={[Styles.shadow, styles.shadow]}>
        <View style={styles.container}>
          {renderImage()}

          <View style={{justifyContent: 'center', flex: 1, paddingHorizontal: 16}}>
            <Text numberOfLines={2} ellipssizeModa={'tail'} style={[Styles.item_title, {fontSize: 16}]}>{data.name} </Text>
          </View>
          <View style={styles.like_wrap}>
            <Text style={[Styles.text, styles.like_text, {color: Colors[ like ? 'thirdColor' : 'text_muted']}]}>{count}</Text>
            <Like fontSize={24} active={like} border={false} onPress={handleLike}/>
          </View>
        </View>
      </ShadowView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 72,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    paddingLeft: 16,
    paddingRight: 20,
    flexDirection: 'row'
  },
  shadow: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,

  },
  like_wrap: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  like_text: {
    paddingRight: 10,
    fontFamily: Fonts.medium
  },
  status_wrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 96,
    alignSelf: 'center'
  }
});

export default BlogListItem;