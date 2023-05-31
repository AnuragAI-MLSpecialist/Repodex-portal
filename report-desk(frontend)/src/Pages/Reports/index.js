import React, { useEffect, useState, useMemo } from "react";
import { CloseOutlined } from "@ant-design/icons";
import withProvider from "../../hoc/WithProvider";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { DatePicker, Select } from "antd";
import MyReports from "./myReports";
import { getMyReportList, setCategories } from "../../actions/reportList";
import SearchBar from "../../components/searchBar";
import { categoryList } from "../../Graphs/Auth/categoryList";
import { searchByCategory } from "../../Graphs/Auth/reportList";
import { searchHistory } from "../../Graphs/Auth/searchHistory";
import moment from "moment";
import countryList from "react-select-country-list";

const Index = (props) => {
  const paginationData = {
    skip: 0,
    limit: 4,
    category_Id: "",
    subCategory_Id: "",
    published_Year: null,
    category_Name: "",
    subCategory_Name: "",
    country: undefined,
    region: undefined,
    type: undefined,
    name: undefined,
  };

  const location = useLocation();
  const dispatch = useDispatch();
  const { Option } = Select;

  const [subCatData, setSubCatData] = useState([]);
  const [searchPaginationRequest, setSearchPaginationRequest] =
    useState(paginationData);

  const options = useMemo(() => countryList().getData(), []);

  const reportFormatPdf = useSelector(
    (state) => state.categoryList?.categoryList
  );

  const reportListData = useSelector(
    (state) => state?.reportListData?.reportList?.data
  );
  const SubCatData = useSelector(
    (state) => state?.reportListData?.subCategoryData?.subCat
  );

  useEffect(() => {
    let tempParams = { ...searchPaginationRequest };

    if (location?.state?.type === "Category") {
      tempParams = {
        ...tempParams,
        category_Id: location?.state?.key,
      };
      getSubCategories(location?.state?.key);
    } else if (location?.state?.type === "Sub_Category") {
      tempParams = {
        ...tempParams,
        subCategory_Id: location?.state?.key,
      };
    } else if (location?.state?.report_name) {
      tempParams = {
        ...tempParams,
        name: location?.state?.report_name,
      };
    }
    setSearchPaginationRequest(tempParams);
    getReportList(tempParams);

    getCategories({ ...paginationData, skip: 0, limit: 10000 });

    return () => {
      const stateCopy = { ...location?.state };
      delete stateCopy.report_name;
      props.history.replace({ state: stateCopy });
    };
  }, [location?.state?.type]);

  const onChange = (date, dateString) => {
    const tempSearchPublishYear = {
      ...searchPaginationRequest,
      published_Year: dateString,
    };
    setSearchPaginationRequest(tempSearchPublishYear);
    getReportList({ ...tempSearchPublishYear, skip: 0, limit: 4 });
  };

  const loadMoreList = () => {
    let newSearchPaginationRequest = {
      ...searchPaginationRequest,
      skip: searchPaginationRequest.skip + 4,
    };
    // newSearchPaginationRequest.skip = searchPaginationRequest.skip + 4;
    // newSearchPaginationRequest.limit = searchPaginationRequest.limit;
    setSearchPaginationRequest((oldData) => newSearchPaginationRequest);
    //call respected service to get the data start
    getReportList(newSearchPaginationRequest, true);
    //call respected service to get the data end
  };

  const getReportList = (searchPagination, hasMore = false) => {
    dispatch(getMyReportList(searchPagination, hasMore));
  };

  const getCategories = async (value) => {
    await categoryList(value)
      .then((res) => {
        dispatch(setCategories(res.categoryList.docs));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSubCategories = async (value) => {
    await searchByCategory(value)
      .then((res) => {
        setSubCatData(res.categoryList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const setSearchHistory = async (value) => {
    await searchHistory(value)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCategory = (e) => {
    const tempSearchPagination = {
      ...searchPaginationRequest,
      category_Id: e.target.value,
      category_Name: e.target.name,
    };

    setSearchPaginationRequest(tempSearchPagination);
    getReportList({ ...tempSearchPagination, skip: 0, limit: 4 });
    getSubCategories(e.target.value);
    if (e?.target?.name) {
      setSearchHistory(e.target.name);
    }
  };

  const handleSubcategory = (e) => {
    const tempSearchSubCategory = {
      ...searchPaginationRequest,
      subCategory_Id: e.target.value,
      subCategory_Name: e.target.name,
    };
    setSearchPaginationRequest(tempSearchSubCategory);
    getReportList({ ...tempSearchSubCategory, skip: 0, limit: 4 });
    if (e?.target?.name) {
      setSearchHistory(e.target.name);
    }
  };

  const handleSubmit = () => {
    getReportList({ ...searchPaginationRequest, skip: 0, limit: 4 });
    if (searchPaginationRequest.category_Name) {
      setSearchHistory(searchPaginationRequest?.category_Name);
    }

    if (searchPaginationRequest.subCategory_Name) {
      setSearchHistory(searchPaginationRequest?.subCategory_Name);
    }
  };

  const handleSelectedCountry = (value) => {
    const tempSearchPublishYear = {
      ...searchPaginationRequest,
      country: value,
    };
    setSearchPaginationRequest(tempSearchPublishYear);
    getReportList({ ...tempSearchPublishYear, skip: 0, limit: 4 });
  };

  const handleSelectedRegion = (value) => {
    const tempSearchPublishYear = {
      ...searchPaginationRequest,
      region: value,
    };
    setSearchPaginationRequest(tempSearchPublishYear);
    getReportList({ ...tempSearchPublishYear, skip: 0, limit: 4 });
  };

  const handleSelectedType = (value) => {
    const tempSearchPublishYear = {
      ...searchPaginationRequest,
      type: value,
    };
    setSearchPaginationRequest(tempSearchPublishYear);
    getReportList({ ...tempSearchPublishYear, skip: 0, limit: 4 });
  };

  const handleCancel = () => {
    if (
      searchPaginationRequest.category_Id ||
      searchPaginationRequest.subCategory_Id ||
      searchPaginationRequest.published_Year ||
      searchPaginationRequest.country ||
      searchPaginationRequest.region ||
      searchPaginationRequest.type
    ) {
      setSearchPaginationRequest(paginationData);
      getReportList(paginationData);
      setSubCatData([]);
    }
  };

  return (
    <div>
      <section className="position-relative rd_report_banner section_pad">
        <div className="rd_home_banner_inn">
          <div className="container">
            <div className="row d-flex justify-content-center">
              <div className="col col-md-8 col-12 d-flex align-items-center">
                <SearchBar moduleName="ReportList" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Reports --> */}
      <section className="position-relative reports_list section_pad bg_light_blue">
        <div className="container">
          <div className="row">
            <div className="col col-lg-4 col-12">
              <div className="position-relative reports_list_filter shadow-sm bg-white p-3 mb-3">
                <div className="row m-0">
                  <div className="col col-lg-12 col-md-6 col-12">
                    <div className="position-relative mb-3 mb-md-0 mb-lg-3">
                      <h5>
                        <svg
                          className="me-2 feather feather-list"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="8" y1="6" x2="21" y2="6"></line>
                          <line x1="8" y1="12" x2="21" y2="12"></line>
                          <line x1="8" y1="18" x2="21" y2="18"></line>
                          <line x1="3" y1="6" x2="3.01" y2="6"></line>
                          <line x1="3" y1="12" x2="3.01" y2="12"></line>
                          <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                        Categories
                      </h5>
                      <div
                        className="position-relative row m-0 overflow-auto"
                        style={{ height: "130px" }}
                      >
                        {reportFormatPdf.length >= 1 &&
                          reportFormatPdf
                            .filter((item) => !item?.category_id)
                            .map((item) => {
                              return (
                                <div className="form-check col col-lg-12 col-md-6 col-12">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    value={item._id}
                                    name={item.name}
                                    id="flexRadioDefault1"
                                    onChange={(e) => handleCategory(e)}
                                    checked={
                                      item._id ===
                                      searchPaginationRequest?.category_Id
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    for="flexRadioDefault1"
                                  >
                                    {item.name}
                                  </label>
                                </div>
                              );
                            })}
                      </div>
                    </div>
                  </div>
                  <div className="col col-lg-12 col-md-6 col-12">
                    <div className="position-relative mb-3 mb-md-0 mb-lg-3">
                      <h5>
                        <svg
                          className="me-2 feather feather-list"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="8" y1="6" x2="21" y2="6"></line>
                          <line x1="8" y1="12" x2="21" y2="12"></line>
                          <line x1="8" y1="18" x2="21" y2="18"></line>
                          <line x1="3" y1="6" x2="3.01" y2="6"></line>
                          <line x1="3" y1="12" x2="3.01" y2="12"></line>
                          <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                        Sub Categories
                      </h5>
                      {subCatData.length >= 1 ? (
                        subCatData.map((item) => {
                          return (
                            <div
                              className="position-relative row m-0 overflow-auto"
                              style={{ height: "auto" }}
                            >
                              <div className="form-check col col-lg-12 col-md-6 col-12">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  value={item._id}
                                  name={item.name}
                                  id="flexRadioDefault2"
                                  onChange={(e) => handleSubcategory(e)}
                                  checked={
                                    item._id ===
                                    searchPaginationRequest?.subCategory_Id
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  for="flexRadioDefault2"
                                >
                                  {item.name}
                                </label>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div
                          className="position-relative row m-0 overflow-auto"
                          style={{ height: "auto" }}
                        >
                          <label>{"No Data found!"}</label>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col col-lg-12 col-md-6 col-12">
                    <div className="position-relative mb-3">
                      <h5>
                        <svg
                          className="me-2 feather feather-calendar"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          ></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Published Year
                      </h5>
                      <div className="position-relative">
                        <div className="input-group align-items-center">
                          <DatePicker
                            value={
                              searchPaginationRequest?.published_Year
                                ? moment(
                                    searchPaginationRequest.published_Year,
                                    "YYYY"
                                  )
                                : null
                            }
                            onChange={onChange}
                            picker="year"
                            className="w-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col col-lg-12 col-md-6 col-12">
                    <div className="position-relative mb-3">
                      <h5>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="me-2 feather feather-globe"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="2" y1="12" x2="22" y2="12"></line>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        Country
                      </h5>
                      <Select
                        allowClear
                        showSearch
                        id="selected_country"
                        // value={options}
                        style={{
                          width: "100%",
                        }}
                        onChange={(value) => handleSelectedCountry(value)}
                        value={searchPaginationRequest?.country}
                        placeholder="Select Country"
                        options={options}
                        optionFilterProp="children"
                        // onBlur={handleBlur}
                        filterOption={(input, option) =>
                          option.props?.value
                            ?.toLowerCase()
                            ?.indexOf(input?.toLowerCase()) >= 0 ||
                          option.props?.label
                            ?.toLowerCase()
                            ?.indexOf(input?.toLowerCase()) >= 0
                        }
                      ></Select>
                    </div>
                  </div>
                  <div className="col col-lg-12 col-md-6 col-12">
                    <div className="position-relative mb-3">
                      <h5>
                        <svg
                          className="me-2 feather feather-map"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
                          <line x1="8" y1="2" x2="8" y2="18"></line>
                          <line x1="16" y1="6" x2="16" y2="22"></line>
                        </svg>
                        Region
                      </h5>
                      <Select
                        allowClear
                        showSearch
                        id="selected_region"
                        // value={options}
                        style={{
                          width: "100%",
                        }}
                        onChange={(value) => handleSelectedRegion(value)}
                        placeholder="Select Region"
                        value={searchPaginationRequest?.region}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.value
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option key={1} value={"Global"}>
                          Global
                        </Option>
                        <Option key={2} value={"Europe"}>
                          Europe
                        </Option>
                        <Option key={3} value={"North America"}>
                          North America
                        </Option>
                        <Option key={4} value={"Middle East"}>
                          Middle East
                        </Option>
                        <Option key={5} value={"APAC"}>
                          APAC
                        </Option>
                      </Select>
                    </div>
                  </div>
                  <div className="col col-lg-12 col-md-6 col-12">
                    <div className="position-relative mb-3">
                      <h5>
                        <svg
                          className="me-2 feather feather-file"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                          <polyline points="13 2 13 9 20 9"></polyline>
                        </svg>
                        Type
                      </h5>
                      <Select
                        allowClear
                        showSearch
                        id="selected_type"
                        // value={options}
                        style={{
                          width: "100%",
                        }}
                        onChange={(value) => handleSelectedType(value)}
                        placeholder="Select Type"
                        value={searchPaginationRequest?.type}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          option.props.value
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option key={1} value="Whitepaper">
                          Whitepaper
                        </Option>
                        <Option key={2} value="Research Report">
                          Research Report
                        </Option>
                        <Option key={3} value="Research Paper">
                          Research Paper
                        </Option>
                        <Option key={4} value="Infographic">
                          Infographic
                        </Option>
                        <Option key={5} value="Press Release">
                          Press Release
                        </Option>
                        <Option key={6} value="Survey">
                          Survey
                        </Option>
                      </Select>
                    </div>
                  </div>
                  <div className="col col-lg-12 col-md-6 col-12">
                    <div className="position-relative mb-3">
                      <div className="row">
                        {/* <div className="col col-md-6">
                          <button
                            type="submit"
                            className="btn btn-custom2 auth_form_btn d-flex flex-row align-items-center"
                            onClick={handleSubmit}
                          >
                            <SearchOutlined className="p-1" />
                            Search
                          </button>
                        </div> */}
                        <div className="col col-md-6">
                          <button
                            type="submit"
                            className="btn btn-custom2 auth_form_btn d-flex flex-row align-items-center"
                            onClick={handleCancel}
                          >
                            <CloseOutlined className="p-1" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col col-lg-8 col-12">
              <div className="position-relative">
                {reportListData &&
                reportListData.docs &&
                reportListData.docs.length >= 1 ? (
                  <MyReports
                    reportData={reportListData}
                    loadMoreList={loadMoreList}
                  />
                ) : (
                  <div class="position-relative reports_list_filter shadow-sm bg-white p-3 mb-3">
                    <label>{"No Result found"}</label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default withProvider(Index);
