import axios from "axios";
import { WEBURL } from "../../constant/comman";

export async function callLogin(email, password) {
  try {
    return await axios.post(`${WEBURL}api/v1/admin/login-admin`, {
      email: email,
      password: password,
    });
  } catch (error) {
    throw error;
  }
}

export async function changePassword(oldPassword, newPassword) {
  try {
    return await axios.post(`${WEBURL}api/v1/auth/admin/reset-password`, {
      oldPassword,
      newPassword,
    });
  } catch (error) {
    throw error;
  }
}
