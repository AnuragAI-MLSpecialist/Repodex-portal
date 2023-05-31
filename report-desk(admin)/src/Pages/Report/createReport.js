import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { notification, Popconfirm, Spin, Table, Tooltip, Select } from "antd";
import { getAllCategoryList } from "../../Graphs/Category";
import { getAllSubCategoryList } from "../../Graphs/SubCategory";
import { uploadFileReport, createReport } from "../../Graphs/Report";
import CustomLoader from "../../components/Common/CustomLoader";
import countryList from "react-select-country-list";

const { Option } = Select;

class CreateReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      categoryOptions: [],
      subCategoryOptions: [],
      countryData: [],
      selectedCategoryId: null,
      selectedSubCategoryId: null,
      fields: {
        name: "",
        type: null,
        format: null,
        region: [],
        country: [],
        published_year: "",
        status: 1,
        short_description: "",
      },
      uploadedFileName: "",
    };
  }

  componentDidMount = async () => {
    try {
      this.setState({
        isLoading: true,
        countryData: countryList().getData(),
      });
      await this.listAllCategoryData();
      await this.listAllSubCategoryData();
    } catch (e) {
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  listAllCategoryData = async () => {
    try {
      const { categoryList } = await getAllCategoryList();
      const activeCategory = categoryList.filter((data) => data.is_active);
      this.setState({
        categoryOptions: activeCategory,
      });
    } catch (e) {}
  };

  listAllSubCategoryData = async () => {
    try {
      const { selectedCategoryId } = this.state;
      if (selectedCategoryId) {
        const { categoryList } = await getAllSubCategoryList(
          selectedCategoryId
        );
        const activeSubCategory = categoryList.filter((data) => data.is_active);
        this.setState({
          subCategoryOptions: activeSubCategory,
        });
      }
    } catch (e) {}
  };

  onFieldChange = (event, fieldName) => {
    const { fields } = this.state;
    const newFields = { ...fields };
    newFields[fieldName] = event.target.value;
    this.setState({
      fields: newFields,
    });
  };

  onUpload = async (event) => {
    try {
      this.setState({
        isLoading: true,
      });
      const formData = new FormData();
      formData.append("file", event.target.files[0]);
      const { file } = await uploadFileReport(formData);
      this.setState({
        uploadedFileName: file,
        isLoading: false,
      });
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  onNewReport = async () => {
    try {
      const {
        fields,
        selectedCategoryId,
        selectedSubCategoryId,
        uploadedFileName,
      } = this.state;

      console.log("!!!!!uploadedFileName!!!!", uploadedFileName);

      if (!selectedCategoryId) {
        notification["error"]({
          message: "Report",
          description: "Please select category",
        });
        return;
      }

      if (!selectedSubCategoryId) {
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

      if (
        !(
          fields["published_year"] &&
          fields["published_year"] > 0 &&
          fields["published_year"].length == 4
        )
      ) {
        notification["error"]({
          message: "Report",
          description: "Please provide valid published year",
        });

        return;
      }

      console.log("!!!!!!All Done!!!!!!", fields);

      this.setState({
        isLoading: true,
      });
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
        category_id: selectedCategoryId,
        sub_category_id: selectedSubCategoryId,
        report_filename: uploadedFileName,
        description: fields["short_description"],
        status: fields["status"] == 1,
      };

      const { data } = await createReport(newFields);
      console.log("!!!!!!!!data!!!!!!!", data);
      this.setState({
        isLoading: false,
      });
      this.props.history.push("/reports");
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    }
  };

  render() {
    const { isLoading, categoryOptions, subCategoryOptions, fields } =
      this.state;

    return isLoading ? (
      <CustomLoader />
    ) : (
      <div className="content-wrapper">
        {/* Content */}
        <div className="container-xxl flex-grow-1 container-p-y">
          <div className="row justify-content-center">
            <div className="col col-md-8 col-12">
              <div className="card mb-4">
                <div className="card-body">
                  <div>
                    <div className="row mb-2">
                      <label className="col-sm-2 col-form-label">
                        Report Name
                      </label>
                      <div className="col-sm-10">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter report name"
                          value={fields.name}
                          onChange={(event) =>
                            this.onFieldChange(event, "name")
                          }
                        />
                      </div>
                    </div>
                    <div className="row mb-2">
                      <label className="col-sm-2 col-form-label">
                        Category
                      </label>
                      <div className="col-sm-10">
                        <select
                          className="form-select"
                          onChange={(event) => {
                            this.setState(
                              {
                                selectedCategoryId: event.target.value,
                              },
                              () => {
                                this.listAllSubCategoryData();
                              }
                            );
                          }}
                          defaultValue={this.state.selectedCategoryId}
                          value={this.state.selectedCategoryId}
                          required={true}
                        >
                          <option selected disabled>
                            Select Category
                          </option>
                          {categoryOptions &&
                            categoryOptions.map((data) => {
                              return (
                                <option value={data._id}>{data.name}</option>
                              );
                            })}
                        </select>
                      </div>
                    </div>
                    <div className="row mb-2">
                      <label className="col-sm-2 col-form-label">
                        Sub-category
                      </label>
                      <div className="col-sm-10">
                        <select
                          className="form-select"
                          onChange={(event) => {
                            this.setState({
                              selectedSubCategoryId: event.target.value,
                            });
                          }}
                          defaultValue={this.state.selectedSubCategoryId}
                          value={this.state.selectedSubCategoryId}
                          required={true}
                        >
                          <option selected disabled>
                            Select Sub Category
                          </option>
                          {subCategoryOptions &&
                            subCategoryOptions.map((data) => {
                              return (
                                <option value={data._id}>{data.name}</option>
                              );
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
                            this.onFieldChange(event, "type");
                          }}
                          defaultValue={fields.type}
                          value={fields.type}
                        >
                          <option selected disabled>
                            Select Type
                          </option>
                          <option value={"Whitepaper"}>Whitepaper</option>
                          <option value={"Research Report"}>
                            Research Report
                          </option>
                          <option value={"Research Paper"}>
                            Research Paper
                          </option>
                          <option value={"Infographic"}>Infographic</option>
                          <option value={"Press Release"}>Press Release</option>
                          <option value={"Survey"}>Survey</option>
                        </select>
                      </div>
                    </div>
                    <div className="row mb-2">
                      <label className="col-sm-2 col-form-label">Format</label>
                      <div className="col-sm-10">
                        <select
                          className="form-select"
                          onChange={(event) => {
                            this.onFieldChange(event, "format");
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
                            const { fields } = this.state;
                            const newFields = { ...fields };
                            newFields["region"] = data;
                            this.setState({
                              fields: newFields,
                            });
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
                            this.onFieldChange(event, "region");
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
                        <Select
                          mode="multiple"
                          placeholder="Please select country"
                          value={fields["country"]}
                          onChange={(data) => {
                            const { fields } = this.state;
                            const newFields = { ...fields };
                            newFields["country"] = data;
                            this.setState({
                              fields: newFields,
                            });
                          }}
                          style={{ width: "100%" }}
                        >
                          {this.state.countryData &&
                            this.state.countryData.map((data) => (
                              <Option key={data.value}>{data.label}</Option>
                            ))}
                        </Select>
                        {/* <select
                          className="form-select"
                          onChange={(event) => {
                            this.onFieldChange(event, "country");
                          }}
                          defaultValue={fields.country}
                          value={fields.country}
                        >
                          <option selected disabled>
                            Select Country
                          </option>
                          {this.state.countryData &&
                            this.state.countryData.map((data) => (
                              <option value={data.value}>{data.label}</option>
                            ))}
                        </select> */}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <label className="col-sm-2 col-form-label">
                        Published Year
                      </label>
                      <div className="col-sm-10">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g 2022"
                          value={fields.published_year}
                          onChange={(event) =>
                            this.onFieldChange(event, "published_year")
                          }
                          min={0}
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <div className="row mb-2">
                      <label className="col-sm-2 col-form-label">
                        Report file
                      </label>
                      <div className="col-sm-10">
                        <input
                          type="file"
                          className="form-control"
                          placeholder="pdf or png"
                          accept=".pdf,.png"
                          onChange={(event) => this.onUpload(event)}
                        />
                        {this.state.uploadedFileName && (
                          <label className="col-sm-12 col-form-label">
                            {this.state.uploadedFileName}
                          </label>
                        )}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <label className="col-sm-2 col-form-label">Status</label>
                      <div className="col-sm-10">
                        <select
                          className="form-select"
                          onChange={(event) => {
                            this.onFieldChange(event, "status");
                          }}
                          defaultValue={fields.status}
                          value={fields.status}
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
                          onChange={(event) =>
                            this.onFieldChange(event, "short_description")
                          }
                        />
                      </div>
                    </div>
                    <div className="row justify-content-end">
                      <div className="col-sm-12 text-center">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => this.onNewReport()}
                        >
                          <i className="far fa-check-circle me-2" />
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* / Content */}
        <div className="content-backdrop fade" />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loginFlag: state.auth.loginFlag,
});

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CreateReport));
