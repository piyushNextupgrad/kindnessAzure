import { APPCONST } from "../constant/globalVar";
import axios from "axios";

const axiosInterceptor = axios.create({
  baseURL: APPCONST.API_URL,
});

function getOSversion() {
  return navigator.userAgent;
}

function getTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function deviceToken() {
  let d_token =
    navigator.userAgent + Intl.DateTimeFormat().resolvedOptions().timeZone;
  return window.btoa(d_token);
}

const csrf_token_key = "XSRF-TOKEN";

axiosInterceptor.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem(APPCONST.AccessToken);
    // let token = 'testwrongtoken';

    const headers = {
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "multipart/form-data",
      Timezone: getTimeZone(),
      Osversion: getOSversion(),
      Devicetoken: deviceToken(),
    };

    if (accessToken) {
      headers.accesstoken = accessToken;
      headers.csrf_token_key = accessToken;
      headers.Authorization = accessToken;
    }
    request.headers = headers;

    return request;
  },
  (error) => Promise.reject(error)
);
// End of Request interceptor

// Response interceptor
axiosInterceptor.interceptors.response.use(
  (response) => {
    // Modify the response data here
    return response;
  },
  (error) => {
    // Handle response errors here

    return Promise.reject(error);
  }
);
// End of Response interceptor

export default axiosInterceptor;
