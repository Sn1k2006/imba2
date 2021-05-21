import {api} from "../utils";
import {toJS} from "mobx";

export const addAchivToUser = async (card_id, achiv) => {
  if (!achiv) return null;
  const achievement = {...achiv, image: achiv?.image?.id};
  try {
    return await api('/achievements', {...achievement, card_id}, 'POST');
  } catch (e) {
    throw e;
  }
};

export const getAchievementsList = async (page = 1) => {
  try {
    return await api('/achievements/list', {page, limit: 15}, 'GET');
  } catch (e) {
    throw e;
  }
};

export const separateAchiveInTest = (mark, achievements) => {
  if (!achievements) return null;
  const lowerAchieve = achievements.filter(item => Number(item.place) <= mark);
  lowerAchieve.sort(function (a, b) {
    return a.place - b.place;
  });
  if(!lowerAchieve?.length) return null;
  let result = toJS(lowerAchieve[lowerAchieve.length - 1]) || {};
  result.place = mark;
  return result;
};

export const getStarFromPlace = (place) => {
  let star = 0;
  if(place === 7) star = 1;
  else if(place === 8) star = 2;
  else if(place > 8) star = 3;
  return star;
};