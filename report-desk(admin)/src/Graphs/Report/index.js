import axios from "axios";
import { WEBURL } from "../../constant/comman";

export async function getReportList(skipNumber, limitNumber, searchText) {
  try {
    if (searchText) {
      return await axios.get(
        `${WEBURL}api/v1/auth/admin/report/list/${skipNumber}/${limitNumber}?search=name:${searchText}`
      );
    }

    return await axios.get(
      `${WEBURL}api/v1/auth/admin/report/list/${skipNumber}/${limitNumber}`
    );
  } catch (error) {
    throw error;
  }
}

export async function createReport(newFields) {
  try {
    return await axios.post(`${WEBURL}api/v1/auth/admin/report`, {
      ...newFields,
    });
  } catch (error) {
    throw error;
  }
}

export async function changeActiveStatus(id, status) {
  try {
    return await axios.put(`${WEBURL}api/v1/auth/admin/report/status/${id}`, {
      flag: status,
    });
  } catch (error) {
    throw error;
  }
}

export async function deleteReport(id) {
  try {
    return await axios.delete(`${WEBURL}api/v1/auth/admin/report/${id}`);
  } catch (error) {
    throw error;
  }
}

export async function editReport(newFields, reportId) {
  try {
    return await axios.put(`${WEBURL}api/v1/auth/admin/report`, {
      ...newFields,
      id: reportId,
    });
  } catch (error) {
    throw error;
  }
}

export async function uploadFileReport(file) {
  try {
    return await axios.post(`${WEBURL}file/upload/report/file`, file, {
      headers: {
        "content-type": "multipart/form-data",
      },
    });
  } catch (error) {
    throw error;
  }
}
