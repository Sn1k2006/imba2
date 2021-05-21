import {api} from "../utils";

export const getEventsList = async (page = 1) => {
  try {
    return await api('/events', {limit: 20, page}, 'GET');
  } catch (e) {
    throw e;
  }
};
export const getEventsMonth = async (data = {}) => {
  try {
    const res =  await api('/events/date', data, 'GET');
    return res.data;
  } catch (e) {
    throw e;
  }
};

