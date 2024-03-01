import axiosInterceptor from "../Interceptor";
import API from "../API";

async function addEquitySectionContent(params) {
  return axiosInterceptor.post(API.campaignHeaderContent, params);
}

async function getLoopData(params) {
  var size = Object.keys(params).length;
  if (size > 0) {
    var queryString = Object.keys(params).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURI(params[key])
    }).join('&');    
    return axiosInterceptor.get(API.CAMPDYNAMIC + '?' + queryString.trim());
  } else {
    return axiosInterceptor.get(API.CAMPDYNAMIC);
  }
  
}
async function adminMedia(params) {
  return axiosInterceptor.get(API.HOMEPAGESTATIC, params);
}
async function adminMedia2(params) {
  return axiosInterceptor.get(API.CAMPDYNAMICADMIN, params);
}
export const campaignServices = {
  addEquitySectionContent, 
  getLoopData,
  adminMedia,
  adminMedia2,
};
