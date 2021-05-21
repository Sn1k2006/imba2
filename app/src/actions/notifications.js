import {api} from "../utils";

export const getNotifList = async (page = 1) => {
  try {
    return await api('/notifications', {page, limit: 15}, 'GET');
  } catch (e) {
    throw e;
  }
};

export const readNotification = async () => {
  try {
    return await api('/notifications/disable', {}, 'POST');
  } catch (e) {
    throw e;
  }
};

export const removeNotification = async (id) => {
  try {
    return await api('/notifications', {id}, 'DELETE');
  } catch (e) {
    throw e;
  }
};