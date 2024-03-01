import axiosInterceptor from "../Interceptor";
import API from "../API";

async function updateDonateSection(params) {
  return axiosInterceptor.post(API.ADD_PAGE_STATIC_DATA, params);
}
async function updateDonTrack(params) {
  return axiosInterceptor.post(API.DONATIONPAGE, params);
}
async function updateDonType(params) {
  return axiosInterceptor.post(API.DONATIONTYPES, params);
}
async function donationList(params) {
  return axiosInterceptor.get(API.DONATEPAGEDYNAMIC, params);
}
async function donationMedia(params) {
  return axiosInterceptor.get(API.HOMEPAGESTATIC, params);
}

async function downloadDonorList(params) {
  var size = Object.keys(params).length;
  if (size > 0) {
    var queryString = Object.keys(params)
      .map((key) => {
        return encodeURIComponent(key) + "=" + encodeURI(params[key]);
      })
      .join("&");
    return axiosInterceptor.get(API.DOWNLOAD_DONATION_LIST + "?" + queryString.trim());
  } else {
    return axiosInterceptor.get(API.DOWNLOAD_DONATION_LIST);
  }
}


export const getDonatePageSevices = {
  updateDonateSection,
  updateDonTrack,
  updateDonType,
  donationList,
  donationMedia,
  downloadDonorList
};
