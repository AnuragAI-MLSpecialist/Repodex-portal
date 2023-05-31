import axios from "axios";
import { LOGIN } from "../../constant/comman";
import { FORGOTPASSWORD } from "../../constant/comman";

export const callLogin = async (email, password) => {
  try {
    return await axios.post(`${LOGIN}`, {
      email: email,
      password: password,
    });
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (value) => {
  try {
    return await axios.post(`${FORGOTPASSWORD}`, { email: value.email });
  } catch (error) {
    throw error;
  }
};
