import axios from "axios";
import { REPORTLIST, FILTERCATEGORY } from "../../constant/comman";

export const reportList = async (searchPaginationData) => {
  const formData = {};

  if (searchPaginationData.category_Id)
    formData.category_id = searchPaginationData.category_Id;

  if (searchPaginationData.subCategory_Id)
    formData.sub_category_id = searchPaginationData.subCategory_Id;

  if (searchPaginationData.published_Year)
    formData.published_year = searchPaginationData.published_Year;

  if (searchPaginationData.country)
    formData.country = searchPaginationData.country;

  if (searchPaginationData.region)
    formData.region = searchPaginationData.region;

  if (searchPaginationData.type) formData.type = searchPaginationData.type;

  let URL = `${REPORTLIST}/${searchPaginationData.skip}/${searchPaginationData.limit}`;
  if (searchPaginationData?.name) {
    URL = `${REPORTLIST}/${searchPaginationData.skip}/${searchPaginationData.limit}/?search=name:${searchPaginationData?.name}`;
  }

  try {
    if (formData && Object.keys(formData).length >= 1) {
      return axios.post(URL, formData);
    } else {
      return axios.post(URL);
    }
  } catch (error) {
    throw error;
  }
};

export const searchByCategory = async (id) => {
  try {
    return await axios.get(`${FILTERCATEGORY}/${id}`);
  } catch (error) {
    throw error;
  }
};
