import { SIGNUP } from "../../constant/comman";
import axios from "axios";

export async function callSignUp(values) {
  try {
    return await axios.post(`${SIGNUP}`, {
      first_name: values.first_name,
      last_name: values.last_name,
      company_name: values.company_name,
      phone: values.phone,
      email: values.email,
      password: values.password,
      country: values.selected_country,
    });
  } catch (error) {
    throw error;
  }
}
