import {api} from "../utils";

export const rating = async (entity_id, type, action) => {
  action = action ? 'like' : 'unlike';
  try {
    let res = await api('/rating', {entity_id, type, action}, 'POST');
    return res.data;
  } catch (e) {
    throw e;
  }
};