import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import Timer from "../Times";
import moment from "moment";
import {translate} from "../../utils";

let interval = null;

const SoonCourse = ({starting}) => {
  const [timestamp, setTimestamp] = useState(0);
  useEffect(() => {
    clearInterval(interval);
    if (starting) {
      if (moment(starting, 'YYYY-MM-DD').isValid()) {
        getTime();
        interval = setInterval(getTime, 1000);
      } else {
        setTimestamp(-1);
      }
    } else {
      setTimestamp(-1);
    }
    return () => clearInterval(interval);
  }, [starting]);

  const getTime = () => {
    if (!starting) return setTimestamp(0);
    const end = moment.utc(starting, 'DD-MM-YYYY HH:mm').local();
    let seconds = (end.diff(moment(), 'seconds'));
    if (seconds < 0) clearInterval(interval);
    setTimestamp(seconds || 0);
  }

  return <View style={{   paddingBottom: 16 }}>
    <Timer title={timestamp >= 0 ? translate('Course_open_after') : translate('Course_open_soon')} timestamp={timestamp}/>
  </View>
};

export default SoonCourse;
