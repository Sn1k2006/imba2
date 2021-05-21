import {api} from "../utils";

export const getBlogsList = async (page = 1, own = 0, filters) => {
  try {
    return await api('/blogs/list', {limit: 25, page, own, ...filters}, 'POST');
  } catch (e) {
    throw e;
  }
};

export const createBlog = async (blog) => {
  try {
    let res = await api('/blogs', blog, 'POST');
    return res.data;
  } catch (e) {
    throw e;
  }
};
export const updateBlog = async (blog) => {
  try {
    let res = await api('/blogs', blog, 'PUT');
    return res.data;
  } catch (e) {
    throw e;
  }
};
export const deleteBlog = async (id) => {
  try {
    return await api('/blogs', {id}, 'DELETE');
  } catch (e) {
    throw e;
  }
};
export const complainOnBlog = async (id, status) => {
  try {
    return await api('/blogs/claim', {id, status}, 'POST');
  } catch (e) {
    throw e;
  }
};



export const separateFinishedCourses = (courses) => {

  if(!courses) return null;
  let res = courses?.filter(item => item?.progress?.all === item?.progress?.done);
  return res.length ? res : null;
};