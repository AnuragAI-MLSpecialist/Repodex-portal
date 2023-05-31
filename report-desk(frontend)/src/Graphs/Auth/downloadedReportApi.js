import { DOWNLOADREPORTLIST } from "../../constant/comman";
import axios from "axios";

export async function listDownloadedReport(searchPaginationData) {
  const formData = {};

  if (searchPaginationData.category_Id)
    formData.category_id = searchPaginationData?.category_Id;

  if (searchPaginationData.subCategory_Id)
    formData.sub_category_id = searchPaginationData?.subCategory_Id;

  if (searchPaginationData.country)
    formData.country = searchPaginationData?.country;

  if (searchPaginationData.region)
    formData.region = searchPaginationData?.region;

  if (searchPaginationData.type) formData.type = searchPaginationData?.type;

  try {
    if (formData && Object.keys(formData).length >= 1) {
      return await axios.post(
        `${DOWNLOADREPORTLIST}/${searchPaginationData.skip}/${searchPaginationData.limit}`,
        formData
      );
    } else {
      return await axios.post(
        `${DOWNLOADREPORTLIST}/${searchPaginationData.skip}/${searchPaginationData.limit}`
      );
    }
  } catch (error) {
    throw error;
  }
}
