import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { notification, Popconfirm, Spin, Table, Tooltip } from "antd";
import CustomLoader from "../../components/Common/CustomLoader";
import {
  changeActiveStatus,
  createCategory,
  deleteCategory,
  editCategory,
  getCategoryList,
} from "../../Graphs/Category";
import { EditCategory } from "./editCategory";

class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      categoryData: [],
      categoryDataTotal: 0,
      searchText: "",
      pagination: {
        pageSize: 10,
        current: 1,
      },
      categoryName: "",
      activeStatus: 1,
      tegoryEditData: null,
      startIndex: 0,
      limitNumber: 10,
    };
  }

  componentDidMount = async () => {
    try {
      await this.listCategoryData(0, 10);
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
      title: "Category Name",
      key: "Category Name",
      render: (text, item, index) => {
        return <div>{item.name ? item.name : "-"}</div>;
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
                  this.deleteCategory(item._id);
                }}
                title="Are you sure you want to delete this category?"
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

  handleTableChange = (pagination, filters) => {
    this.setState(
      {
        pagination,
      },
      () => this.getListCategoryData(pagination)
    );
  };

  getListCategoryData = async (pagination) => {
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
          this.listSearchCategoryData(start, end);
        } else {
          this.listCategoryData(start, end);
        }
      }
    );
  };

  listCategoryData = async (start, end) => {
    try {
      this.setState({
        isLoading: true,
      });
      const {
        categoryList: { docs, totalDocs },
      } = await getCategoryList(start, end);
      this.setState({
        categoryData: docs,
        categoryDataTotal: totalDocs,
        isLoading: false,
      });
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    }
  };

  listSearchCategoryData = async (start, end) => {
    try {
      const { searchText } = this.state;
      this.setState({
        isLoading: true,
      });
      const {
        categoryList: { docs, totalDocs },
      } = await getCategoryList(start, end, searchText);
      this.setState({
        categoryData: docs,
        categoryDataTotal: totalDocs,
        isLoading: false,
      });
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    }
  };

  newCategory = async () => {
    try {
      const {
        categoryName,
        activeStatus,
        searchText,
        startIndex,
        limitNumber,
      } = this.state;

      if (!categoryName) {
        notification["error"]({
          message: "Category",
          description: "Category name required",
        });

        return;
      }

      this.setState({
        isLoading: true,
      });

      await createCategory(categoryName, activeStatus === 1);
      notification["success"]({
        message: "Category",
        description: "Category added successfully",
      });
      if (searchText && searchText !== "") {
        this.listSearchCategoryData(startIndex, limitNumber);
      } else {
        this.listCategoryData(startIndex, limitNumber);
      }
    } catch (e) {
    } finally {
      this.setState({
        isLoading: false,
        categoryName: "",
      });
    }
  };

  changeStatus = async (categoryId, status) => {
    try {
      const { searchText, startIndex, limitNumber } = this.state;
      this.setState({
        isLoading: true,
      });
      await changeActiveStatus(categoryId, status);
      notification["success"]({
        message: "Category",
        description: "Category status changed successfully",
      });
      if (searchText && searchText !== "") {
        this.listSearchCategoryData(startIndex, limitNumber);
      } else {
        this.listCategoryData(startIndex, limitNumber);
      }
    } catch (e) {
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  deleteCategory = async (categoryId) => {
    try {
      const { searchText, startIndex, limitNumber } = this.state;
      this.setState({
        isLoading: true,
      });
      await deleteCategory(categoryId);
      notification["success"]({
        message: "Category",
        description: "Category deleted successfully",
      });
      if (searchText && searchText !== "") {
        this.listSearchCategoryData(startIndex, limitNumber);
      } else {
        this.listCategoryData(startIndex, limitNumber);
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
      categoryEditData: categoryData,
    });
  };

  closeEditModal = () => {
    this.setState({
      categoryEditData: null,
    });
  };

  onEditSubmit = async (values) => {
    try {
      const { searchText, startIndex, limitNumber } = this.state;
      this.setState({
        isLoading: true,
      });
      await editCategory(values);
      notification["success"]({
        message: "Category",
        description: "Category edited successfully",
      });
      if (searchText && searchText !== "") {
        this.listSearchCategoryData(startIndex, limitNumber);
      } else {
        this.listCategoryData(startIndex, limitNumber);
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
        this.getListCategoryData(this.state.pagination);
      }
    );
  };

  render() {
    const {
      isLoading,
      categoryData,
      categoryDataTotal,
      activeStatus,
      categoryEditData,
    } = this.state;

    return (
      <div className="content-wrapper">
        {/* Content */}
        <div className="container-xxl flex-grow-1 container-p-y">
          {/* Basic Bootstrap Table */}
          <div className="card py-3">
            <div className="mb-3 pb-3 border-bottom">
              <div className="row m-0">
                <div className="col-md-5 col-12">
                  <div className="row">
                    <label
                      className="col-sm-3 col-form-label pe-0"
                      htmlFor="basic-default-name"
                    >
                      Category Name
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        id="basic-default-name"
                        placeholder="e.g. Automotive"
                        value={this.state.categoryName}
                        onChange={(event) =>
                          this.setState({ categoryName: event.target.value })
                        }
                        required={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-5 col-12 res_mb_2">
                  <div className="row">
                    <label
                      className="col-sm-2 col-form-label"
                      htmlFor="basic-default-name"
                    >
                      Status
                    </label>
                    <div className="col-sm-10">
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
                </div>
                <div className="col-md-2 col-12">
                  <div className="row justify-content-end">
                    <div className="col-sm-10">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => this.newCategory()}
                      >
                        <i className="far fa-check-circle me-2" />
                        Save
                      </button>
                    </div>
                  </div>
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
                    placeholder="Search Category"
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
                  dataSource={categoryData}
                  pagination={{
                    total: categoryDataTotal,
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
              {categoryEditData && (
                <EditCategory
                  onClose={() => this.closeEditModal()}
                  categoryData={categoryEditData}
                  onSubmit={(values) => this.onEditSubmit(values)}
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
)(withRouter(CategoryList));
