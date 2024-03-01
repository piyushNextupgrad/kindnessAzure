import axiosInterceptor from "../Interceptor";
import API from "../API";

async function addPageStaticContent(params) {
  return axiosInterceptor.post(API.ADD_PAGE_STATIC_DATA, params);
}

async function addDescription(params) {
  return axiosInterceptor.post(API.ADD_HOME_DESCRIPTION, params);
}

async function addMeetExecutive(params) {
  return axiosInterceptor.post(API.ADD_HOME_MEET_EXECUTIVE, params);
}

async function addCampaignNewsData(params) {
  return axiosInterceptor.post(API.CAMPAIGN_NEWS, params);
}

async function addSponsorPartnerData(params) {
  return axiosInterceptor.post(API.ADD_HOME_SPONSOR_PARTNER, params);
}

async function homePageDescAccomp(params) {
  var size = Object.keys(params).length;
  if (size > 0) {
    var queryString = Object.keys(params)
      .map((key) => {
        return encodeURIComponent(key) + "=" + encodeURI(params[key]);
      })
      .join("&");
    return axiosInterceptor.get(
      API.GET_HOME_DESCRIPTION + "?" + queryString.trim()
    );
  } else {
    return axiosInterceptor.get(API.GET_HOME_DESCRIPTION);
  }
}

async function pageStaticData(params) {
  var size = Object.keys(params).length;
  if (size > 0) {
    var queryString = Object.keys(params)
      .map((key) => {
        return encodeURIComponent(key) + "=" + encodeURI(params[key]);
      })
      .join("&");
    return axiosInterceptor.get(API.HOMEPAGESTATIC + "?" + queryString.trim());
  } else {
    return axiosInterceptor.get(API.HOMEPAGESTATIC);
  }
}

async function adminHomeDynamic2(params) {
  return axiosInterceptor.get(API.HOMEDESCACCOMP, params);
}

async function pageStaticDataPOST(params) {
  var size = Object.keys(params).length;
  if (size > 0) {
    var queryString = Object.keys(params)
      .map((key) => {
        return encodeURIComponent(key) + "=" + encodeURI(params[key]);
      })
      .join("&");
    return axiosInterceptor.post(
      API.ADD_PAGE_STATIC_DATA + "?" + queryString.trim()
    );
  } else {
    return axiosInterceptor.post(API.ADD_PAGE_STATIC_DATA);
  }
}
export const homePageService = {
  addDescription,
  addMeetExecutive,
  addSponsorPartnerData,
  addCampaignNewsData,
  homePageDescAccomp,
  pageStaticData,
  adminHomeDynamic2,
  addPageStaticContent,
  pageStaticDataPOST,
};
