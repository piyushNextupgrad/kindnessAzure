import axiosInterceptor from "../Interceptor";
import API from "../API";

async function getComments(params) {
  return axiosInterceptor.get(API.GET_COMMENTS, params);
}
async function getFilteredComments(params) {
  return axiosInterceptor.get(API.GET_FILTER_COMMENTS, params);
}
async function postComments(params) {
  return axiosInterceptor.post(API.POST_COMMENTS, params);
}

export const newsPageService = {
  getComments,
  postComments,
  getFilteredComments,
};
