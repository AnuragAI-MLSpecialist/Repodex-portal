import axios from "axios";
import { WEBURL } from "../../constant/comman";

export async function getUsersList(skipNumber, limitNumber, searchText) {
  try {
    if (searchText) {
      return await axios.get(
        `${WEBURL}api/v1/auth/admin/user/list/${skipNumber}/${limitNumber}?search=search:${searchText}`
      );
    }

    return await axios.get(
      `${WEBURL}api/v1/auth/admin/user/list/${skipNumber}/${limitNumber}`
    );
  } catch (error) {
    throw error;
  }
}

export async function changeActiveStatus(id, status) {
  try {
    return await axios.put(
      `${WEBURL}api/v1/auth/admin/user/update_status/${id}`,
      {
        flag: status,
      }
    );
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(id) {
  try {
    return await axios.delete(`${WEBURL}api/v1/auth/admin/user/delete/${id}`);
  } catch (error) {
    throw error;
  }
}
