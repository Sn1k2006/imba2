import {api} from "../utils";
import Colors from '../constants/Colors';
export const COLORS = [Colors.secondColor, '#0EBC7C', '#FC5575', '#FF9533', '#7459FF'];
export const COLORS_1 = ['#D1C02A', '#D32C4C', '#0EBC7C', '#D27E31', '#634ED4'];
export const COLORS_2 = ['rgba(255, 221, 0, 0.64)', '#FC5575', 'rgba(3, 199, 102, 0.64)', 'rgba(255, 149, 51, 0.64)', 'rgba(116, 89, 255, 0.64)'];

export const getCoursesList = async (page = 1, done = null) => {
  try {
    return await api('/cards/list', {limit: 40, done}, 'GET');
  } catch (e) {
    throw e;
  }
};

export const getCourse = async (data) => {
  try {
    const res = await api('/cards', data, 'GET');
    return res.data;
  } catch (e) {
    throw e;
  }
};

export const beginLearning = async (id) => {
  if(id === 'end_') return null;
  try {
    return await api('/cards/begin', {id}, 'GET');
  } catch (e) {
    throw e;
  }
};
export const finishedLearning = async (id, settings = null) => {
  if(settings) settings = {...settings, card_id: id};
  try {
    return await api('/cards/end', {id, settings}, 'POST');
  } catch (e) {
    throw e;
  }
};
export const addSettings = async (card_id, settings) => {
  try {
    return await api('/cards/settings', {card_id, settings}, 'POST');
  } catch (e) {
    throw e;
  }
};

export const getColor = (i) => {
  if (i >= COLORS.length) {
    i = i % COLORS.length;
  }
  return COLORS[i];
};

export const getColorByType = (type, settings) => {
  if (type === 'end_section') {
    return COLORS[1];
  } else if (type === 'test') {
    if (settings?.test === 'failed') return COLORS[1];
    else return COLORS[3];
  } else if (type === 'poll') {
    return COLORS[3];
  } else if (type === 'checklist') {
    return COLORS[4];
  } else if (type === 'material') {
    return COLORS[2];
  } else if (type === 'task') {
    if(settings === 'check') return COLORS[0];
    else if(settings === 'rework') return COLORS[1];
    else if(settings === 'accepted') return COLORS[2];
    return COLORS[0];
  } else if (type === 'section' || type === 'direction') {
    return COLORS[2];
  } else {
    return COLORS[0]
  }
};

export const getColorBg = (type, settings) => {
  if (type === 'end_section') {
    return COLORS_1[1];
  } else if (type === 'test') {
    if (settings?.test === 'failed') return COLORS_1[1];
    else return COLORS_1[2];
  } else if (type === 'poll') {
    return COLORS_1[3];
  } else if (type === 'checklist') {
    return COLORS_1[4];
  } else if (type === 'material') {
    return COLORS_1[2];
  }  else if (type === 'task') {
    return COLORS_1[0];
  } else if (type === 'section' || type === 'direction') {
    return COLORS_1[2];
  } else {
    return COLORS_1[0]
  }
};
export const getColorBorder = (type, settings) => {
  if (type === 'end_section') {
    return COLORS_2[1];
  } else if (type === 'test') {
    if (settings?.test === 'failed') return COLORS_2[1];
    else return COLORS_2[2];
  } else if (type === 'poll') {
    return COLORS_2[3];
  } else if (type === 'checklist') {
    return COLORS_2[4];
  } else if (type === 'material') {
    return COLORS_2[2];
  }  else if (type === 'task') {
    return COLORS_2[0];
  } else if (type === 'section' || type === 'direction') {
    return COLORS_2[2];
  } else {
    return COLORS_2[0]
  }
};


export const getPercent = (all, process) => {
  if(all === 0 && process === 0) return 100;
  let percent = 0;
  if (process < 0) return 0;
  if (process) {
    percent = (100 * process) / all;
  }
  percent = Math.floor(percent);
  return percent > 100 ? 100 : percent;
};

export const separateToolsFromData = (obj, parent) => {
  let active_index = 0;
  let data = [];
  let tools = [];
  obj?.map(item => {
    if (item.type === 'tools') {
      tools.push(item);
    } else {
      data.push(item);
    }
  });
  data.map((item, i) => {
    if (typeof item.progress === 'object') {
      if (item.progress?.done === item.progress?.all && active_index === i) active_index = i + 1;
    } else {
      if (item.progress && active_index === i) active_index = i + 1;
    }
  });

  if (active_index > data.length - 1 && parent && (parent?.json?.type === 'direction' || parent?.parent === parent?.root)) {
    data.push({type: 'end_section', id: 'end_'});
  }
  return {data: data, active_index, tools};
};

export const separateLinkFromTools = (obj) => {
  let data = [];
  let links = [];
  obj?.map(item => item.type === 'link' ? links.push(item) : data.push(item));
  return {data, links};
};



