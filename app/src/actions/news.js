import {api, translate} from "../utils";
import moment, {utc} from "moment";

export const getNewsList = async (page = 1) => {
  try {
    return await api('/news', {limit: 20, page}, 'GET');
  } catch (e) {
    throw e;
  }
};
export const getNews = async (id) => {
  try {
    const res = await api('/news', {id}, 'GET');
    return res.data;
  } catch (e) {
    throw e;
  }
};
export const getNewsDate = (date, count) => {
  date = moment(date).startOf('day');
  let startOfToday = moment().startOf('day');
  let diff = (date.diff(startOfToday, 'days'));
  if(count) return diff;
  if (diff === 0) return translate('Today');
  else if (diff === -1) return translate('Yesterday');
  else return moment(date).format('DD.MM.YYYY');
};