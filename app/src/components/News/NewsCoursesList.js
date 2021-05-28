import React, {useState, useEffect} from 'react';
import {TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';
import NewsCardTag from "./NewsCardTag";
import {View} from "native-base";
import {StyleSheet} from "react-native";
import Icons from "../Icons";
import {logEvent} from "../../utils";

const NewsCoursesList = ({courses, navigation, full, maxWidth, style = {}}) => {
  if (!courses?.length) return null;

  const [need_more, setNeedMore] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (courses?.length > 2 && !full) setNeedMore(true);
  }, [])

  const toggleVisible = (e) => {
    e.stopPropagation();
    setVisible(!visible)
  }
  const handleRoute = ({free, id, order, starting_soon, name}, e) => {
    e.stopPropagation();
    if(starting_soon) return null;
    logEvent('content_launch', {id});
    navigation.navigate('Course', {
      id,
      name: name,
      loading: true,
      prevRoute: navigation.state.routeName,
      index: order,
      free: free
    });
  }
  return (
    <View>
      <View style={[styles.container, style]}>
        {courses?.map((course, i) => i <= 1 || full
          ?
          <NewsCardTag
            maxWidth={maxWidth}
            key={course.id}
            name={course.name}
            soon={course.starting_soon}
            onPress={(e) => handleRoute(course, e)}
          />
          :
          null
        )}
      </View>
      {need_more
        ?
        <>
          <View style={styles.container}>
            {courses?.map((course, i) => i > 1 && visible
              ?
              <NewsCardTag
                maxWidth={maxWidth}
                key={course.id}
                name={course.name}
                soon={course.starting_soon}
                onPress={(e) => handleRoute(course, e)}
              />
              : null
            )}
          </View>
            <TouchableOpacity onPress={toggleVisible} style={{marginHorizontal: -24}}>
              <View  style={styles.arrow}>
                {Icons[visible ? 'chevron_top' : 'chevron_bottom'](32, '#fff')}
              </View>
            </TouchableOpacity>
        </>
        :
        null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: -8,
    flexWrap: 'wrap',

  },
  arrow: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    top: 8,
  }
});


export default withNavigation(NewsCoursesList);
