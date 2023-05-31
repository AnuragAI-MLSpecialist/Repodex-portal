import get from "lodash/get";
import { useDispatch } from "react-redux";
import { notification } from "antd";
import {LOGIN, SIGNUP,FORGOTPASSWORD} from "../constant/comman";

export default function setupAxios(axios, store) {
  axios.interceptors.request.use(
    (config) => {
      const {
        auth: { authToken },
      } = store.getState();

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }

      return config;
    },
    (err) => Promise.reject(err)
  );

  axios.interceptors.response.use(
    (response) => response.data,
    async (error) => {
      const originalRequest = error.config;
      const status = get(error, "response.status");
      const errorKey = get(error, "response.data.errorKey");
      const message = get(error, "response.data.message");
      const payload = get(error, "response.data.payload");

      console.log(
        "!!!!!!error in callAPi function",
        originalRequest,
        status,
        errorKey,
        message,
        payload
      );

      if (status && status === 500 && originalRequest.url!==LOGIN && originalRequest.url!==SIGNUP && originalRequest.url!==FORGOTPASSWORD) {
        notification["error"]({
          message: "Server Error",
          description:
            typeof message === "string"
              ? message
              : "Something Went Wrong, Please try again",
        });
      }

      if (status && status === 401) {
        notification["error"]({
          message: "UnAuthorize",
          description:
            typeof message === "string"
              ? message
              : "You are not authorized, please login again",
        });

        const dispatch = useDispatch();
        await dispatch({
          type: "USER_LOGOUT",
        });
        setTimeout(function () {
          document.location.reload();
        }, 1000);
      }

      // general error message
      return Promise.reject({
        originalRequest: originalRequest,
        status: status,
        message: message,
      });
    }
  );
}
