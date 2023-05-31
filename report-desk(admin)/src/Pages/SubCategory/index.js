import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { notification, Popconfirm, Spin, Table, Tooltip } from "antd";
import CustomLoader from "../../components/Common/CustomLoader";
import {
  changeActiveStatus,
  createSubCategory,
  deleteSubCategory,
  editSubCategory,
  getSubCategoryList,
} from "../../Graphs/SubCategory";
import { getAllCategoryList } from "../../Graphs/Category";
import { EditSubCategory } from "./editSubCategory";

class SubCategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      subCategoryData: [],
      subCategoryDataTotal: 0,
      searchText: "",
      pagination: {
        pageSize: 10,
        current: 1,
      },
      categoryName: "",
      selectedCategoryId: null,
      activeStatus: 1,
      subCategoryEditData: null,
      startIndex: 0,
      limitNumber: 10,
      categoryOptions: [],
    };
  }

  componentDidMount = async () => {
    try {
      await this.listSubCategoryData(0, 10);
      await this.listAllCategoryData();
    } catch (e) {}
  };

  counter = 0;
  tempCounter = 0;
  columns = [
    {
      title: "Sr. No.",
      key: "serial_number",
      fixed: window.innerWidth < 768 ? false : true,
      width: 80,
      render: (text, item, index) => {
        return (
          <div>
            <span>{++index + this.tempCounter}</span>
          </div>
        );
      },
    },
    {
      title: "Sub Category Name",
      key: "Sub Category Name",
      render: (text, item, index) => {
        return <div>{item.name ? item.name : "-"}</div>;
      },
    },
    {
      title: "Category Name",
      key: "Category Name",
      render: (text, item, index) => {
        return (
          <div>
            {item.category_id && item.category_id.name
              ? item.category_id.name
              : "-"}
          </div>
        );
      },
    },
    {
      title: "Status",
      key: "Status",
      render: (text, item, index) => {
        return (
          <div>
            {item.is_active ? (
              <span className="badge bg-label-primary me-1">Active</span>
            ) : (
              <span className="badge bg-label-danger me-1">Deactivate</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "Action",
      render: (text, item, index) => {
        return (
          <div style={{ display: "inline-block", width: "100%" }}>
            <Tooltip title={"Edit"}>
              <div
                style={{ float: "left", cursor: "pointer", marginRight: "5px" }}
                onClick={() => this.showEditModal(item)}
              >
                <i className="far fa-edit text-primary"></i>
              </div>
            </Tooltip>

            {item.is_active ? (
              <Tooltip title={"Deactivate"}>
                <div
                  style={{
                    float: "left",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                  onClick={() => this.changeStatus(item._id, false)}
                >
                  <i className="fas fa-ban text-warning"></i>
                </div>
              </Tooltip>
            ) : (
              <Tooltip title={"Activate"}>
                <div
                  style={{
                    float: "left",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                  onClick={() => this.changeStatus(item._id, true)}
                >
                  <i className="far fa-check-circle text-primary"></i>
                </div>
              </Tooltip>
            )}

            <Tooltip title={"Delete"}>
              <Popconfirm
                onConfirm={() => {
                  this.deleteSubCategory(item._id);
                }}
                title="Are you sure you want to delete this sub category?"
              >
                <div
                  style={{
                    float: "left",
                    cursor: "pointer",
                    marginRight: "5px",
                  }}
                >
                  <i className="fa-regular fa-trash-can text-danger"></i>
                </div>
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  listAllCategoryData = async () => {
    try {
      const { categoryList } = await getAllCategoryList();
      const activeCategory = categoryList.filter((data) => data.is_active);
      this.setState({
        categoryOptions: activeCategory,
      });
    } catch (e) {}
  };

  handleTableChange = (pagination, filters) => {
    this.setState(
      {
        pagination,
      },
      () => this.getListSubCategoryData(pagination)
    );
  };

  getListSubCategoryData = async (pagination) => {
    const { searchText } = this.state;
    const start =
      pagination.current * pagination.pageSize - pagination.pageSize;
    const end = pagination.pageSize;

    this.setState(
      {
        isLoading: true,
        startIndex: start,
        limitNumber: end,
      },
      async () => {
        if (searchText && searchText !== "") {
          this.listSearchSubCategoryData(start, end);
        } else {
          this.listSubCategoryData(start, end);
        }
      }
    );
  };

  listSubCategoryData = async (start, end) => {
    try {
      this.setState({
        isLoading: true,
      });
      const {
        categoryList: { docs, totalDocs },
      } = await getSubCategoryList(start, end);
      this.setState({
        subCategoryData: docs,
        subCategoryDataTotal: totalDocs,
        isLoading: false,
      });
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    }
  };

  listSearchSubCategoryData = async (start, end) => {
    try {
      const { searchText } = this.state;
      this.setState({
        isLoading: true,
      });
      const {
        categoryList: { docs, totalDocs },
      } = await getSubCategoryList(start, end, searchText);
      this.setState({
        subCategoryData: docs,
        subCategoryDataTotal: totalDocs,
        isLoading: false,
      });
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    }
  };

  newSubCategory = async () => {
    try {
      const {
        categoryName,
        activeStatus,
        searchText,
        startIndex,
        limitNumber,
        selectedCategoryId,
      } = this.state;

      if (!selectedCategoryId) {
        notification["success"]({
          message: "Sub Category",
          description: "Please select category first",
        });

        return;
      }

      if (!categoryName) {
        notification["error"]({
          message: "Sub Category",
          description: "Category name required",
        });

        return;
      }

      this.setState({
        isLoading: true,
      });
      await createSubCategory(
        categoryName,
        activeStatus === 1,
        selectedCategoryId
      );
      notification["success"]({
        message: "Sub Category",
        description: "Sub Category added successfully",
      });

      if (searchText && searchText !== "") {
        this.listSearchSubCategoryData(startIndex, limitNumber);
      } else {
        this.listSubCategoryData(startIndex, limitNumber);
      }
    } catch (e) {
    } finally {
      this.setState({
        isLoading: false,
        categoryName: "",
        selectedCategoryId: "",
      });
    }
  };

  changeStatus = async (subCategoryId, status) => {
    try {
      const { searchText, startIndex, limitNumber } = this.state;
      this.setState({
        isLoading: true,
      });
      await changeActiveStatus(subCategoryId, status);
      notification["success"]({
        message: "Sub Category",
        description: "Sub Category status changed successfully",
      });
      if (searchText && searchText !== "") {
        this.listSearchSubCategoryData(startIndex, limitNumber);
      } else {
        this.listSubCategoryData(startIndex, limitNumber);
      }
    } catch (e) {
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  deleteSubCategory = async (subCategoryId) => {
    try {
      const { searchText, startIndex, limitNumber } = this.state;
      this.setState({
        isLoading: true,
      });
      await deleteSubCategory(subCategoryId);
      notification["success"]({
        message: "Sub Category",
        description: "Sub Category deleted successfully",
      });
      if (searchText && searchText !== "") {
        this.listSearchSubCategoryData(startIndex, limitNumber);
      } else {
        this.listSubCategoryData(startIndex, limitNumber);
      }
    } catch (e) {
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  showEditModal = (categoryData) => {
    this.setState({
      subCategoryEditData: categoryData,
    });
  };

  closeEditModal = () => {
    this.setState({
      subCategoryEditData: null,
    });
  };

  onEditSubmit = async (values) => {
    try {
      const { searchText, startIndex, limitNumber } = this.state;
      this.setState({
        isLoading: true,
      });
      await editSubCategory(values);
      notification["success"]({
        message: "Sub Category",
        description: "Sub Category edited successfully",
      });
      if (searchText && searchText !== "") {
        this.listSearchSubCategoryData(startIndex, limitNumber);
      } else {
        this.listSubCategoryData(startIndex, limitNumber);
      }
    } catch (e) {
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  onSearchChange = (e) => {
    this.setState(
      {
        searchText: e.target.value,
      },
      () => {
        this.getListSubCategoryData(this.state.pagination);
      }
    );
  };

  render() {
    const {
      isLoading,
      subCategoryData,
      subCategoryDataTotal,
      activeStatus,
      subCategoryEditData,
      categoryOptions,
    } = this.state;

    return (
      <div className="content-wrapper">
        {/* Content */}
        <div className="container-xxl flex-grow-1 container-p-y">
          {/* Basic Bootstrap Table */}
          <div className="card py-3">
            <div className="mb-3 pb-3 border-bottom">
              <div className="row m-0">
                <div className="col-md-4 col-12">
                  <label
                    className="col-form-label pe-0"
                    for="basic-default-name"
                  >
                    Category Name
                  </label>
                  <select
                    className="form-select"
                    onChange={(event) => {
                      this.setState({ selectedCategoryId: event.target.value });
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
                        return <option value={data._id}>{data.name}</option>;
                      })}
                  </select>
                </div>
                <div className="col-md-4 col-12">
                  <label
                    className="col-form-label pe-0"
                    htmlFor="basic-default-name"
                  >
                    Sub Category Name
                  </label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control"
                      id="basic-default-name"
                      value={this.state.categoryName}
                      placeholder="e.g. Automotive"
                      onChange={(event) =>
                        this.setState({ categoryName: event.target.value })
                      }
                      required={true}
                    />
                  </div>
                </div>
                <div className="col-md-2 col-12 res_mb_2">
                  <label
                    className="col-form-label"
                    htmlFor="basic-default-name"
                  >
                    Status
                  </label>
                  <div className="">
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={(event) => {
                        this.setState({ activeStatus: event.target.value });
                      }}
                      defaultValue={activeStatus}
                      required={true}
                    >
                      <option selected value={1}>
                        Active
                      </option>
                      <option value={0}>Deactivate</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-2 col-12 d-flex align-items-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => this.newSubCategory()}
                  >
                    <i className="far fa-check-circle me-2"></i>Save
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-5 col-12 pb-3">
              <div className="row">
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    id="basic-default-name"
                    placeholder="Search Sub Category"
                    value={this.state.searchText}
                    onChange={(event) => this.onSearchChange(event)}
                    required={true}
                  />
                </div>
              </div>
            </div>

            <div className="table-responsive">
              {isLoading ? (
                <div
                  style={{
                    display: "inline-block",
                    width: "100%",
                    margin: "0 auto",
                    textAlign: "center",
                  }}
                >
                  <Spin />
                </div>
              ) : (
                <Table
                  loading={isLoading}
                  columns={this.columns}
                  rowKey={(record) => record._id}
                  size={"small"}
                  dataSource={subCategoryData}
                  pagination={{
                    total: subCategoryDataTotal,
                    showSizeChanger: true,
                    pageSize: this.state.pagination.pageSize,
                    current: this.state.pagination.current,
                    pageSizeOptions: ["1", "10", "25", "50", "100"],
                    onChange: (e) => {
                      {
                        if (e - 1) {
                          this.counter = this.tempCounter =
                            (e - 1) * this.state.pagination.pageSize;
                          return;
                        }
                        this.counter = 0;
                        this.tempCounter = 0;
                      }
                    },
                  }}
                  onChange={this.handleTableChange}
                />
              )}
              {subCategoryEditData && (
                <EditSubCategory
                  onClose={() => this.closeEditModal()}
                  categoryData={subCategoryEditData}
                  onSubmit={(values) => this.onEditSubmit(values)}
                  categoryOptions={categoryOptions}
                />
              )}
            </div>
          </div>
          {/* / Content */}
          <div className="content-backdrop fade" />
        </div>
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
)(withRouter(SubCategoryList));
