import React, {useState, useEffect} from 'react';
import {View} from 'native-base';
import CourseListItem from "./CourseListItem";
import Layout from "../../constants/Layout";
import Spinner from "../Spinner";
import FreeCourseModal from "./FreeCourseModal";
import moment from "moment";

let interval = null;

const Course = ({data, active_index, handleRoute, setCurrentPosition, lock_loading, loading_tab, minHeight, time_to_open, time_when_open}) => {
  // if(loading_tab) return null;
  const [clickLoading, setClickLoading] = useState(false);
  const [free_visible, setFreeVisible] = useState(false);
  const [timestamp, setTimestamp] = useState(time_to_open ? 'loading' : 0);

  useEffect(() => {
    if(time_to_open && data[active_index]?.type !== 'section' && data[active_index]?.type !== 'direction' && data[active_index]?.type !== 'end_section' ) {
      interval = setInterval(() => {
        if(!time_when_open) return setTimestamp(0);
        const end = moment(time_when_open);
        let seconds = moment(end.diff(moment(), 'seconds'));
        setTimestamp(seconds || 0)
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const route = (data, last_active_el, showTimer) => () => {
    if(!data || data.type === 'end_section') return;
    if (showTimer) return setFreeVisible(data);
    if (clickLoading) return null;
    clearInterval(interval);
    setClickLoading(true);
    handleRoute(data);
    setTimeout(() => setClickLoading(false), 500);
  };

  return (
    <>
      <View style={{paddingHorizontal: 16, width: Layout.window.width, minHeight}}>
        {loading_tab
          ?
          <Spinner/>
          :
          <View>
            {data?.map((item, i) => (
              <CourseListItem
                disabled={active_index < i}
                last_active={active_index === i}
                data={item}
                key={item.id}
                time_to_open={timestamp}
                time_when_open={time_when_open}
                color={i % 2 !== 0 ? 'purple' : 'green'}
                onPress={route}
                setCurrentPosition={setCurrentPosition}
                lock_loading={lock_loading && active_index + 1 === i}
              />
            ))}
          </View>
        }
      </View>
      <FreeCourseModal
        visible={free_visible}
        closeModal={() => setFreeVisible(false)}/>
    </>
  );
};

export default Course;
