import axiosInterceptor from "../Interceptor";
import API from "../API";

async function updateContactSection(params) {
  return axiosInterceptor.post(API.contactUs, params);
}

async function sendContactFormData(params) {
  return axiosInterceptor.post(API.ADD_CONTACT_FORM_DATA, params);
}

async function updateContactSection2(params) {
  return axiosInterceptor.post(API.ADD_PAGE_STATIC_DATA, params);
}
async function contactUsGet(params) {
  return axiosInterceptor.get(API.CONTACTUSGET, params);
}
export const contactPageSevices = {
  updateContactSection,
  updateContactSection2,
  contactUsGet,
  sendContactFormData,
};
