"use strict";

import axios from "axios";
import conf from "../../public/conf";
import { Message, Loading } from "element-ui";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: conf.url,
  timeout: 30 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
  method: "post",
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
};
let loadingInstance = null;
export const Service = axios.create(config);

Service.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // loadingInstance = Loading.service({
    //   lock: true,
    //   text: "请稍后...",
    // });
    //身份认证相关设置
    // const token = store.state.token;
    // token && (config.headers.Authorization = token);
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
Service.interceptors.response.use(
  function (response) {
    if (loadingInstance) {
      loadingInstance.close();
    }
    if (response["data"]["code"] === 401) {
      //401 退出到登录页面，如在session或localstorage 存储有数据，务必删除
      this.$router.replace({ name: "Login" });
    } else {
      return response.data;
    }
    // Do something with response data
    return response;
  },
  function (error) {
    console.log(error["response"]);
    if (loadingInstance) {
      loadingInstance.close();
    }
    // const msg =
    //   error["response"]["data"]["msg"] !== undefined
    //     ? error["response"]["data"]["msg"]
    //     : "";
    // Message({
    //   message: msg,
    //   type: "error",
    //   duration: 1500,
    // });
    // Do something with response error
    return Promise.reject(error);
  }
);
