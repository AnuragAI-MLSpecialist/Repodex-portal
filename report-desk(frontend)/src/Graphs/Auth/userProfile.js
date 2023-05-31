import { USERPROFILE, RESETPASSWORD} from "../../constant/comman";
import axios from "axios";

export async function userProfile(values) {
  try {
    return await axios.put(`${USERPROFILE}`, {
      first_name: values.first_name,
      last_name: values.last_name,
      company_name: values.company_name,
      phone: values.phone,
      email: values.email,
      country: values.selected_country,
    });
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(values) {
  try {
    return await axios.post(`${RESETPASSWORD}`, {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
  } catch (error) {
    throw error;
  }
}


