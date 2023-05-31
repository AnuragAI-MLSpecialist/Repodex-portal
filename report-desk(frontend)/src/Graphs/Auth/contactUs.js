import { CUSTOMMAIL } from "../../constant/comman";
import axios from "axios";

export async function sendCustomMail(values) {
  try {
    return await axios.post(`${CUSTOMMAIL}`, {
      first_name: values?.first_name,
      last_name: values?.last_name,
      subject: values?.subject,
      phone_number: values?.phone,
      email: values?.email,
      request_message: values?.request_message,
    });
  } catch (error) {
    throw error;
  }
}
