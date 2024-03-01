import axiosInterceptor from "../Interceptor";
import API from "../API";


async function login(params) {
    return axiosInterceptor.post(API.LOGIN, params);
}

export const userServices = {
    login
};