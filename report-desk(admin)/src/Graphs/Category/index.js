import axios from "axios";
import { WEBURL } from "../../constant/comman";

export async function getAllCategoryList() {
  try {
    return await axios.get(`${WEBURL}api/v1/auth/admin/category/list/dropdown`);
  } catch (error) {
    throw error;
  }
}

export async function getCategoryList(skipNumber, limitNumber, searchText) {
  try {
    if (searchText) {
      return await axios.get(
        `${WEBURL}api/v1/auth/admin/category/list/${skipNumber}/${limitNumber}?search=name:${searchText}`
      );
    }

    return await axios.get(
      `${WEBURL}api/v1/auth/admin/category/list/${skipNumber}/${limitNumber}`
    );
  } catch (error) {
    throw error;
  }
}

export async function createCategory(name, isActive) {
  try {
    return await axios.post(`${WEBURL}api/v1/auth/admin/category`, {
      name,
      is_active: isActive,
    });
  } catch (error) {
    throw error;
  }
}

export async function changeActiveStatus(id, status) {
  try {
    return await axios.put(`${WEBURL}api/v1/auth/admin/category/status/${id}`, {
      flag: status,
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteCategory(id) {
  try {
    return await axios.delete(`${WEBURL}api/v1/auth/admin/category/${id}`);
  } catch (error) {
    throw error;
  }
}

export async function editCategory(values) {
  try {
    return await axios.put(`${WEBURL}api/v1/auth/admin/category`, {
      name: values.name,
      id: values.id,
    });
  } catch (error) {
    throw error;
  }
}
