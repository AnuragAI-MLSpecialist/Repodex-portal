import { SETNEWPASSWORD } from "../../constant/comman";
import axios from 'axios';

export async function setNewPassword(values) {
    try {
      return await axios.post(`${SETNEWPASSWORD}`, {
        code: values.code,
        password: values.newPassword,
      });
    } catch (error) {
      throw error;
    }
  }