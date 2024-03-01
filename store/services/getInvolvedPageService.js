import axiosInterceptor from "../Interceptor";
import API from "../API";

async function addSignUpData(params) {
  return axiosInterceptor.post(API.ADD_SIGNUP_DATA, params);
}

async function updateInterestSetupSection(params) {
  return axiosInterceptor.post(API.GETINVOLVEDINTEREST, params);
}

async function deleteInterestList(params) {
  return axiosInterceptor.post(API.DELETEINTERESTLIST, params);
}

async function deleteLearnMoreList(params) {
  return axiosInterceptor.post(API.DELETELEARNMORELIST, params);
}
async function deleteSignUP(params) {
  return axiosInterceptor.post(API.DELETESignUpList, params);
}

async function updateLearnMoreSection(params) {
  return axiosInterceptor.post(API.ADD_PAGE_STATIC_DATA, params);
}
async function updateLearnMoreSectionFrontend(params) {
  return axiosInterceptor.post(API.POST_LEARNMORE, params);
}

async function getStaticData(params) {
  return axiosInterceptor.get(API.DONATIONTYPESTATIC, params);
}

async function getDynamicData(params) {
  var size = Object.keys(params).length;
  if (size > 0) {
    var queryString = Object.keys(params)
      .map((key) => {
        return encodeURIComponent(key) + "=" + encodeURI(params[key]);
      })
      .join("&");
    return axiosInterceptor.get(
      API.GETINVOLVEDYNAMIC + "?" + queryString.trim()
    );
  } else {
    return axiosInterceptor.get(API.GETINVOLVEDYNAMIC);
  }
}

async function getInterestList(params) {
  return axiosInterceptor.get(API.GETINVOLVEDINTLIST, params);
}

async function getStaticDataPiyush(params) {
  return axiosInterceptor.get(API.HOMEPAGESTATIC, params);
}
async function getSignupListData(params) {
  var size = Object.keys(params).length;
  if (size > 0) {
    var queryString = Object.keys(params)
      .map((key) => {
        return encodeURIComponent(key) + "=" + encodeURI(params[key]);
      })
      .join("&");
    return axiosInterceptor.get(API.GET_SIGNUP_LIST + "?" + queryString.trim());
  } else {
    return axiosInterceptor.get(API.GET_SIGNUP_LIST);
  }
}

async function downloadSignUpReport() {
  return axiosInterceptor.get(API.DOWNLOAD_SIGNUP_REPORT);
}

async function downloadLearnMore(params) {
  var size = Object.keys(params).length;
  if (size > 0) {
    var queryString = Object.keys(params)
      .map((key) => {
        return encodeURIComponent(key) + "=" + encodeURI(params[key]);
      })
      .join("&");
    return axiosInterceptor.get(
      API.DOWNLOAD_LEARN_MORE + "?" + queryString.trim()
    );
  } else {
    return axiosInterceptor.get(API.DOWNLOAD_LEARN_MORE);
  }
}

async function orderPay(params) {
  return axiosInterceptor.post(API.ORDER_PAY, params);
}

async function doPayment(params) {
  return axiosInterceptor.post(API.DO_PAYMENT, params);
}

export const getInvolvePageSevices = {
  updateInterestSetupSection,
  updateLearnMoreSection,
  getStaticData,
  getDynamicData,
  getInterestList,
  getSignupListData,
  getStaticDataPiyush,
  deleteInterestList,
  deleteLearnMoreList,
  addSignUpData,
  downloadSignUpReport,
  downloadLearnMore,
  updateLearnMoreSectionFrontend,
  deleteSignUP,
  orderPay,
  doPayment,
};
