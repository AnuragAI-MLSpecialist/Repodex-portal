import React, { Component } from "react";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { notification, Popconfirm, Spin, Table, Tooltip } from "antd";
import {
  changeActiveStatus,
  createReport,
  deleteReport,
  editReport,
  getReportList,
} from "../../Graphs/Report";
import { EditReport } from "./editReport";
import countryList from "react-select-country-list";

class ReportList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      reportData: [],
      reportDataTotal: 0,
      searchText: "",
      pagination: {
        pageSize: 10,
        current: 1,
      },
      reportEditData: null,
      startIndex: 0,
      limitNumber: 10,
    };
  }

  componentDidMount = async () => {
    try {
      await this.listReportData(0, 10);
      this.setState({
        countryData: countryList().getData(),
      });
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
      title: "Report Name",
      key: "Report Name",
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
      title: "Sub Category Name",
      key: "Sub Category Name",
      render: (text, item, index) => {
        return (
          <div>
            {item.sub_category_id && item.sub_category_id.name
              ? item.sub_category_id.name
              : "-"}
          </div>
        );
      },
    },
    {
      title: "Type",
      key: "Type",
      render: (text, item, index) => {
        return <div>{item.type ? item.type : "-"}</div>;
      },
    },
    {
      title: "Format",
      key: "Format",
      render: (text, item, index) => {
        return <div>{item.format ? item.format : "-"}</div>;
      },
    },
    {
      title: "Region",
      key: "Region",
      render: (text, item, index) => {
        let reginString = "";
        if (item.regions) {
          item.regions.map((regionItem, index) => {
            if (regionItem.region) {
              if (index === item.regions.length - 1) {
                reginString = reginString + regionItem.region;
              } else {
                reginString = reginString + regionItem.region + ", ";
              }
            }
          });
        }
        return <div>{reginString ? reginString : "-"}</div>;
      },
    },
    {
      title: "Country",
      key: "Country",
      render: (text, item, index) => {
        let countryString = "";
        if (item.countries && this.state.countryData) {
          item.countries.map((countryItem, index) => {
            const countryName =
              this.state.countryData.filter(
                (dataItem) => dataItem.value === countryItem.country
              ).length > 0
                ? this.state.countryData.filter(
                    (dataItem) => dataItem.value === countryItem.country
                  )[0]["label"]
                : "";
            if (countryName) {
              if (index === item.countries.length - 1) {
                countryString = countryString + countryName;
              } else {
                countryString = countryString + countryName + ", ";
              }
            }
          });
        }
        return <div>{countryString ? countryString : "-"}</div>;
      },
    },
    {
      title: "Published Year",
      key: "Published Year",
      render: (text, item, index) => {
        return <div>{item.published_year ? item.published_year : "-"}</div>;
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
                  this.deleteReport(item._id);
                }}
                title="Are you sure you want to delete this report?"
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
      () => this.getListReportData(pagination)
    );
  };

  getListReportData = async (pagination) => {
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
          this.listSearchReportData(start, end);
        } else {
          this.listReportData(start, end);
        }
      }
    );
  };

  listReportData = async (start, end) => {
    try {
      this.setState({
        isLoading: true,
      });
      const {
        listReportData: { docs, totalDocs },
      } = await getReportList(start, end);
      this.setState({
        reportData: docs,
        reportDataTotal: totalDocs,
        isLoading: false,
      });
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    }
  };

  listSearchReportData = async (start, end) => {
    try {
      const { searchText } = this.state;
      this.setState({
        isLoading: true,
      });
      const {
        listReportData: { docs, totalDocs },
      } = await getReportList(start, end, searchText);
      this.setState({
        reportData: docs,
        reportDataTotal: totalDocs,
        isLoading: false,
      });
    } catch (e) {
      this.setState({
        isLoading: false,
      });
    }
  };

  changeStatus = async (reportId, status) => {
    try {
      const { searchText, startIndex, limitNumber } = this.state;
      this.setState({
        isLoading: true,
      });
      await changeActiveStatus(reportId, status);
      notification["success"]({
        message: "Report",
        description: "Report status changed successfully",
      });
      if (searchText && searchText !== "") {
        this.listSearchReportData(startIndex, limitNumber);
      } else {
        this.listReportData(startIndex, limitNumber);
      }
    } catch (e) {
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  deleteReport = async (reportId) => {
    try {
      const { searchText, startIndex, limitNumber } = this.state;
      this.setState({
        isLoading: true,
      });
      await deleteReport(reportId);
      notification["success"]({
        message: "Report",
        description: "Report deleted successfully",
      });
      if (searchText && searchText !== "") {
        this.listSearchReportData(startIndex, limitNumber);
      } else {
        this.listReportData(startIndex, limitNumber);
      }
    } catch (e) {
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  showEditModal = (reportData) => {
    this.setState({
      reportEditData: reportData,
    });
  };

  closeEditModal = () => {
    this.setState({
      reportEditData: null,
    });
  };

  onEditSubmit = async (values, reportId) => {
    try {
      const { searchText, startIndex, limitNumber } = this.state;
      this.setState({
        isLoading: true,
      });
      await editReport(values, reportId);
      notification["success"]({
        message: "Report",
        description: "Report edited successfully",
      });
      if (searchText && searchText !== "") {
        this.listSearchReportData(startIndex, limitNumber);
      } else {
        this.listReportData(startIndex, limitNumber);
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
        this.getListReportData(this.state.pagination);
      }
    );
  };

  render() {
    const { isLoading, reportData, reportDataTotal, reportEditData } =
      this.state;

    return (
      <div className="content-wrapper">
        {/* Content */}
        <div className="container-xxl flex-grow-1 container-p-y">
          {/* Basic Bootstrap Table */}
          <div className="card py-3">
            <div className="col-md-5 col-12 pb-3">
              <div className="row">
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    id="basic-default-name"
                    placeholder="Search Report"
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
                  dataSource={reportData}
                  pagination={{
                    total: reportDataTotal,
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
              {reportEditData && (
                <EditReport
                  onClose={() => this.closeEditModal()}
                  reportData={reportEditData}
                  onSubmit={(values, reportId) =>
                    this.onEditSubmit(values, reportId)
                  }
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
)(withRouter(ReportList));
