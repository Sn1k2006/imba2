import React, {useState, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {withNavigation} from 'react-navigation';
import {View, Text} from 'native-base';
import Styles from "../../constants/Styles";
import Colors from "../../constants/Colors";
import CardsSwiper from "./CardsSwiper";
import CustomBtn from "../elements/CustomBtn";
import ShadowView from "react-native-simple-shadow-view/src/ShadowView";
import {logEvent, toast, translate} from "../../utils";
import ActiveCourseElement from "./ActiveCourseElement";
import Spinner from "../Spinner";
import RepeatImage from "../RepeatImage";
import ProfileAchieveListItem from "../Profile/ProfileAchieveListItem";
import AsyncStorage from "@react-native-community/async-storage";
import FreeCourseModal from "../Course/FreeCourseModal";
import SoonCourse from "./SoonCourse";
import NoResults from "../NoResults";
import UserStore from "../../store/UserStore";
import AppStore from "../../store/AppStore";


const Cards = ({data = [], navigation, active_course, continue_el_loading, subscribed, changeActiveCourseIdx, setSwiperRef}) => {
  const [free_visible, setFreeVisible] = useState(false);

  const handleRoute = async () => {
    const {id, free, starting_soon} = data[active_course];
    if (starting_soon) return;
    logEvent('content_launch', {id});
    await AsyncStorage.setItem('active_course', active_course + '');
    navigation.navigate('Course', {
      id,
      name: data[active_course].name,
      prevRoute: 'Courses',
      index: data[active_course].order,
      free
    });
  };

  const continueRoute = (continue_data) => () => {
    const {free} = data[active_course];
    if (free &&
      data[active_course].time_to_open &&
      continue_data?.type !== 'section' &&
      continue_data?.type !== 'direction' &&
      !AppStore.subscribed &&
      !UserStore.user?.user_products?.includes(continue_data?.root)
    ) {
      setFreeVisible(continue_data);
    } else {
      try {
        let name = continue_data?.type === 'section' || continue_data?.type === 'direction' ? continue_data.name : '';
        let routeName = 'Course';
        if(!subscribed && continue_data?.type !== 'direction' && !free && !UserStore.user?.user_products?.includes(continue_data?.root)) routeName = 'Subscribe';
        else if(continue_data?.type === 'test') routeName = 'Test';
        navigation.navigate(routeName, {
          id: continue_data.id,
          prevRoute: navigation.state.routeName,
          type: continue_data?.type,
          data: continue_data,
          root: continue_data.root,
          name,
          free
        });
      } catch (e) {
        toast(e.message);
      }
    }
  };

  const curr_course = data[active_course];
  const course_finished = curr_course && (curr_course?.progress?.done === curr_course?.progress?.all);
  if (!data?.length) {
    return <View>
      <Text style={[Styles.title, {marginBottom: 20}]}>{translate('Courses')}</Text>
      <NoResults/>
    </View>;
  }
  return (
    <>
      <Text style={Styles.title}>{translate('Courses')} <Text
        style={[Styles.title, {color: Colors.thirdColor}]}>{active_course + 1}</Text>
        <Text style={[Styles.text, {lineHeight: 28}]}>/{data?.length || ''}</Text>
      </Text>
      <View style={{marginHorizontal: -24, paddingTop: 12, paddingBottom: 24}}>
        <CardsSwiper
          setSwiperRef={setSwiperRef}
          continue_el_loading={continue_el_loading}
          courses={data}
          changeIndex={changeActiveCourseIdx}
          active_course={active_course}
          handleRoute={handleRoute}
        />
      </View>

      {/* Start Продолжить обучение */}
      {curr_course?.starting_soon
        ?
        <SoonCourse starting={curr_course.starting_soon}/>
        :
        (curr_course?.current && curr_course.current?.type !== 'tools'
          ?
          continue_el_loading
            ?
            <Spinner/>
            :
            <ActiveCourseElement
              // timestamp={timestamp}
              active_course={active_course}
              course={curr_course}
              data={curr_course.current}
              continueRoute={continueRoute}/>
          :
          null)
      }
      {/* End Продолжить обучение */}

      {/* Start Обучение завершено */}
      {course_finished && !curr_course?.starting_soon
        ?
        <View style={styles.finished}>
          <View style={{
            height: 109,
            backgroundColor: Colors.item_bg,
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <RepeatImage/>
            <Text style={[Styles.title_20]}>{translate('END_COURSE_TEXT_1')}</Text>
          </View>
          {curr_course?.achievements?.length
            ?
            <View style={{paddingTop: 48}}>
              <Text style={[Styles.item_title, styles.title]}>{translate('ACHIVE_BY_COURSE')}</Text>
              {curr_course.achievements.map((achive, i) => <ProfileAchieveListItem data={achive} key={i} course/>)}
            </View>
            :
            null
          }
        </View>
        :
        null
      }
      {/* End Обучение завершено */}

      {/* Start Описание */}
      {!curr_course?.name && !curr_course?.json?.description
        ?
        null
        :
        <>
          <Text style={[Styles.item_title, styles.title]}>{translate('Description')}</Text>
          <ShadowView style={Styles.shadow}>
            <View style={styles.content}>
              <Text style={[Styles.item_title, {textAlign: 'center', paddingBottom: 16}]}>{curr_course?.name}</Text>
              <Text style={[Styles.text, {textAlign: 'center'}]}>{curr_course?.json?.description}</Text>
              {!course_finished && !curr_course?.starting_soon
                ?
                <CustomBtn title={translate('Learn')} wrap_style={{marginTop: 32}} full onPress={handleRoute}/>
                :
                null
              }
            </View>
          </ShadowView>
        </>
      }
      {/* End Описание */}
      <FreeCourseModal
        visible={free_visible}
        closeModal={() => setFreeVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'rgba(255, 255, 255, 0.64)',
    paddingBottom: 24,
  },
  content: {
    position: 'relative',
    borderRadius: 4,
    backgroundColor: Colors.item_bg,
    padding: 24,
    textAlign: 'center',
    overflow: 'hidden'
  },
  wave_rotate: {
    position: 'absolute',
    right: -54,
    top: -60,
    transform: [{rotate: '-105deg'}]
  },
  wave: {
    position: 'absolute',
    left: -54,
    top: -14,
  },
  finished: {
    paddingBottom: 48,
  }
});

export default withNavigation(Cards);

