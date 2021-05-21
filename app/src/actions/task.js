import {api} from "../utils";
import {toJS} from "mobx";

export const taskChat = async (data) => {
  try {
    return await api('/chats', data, 'POST');
  } catch (e) {
    throw e;
  }
};
