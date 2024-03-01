import axiosInterceptor from "../Interceptor";
import API from "../API";

async function updateEventSection(params) {
  return axiosInterceptor.post(API.EVENTPAGE1, params);
}

async function updateEventSection2(params) {
  return axiosInterceptor.post(API.EVENTPAGE2, params);
}
async function updateEventSectionVideo(params) {
  return axiosInterceptor.post(API.ADD_PAGE_STATIC_DATA, params);
}
async function updateEventManagement(params) {
  return axiosInterceptor.post(API.EVENTMANAGEMENT, params);
}
async function updateRSVP(params) {
  return axiosInterceptor.post(API.POST_RSVP, params);
}
async function eventPageDynamic(params) {
  return axiosInterceptor.get(API.GETEVENTPAGEDYNAMIC, params);
}

async function adminMedia(params) {
  return axiosInterceptor.get(API.GETEVENTPAGEDYNAMIC, params);
}
async function adminMedia2(params) {
  return axiosInterceptor.get(API.HOMEPAGESTATIC, params);
}
async function adminMedia3(params) {
  return axiosInterceptor.get(API.EVENTPAGE3, params);
}
async function eventList(params) {
  return axiosInterceptor.get(API.EVENTPAGEMEDIA, params);
}
async function getAttentionText(params) {
  return axiosInterceptor.get(API.HOMEPAGESTATIC, params);
}
async function getRSVP(params) {
  return axiosInterceptor.get(API.GET_RSVP, params);
}
async function delRSVP(params) {
  return axiosInterceptor.post(API.DEL_RSVP, params);
}

async function getAllEventList(params) {
  var size = Object.keys(params).length;
  if (size > 0) {
    var queryString = Object.keys(params)
      .map((key) => {
        return encodeURIComponent(key) + "=" + encodeURI(params[key]);
      })
      .join("&");
    return axiosInterceptor.get(API.GET_ALL_EVENTS + "?" + queryString.trim());
  } else {
    return axiosInterceptor.get(API.GET_ALL_EVENTS);
  }
}

async function getSingleEventData(params) {
  var size = Object.keys(params).length;
  if (size > 0) {
    var queryString = Object.keys(params)
      .map((key) => {
        return encodeURIComponent(key) + "=" + encodeURI(params[key]);
      })
      .join("&");
    return axiosInterceptor.get(
      API.GET_SINGLE_EVENTS + "?" + queryString.trim()
    );
  } else {
    return axiosInterceptor.get(API.GET_SINGLE_EVENTS);
  }
}

async function downloadEventListData() {
  return axiosInterceptor.get(API.DOWNLOAD_EVENT_LIST);
}

async function downloadRegisteredUserOfEvent() {
  return axiosInterceptor.get(API.DOWNLOAD_REGISTERED_EVENT_USER);
}

export const eventPageSevices = {
  updateEventSection,
  updateEventSection2,
  updateEventSectionVideo,
  updateEventManagement,
  eventPageDynamic,
  adminMedia,
  adminMedia2,
  adminMedia3,
  eventList,
  getAllEventList,
  getSingleEventData,
  downloadEventListData,
  downloadRegisteredUserOfEvent,
  getAttentionText,
  updateRSVP,
  getRSVP,
  delRSVP,
};
