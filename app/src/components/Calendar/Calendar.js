import React, {useState, useEffect} from 'react';
import {withNavigation} from 'react-navigation';
import {View, Text} from 'native-base';
import Styles from "../../constants/Styles";
import Colors from "../../constants/Colors";
import Spinner from "../Spinner";
import {translate} from "../../utils/index";
import {Calendar as NativeCalendar, LocaleConfig} from 'react-native-calendars';
import moment from "moment";
import 'moment/locale/ru'
import 'moment/locale/es'
import AppStore from "../../store/AppStore";
import EventsListItem from "../Events/EventsListItem";
import NoResults from "../NoResults";

const markedStyle = Object.freeze({marked: true, dotColor: Colors.tintColor});

const Calendar = ({data, get, ready}) => {
  const [ready_locale, setReadyLocale] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [selected, setSelected] = useState(moment().format('YYYY-MM-DD'));
  const [active_events, setActiveEvents] = useState([]);

  useEffect(() => {
    if (data) {
      handleMarked(null, data);
    }
    if (!ready) {
      let locale = {
        monthNames: translate('month_Names').split(','),
        monthNamesShort: translate('month_Names_Short').split(','),
        dayNames: translate('day_Names').split(','),
        dayNamesShort: translate('day_Names_Short').split(','),
        today: translate('Today'),
      };
      moment.locale(AppStore.ln);
      if (locale.dayNamesShort.length > 2) {
        LocaleConfig.locales['locale'] = locale;
        LocaleConfig.defaultLocale = 'locale';
      }
      setReadyLocale(true)
    }
  }, [ready, data, ready_locale]);


  const handleMarked = (dd, obj) => {
    if (!obj) return null;
    let result = {};
    const selectDay = dd || selected;
    Object.keys(obj).map(d => {
      result[d] = d === selectDay ? {...markedStyle, selected: true} : markedStyle;
    });
    if (!result[selectDay]) {
      result[selectDay] = {selected: true};
    }
    setActiveEvents(obj[selectDay] || []);
    setMarkedDates(result)
  };

  const handleDayPress = (day) => {
    const dd = moment(day.dateString).format('YYYY-MM-DD');
    setSelected(dd);
    handleMarked(dd, data);
  };
  const handleChangeMonth = async (month) => {
    const dd = moment(month.dateString).format('YYYY-MM-DD');
    try {
      setSelected(dd);
      setLoading(true);
      let result = await get({year: month.year, month: month.month});
      handleMarked(dd, result);
    } catch (e) {
    }
    setLoading(false);
  };
  if (!ready_locale) return <Spinner/>;
  return (
    <View style={{flex: 1, marginHorizontal: -16}}>
      <NativeCalendar
        markedDates={markedDates}
        current={selected}
        onDayPress={handleDayPress}
        monthFormat={'yyyy MM'}
        onMonthChange={handleChangeMonth}
        hideArrows={false}
        hideExtraDays={false}
        disableMonthChange={false}
        firstDay={1}
        onPressArrowLeft={substractMonth => substractMonth()}
        onPressArrowRight={(addMonth) => addMonth()}
        renderHeader={(date) => (<View style={{paddingRight: 16}}>
          <Text style={Styles.item_title}>{moment(date ? date?.[0] : selected).format('YYYY MMMM')}</Text>
        </View>)}
        theme={{
          calendarBackground: Colors.item_bg,
          textSectionTitleColor: Colors.tintColor, //недели
          todayTextColor: Colors.tintColor,
          arrowColor: Colors.tintColor,
          disabledArrowColor: Colors.text_muted,
          indicatorColor: Colors.tintColor,
          dayTextColor: '#ffffff',
          dotColor: Colors.tintColor,
          textDisabledColor: Colors.text_muted,
          selectedDayBackgroundColor: Colors.secondColor,
        }}
      />
      <View style={{paddingTop: 16}}>
        {loading ? <Spinner/> :
          active_events?.length
            ?
            active_events.map(item => <EventsListItem data={item} key={item.id}/>)
            :
            <NoResults/>
        }
      </View>
    </View>
  );
};

export default withNavigation(Calendar);
