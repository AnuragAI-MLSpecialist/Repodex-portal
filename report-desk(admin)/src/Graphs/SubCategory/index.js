import axios from "axios";
import { WEBURL } from "../../constant/comman";

export async function getAllSubCategoryList(categoryId) {
  try {
    return await axios.get(
      `${WEBURL}api/v1/auth/admin/sub-category/list/dropdown/${categoryId}`
    );
  } catch (error) {
    throw error;
  }
}

export async function getSubCategoryList(skipNumber, limitNumber, searchText) {
  try {
    if (searchText) {
      return await axios.get(
        `${WEBURL}api/v1/auth/admin/sub-category/list/${skipNumber}/${limitNumber}?search=name:${searchText}`
      );
    }

    return await axios.get(
      `${WEBURL}api/v1/auth/admin/sub-category/list/${skipNumber}/${limitNumber}`
    );
  } catch (error) {
    throw error;
  }
}

export async function createSubCategory(name, isActive, categoryId) {
  try {
    return await axios.post(`${WEBURL}api/v1/auth/admin/sub-category/create`, {
      name,
      category_id: categoryId,
      is_active: isActive,
    });
  } catch (error) {
    throw error;
  }
}

export async function changeActiveStatus(id, status) {
  try {
    return await axios.put(
      `${WEBURL}api/v1/auth/admin/sub-category/status/${id}`,
      {
        flag: status,
      }
    );
  } catch (error) {
    throw error;
  }
}

export async function deleteSubCategory(id) {
  try {
    return await axios.delete(`${WEBURL}api/v1/auth/admin/sub-category/${id}`);
  } catch (error) {
    throw error;
  }
}

export async function editSubCategory(values) {
  try {
    return await axios.put(`${WEBURL}api/v1/auth/admin/sub-category/edit`, {
      name: values.name,
      category_id: values.category_id,
      id: values.id,
    });
  } catch (error) {
    throw error;
  }
}
