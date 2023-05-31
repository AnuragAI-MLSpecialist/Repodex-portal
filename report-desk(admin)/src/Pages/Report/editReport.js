import React, { useEffect, useMemo, useState } from "react";
import { Modal, notification, Spin, Select } from "antd";
import { getAllCategoryList } from "../../Graphs/Category";
import { getAllSubCategoryList } from "../../Graphs/SubCategory";
import { uploadFileReport } from "../../Graphs/Report";
import { WEBURL } from "../../constant/comman";
import countryList from "react-select-country-list";

const { Option } = Select;

export function EditReport({ onClose, onSubmit, reportData }) {
  const [fields, setFields] = useState({
    name: reportData.name,
    type: reportData.type,
    format: reportData.format,
    region: reportData.regions
      ? reportData.regions
          .filter((regionItem) => regionItem.region)
          .map((regionItem) => regionItem.region)
      : [],
    published_year: reportData.published_year,
    status: reportData.is_active ? 1 : 2,
    short_description: reportData.description,
    country: reportData.countries
      ? reportData.countries
          .filter((countryItem) => countryItem.country)
          .map((countryItem) => countryItem.country)
      : [],
  });
  const [categoryId, setCategoryId] = useState(reportData.category_id._id);
  const [subCategoryId, setSubCategoryId] = useState(
    reportData.sub_category_id._id
  );
  const [loading, setLoading] = useState(false);
  const [uploadedFileName, setUploadFileName] = useState(
    reportData.report_filename
  );
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const countryData = useMemo(() => countryList().getData(), []);

  useEffect(() => {
    listAllCategoryData();
    listAllSubCategoryData();
  }, []);

  const listAllCategoryData = async () => {
    try {
      const { categoryList } = await getAllCategoryList();
      const activeCategory = categoryList.filter((data) => data.is_active);
      setCategoryOptions(activeCategory);
    } catch (e) {}
  };

  const listAllSubCategoryData = async () => {
    try {
      const { categoryList } = await getAllSubCategoryList(
        categoryId || reportData.category_id._id
      );
      const activeSubCategory = categoryList.filter((data) => data.is_active);
      setSubCategoryOptions(activeSubCategory);
    } catch (e) {}
  };

  const onFieldChange = (event, fieldName) => {
    const newFields = { ...fields };
    newFields[fieldName] = event.target.value;
    setFields(newFields);
  };

  const onUpload = async (event) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      const { file } = await uploadFileReport(formData);
      setUploadFileName(file);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const onEditReport = async () => {
    try {
      console.log("!!uploadedFileName!!!", uploadedFileName);
      if (!categoryId) {
        notification["error"]({
          message: "Report",
          description: "Please select category",
        });
        return;
      }

      if (!subCategoryId) {
        notification["error"]({
          message: "Report",
          description: "Please select sub category",
        });
        return;
      }

      if (!uploadedFileName) {
        notification["error"]({
          message: "Report",
          description: "Please upload report",
        });

        return;
      }

      let allFieldsRequired = true;
      Object.keys(fields).forEach((key) => {
        if (!fields[key] && key !== "country") {
          allFieldsRequired = false;
        }
      });

      if (!allFieldsRequired) {
        notification["error"]({
          message: "Report",
          description: "Please provide all data",
        });

        return;
      }

      if (!(fields["region"] && fields["region"].length > 0)) {
        notification["error"]({
          message: "Report",
          description: "Please select region",
        });

        return;
      }

      console.log("!!!all Done!!!!!", fields);

      const newFields = {
        ...fields,
        regions: fields.region.map((regionItem) => ({
          region: regionItem,
        })),
        countries: fields.country.map((countryItem) => ({
          country: countryItem,
        })),
        country: null,
        region: null,
        category_id: categoryId,
        sub_category_id: subCategoryId,
        report_filename: uploadedFileName,
        description: fields["short_description"],
        status: fields["status"] == 1,
      };
      onClose();
      onSubmit(newFields, reportData._id);
    } catch (e) {}
  };

  return (
    <Modal
      visible={true}
      title={"Edit Report"}
      onCancel={onClose}
      width={500}
      footer={null}
    >
      {loading ? (
        <div style={{ width: "100%", textAlign: "center", margin: "0 auto" }}>
          <Spin />
        </div>
      ) : (
        <div>
          <div className="row mb-2">
            <label className="col-sm-2 col-form-label">Report Name</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                placeholder="Enter report name"
                value={fields.name}
                onChange={(event) => onFieldChange(event, "name")}
              />
            </div>
          </div>
          <div className="row mb-2">
            <label className="col-sm-2 col-form-label">Category</label>
            <div className="col-sm-10">
              <select
                className="form-select"
                onChange={(event) => {
                  setCategoryId(event.target.value);
                  listAllSubCategoryData();
                }}
                defaultValue={categoryId}
                value={categoryId}
                required={true}
              >
                <option selected disabled>
                  Select Category
                </option>
                {categoryOptions &&
                  categoryOptions.map((data) => {
                    return <option value={data._id}>{data.name}</option>;
                  })}
              </select>
            </div>
          </div>
          <div className="row mb-2">
            <label className="col-sm-2 col-form-label">Sub-category</label>
            <div className="col-sm-10">
              <select
                className="form-select"
                onChange={(event) => {
                  setSubCategoryId(event.target.value);
                }}
                defaultValue={subCategoryId}
                value={subCategoryId}
                required={true}
              >
                <option selected disabled>
                  Select Sub Category
                </option>
                {subCategoryOptions &&
                  subCategoryOptions.map((data) => {
                    return <option value={data._id}>{data.name}</option>;
                  })}
              </select>
            </div>
          </div>
          <div className="row mb-2">
            <label className="col-sm-2 col-form-label">Type</label>
            <div className="col-sm-10">
              <select
                className="form-select"
                onChange={(event) => {
                  onFieldChange(event, "type");
                }}
                defaultValue={fields.type}
                value={fields.type}
              >
                <option selected disabled>
                  Select Type
                </option>
                <option value={"Whitepaper"}>Whitepaper</option>
                <option value={"Research Report"}>Research Report</option>
                <option value={"Research Paper"}>Research Paper</option>
                <option value={"Infographic"}>Infographic</option>
                <option value={"Press Release"}>Press Release</option>
              </select>
            </div>
          </div>
          <div className="row mb-2">
            <label className="col-sm-2 col-form-label">Format</label>
            <div className="col-sm-10">
              <select
                className="form-select"
                onChange={(event) => {
                  onFieldChange(event, "format");
                }}
                defaultValue={fields.format}
                value={fields.format}
              >
                <option selected disabled>
                  Select Format
                </option>
                <option value={"pdf"}>PDF</option>
                <option value={"png"}>PNG</option>
              </select>
            </div>
          </div>
          <div className="row mb-2">
            <label className="col-sm-2 col-form-label">Region</label>
            <div className="col-sm-10">
              <Select
                mode="multiple"
                value={fields["region"]}
                placeholder="Please select region"
                onChange={(data) => {
                  const newFields = { ...fields };
                  newFields["region"] = data;
                  setFields(newFields);
                }}
                style={{ width: "100%" }}
              >
                <Option key={"North America"}>North America</Option>
                <Option key={"Global"}>Global</Option>
                <Option key={"Europe"}>Europe</Option>
                <Option key={"Middle East"}>Middle East</Option>
                <Option key={"APAC"}>APAC</Option>
              </Select>
              {/* <select
                className="form-select"
                onChange={(event) => {
                  onFieldChange(event, "region");
                }}
                defaultValue={fields.region}
                value={fields.region}
              >
                <option selected disabled>
                  Select Region
                </option>
                <option value={"North America"}>North America</option>
                <option value={"Global"}>Global</option>
                <option value={"Europe"}>Europe</option>
                <option value={"Middle East"}>Middle East</option>
                <option value={"APAC"}>APAC</option>
              </select> */}
            </div>
          </div>
          <div className="row mb-2">
            <label className="col-sm-2 col-form-label">Country</label>
            <div className="col-sm-10">
              {countryData && (
                <Select
                  mode="multiple"
                  placeholder="Please select country"
                  value={fields["country"]}
                  onChange={(data) => {
                    const newFields = { ...fields };
                    newFields["country"] = data;
                    setFields(newFields);
                  }}
                  style={{ width: "100%" }}
                >
                  {countryData &&
                    countryData.map((data) => (
                      <Option key={data.value}>{data.label}</Option>
                    ))}
                </Select>
              )}

              {/* <select
                className="form-select"
                onChange={(event) => {
                  onFieldChange(event, "country");
                }}
                defaultValue={fields.country}
                value={fields.country}
              >
                <option selected disabled>
                  Select Country
                </option>
                {countryData &&
                  countryData.map((data) => (
                    <option value={data.value}>{data.label}</option>
                  ))}
              </select> */}
            </div>
          </div>
          <div className="row mb-2">
            <label className="col-sm-2 col-form-label">Published Year</label>
            <div className="col-sm-10">
              <input
                type="number"
                className="form-control"
                placeholder="e.g 2022"
                value={fields.published_year}
                onChange={(event) => onFieldChange(event, "published_year")}
              />
            </div>
          </div>
          <div className="row mb-2">
            <label className="col-sm-2 col-form-label">Report file</label>
            <div className="col-sm-10">
              <input
                type="file"
                className="form-control"
                placeholder="pdf or png"
                accept=".pdf,.png"
                onChange={(event) => onUpload(event)}
              />
            </div>
          </div>
          <div className="row mb-2">
            <label className="col-sm-2 col-form-label">File</label>
            <div className="col-sm-10">
              {reportData.format === "png" ? (
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "5px",
                    marginBottom: "5px",
                  }}
                >
                  <img
                    src={`${WEBURL}report/${uploadedFileName}`}
                    alt="Report Image"
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    paddingTop: "6px",
                  }}
                >
                  <a
                    href={`${WEBURL}report/${uploadedFileName}`}
                    target="_blank"
                  >
                    File Link
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="row mb-2">
            <label className="col-sm-2 col-form-label">Status</label>
            <div className="col-sm-10">
              <select
                className="form-select"
                onChange={(event) => {
                  onFieldChange(event, "status");
                }}
                defaultValue={fields.status}
                value={fields.status}
                disabled={true}
              >
                <option selected value={1}>
                  Active
                </option>
                <option value={2}>Deactivate</option>
              </select>
            </div>
          </div>
          <div className="row mb-2">
            <label
              className="col-sm-2 col-form-label"
              htmlFor="basic-default-message"
            >
              Short Description
            </label>
            <div className="col-sm-10">
              <textarea
                className="form-control"
                placeholder="Enter short description"
                rows={3}
                defaultValue={""}
                value={fields.short_description}
                onChange={(event) => onFieldChange(event, "short_description")}
              />
            </div>
          </div>
          <div className="row justify-content-end">
            <div className="col-sm-12 text-center">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => onEditReport()}
              >
                <i className="far fa-check-circle me-2" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
