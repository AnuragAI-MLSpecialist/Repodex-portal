import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AutoComplete, Spin } from "antd";
import Typist from "react-typist";
import debounce from "lodash/debounce";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import {
  setBrowseData,
  setAutocompleteOptions,
  setSearchReportListData,
} from "../actions/reportDeskAction";
import { searchHistory } from "../Graphs/Auth/searchHistory";
import { categoryList } from "../../src/Graphs/Auth/categoryList";
import { homeSearchReportList } from "../Graphs/Auth/searchTypeReportList";
import { getMyReportList } from "../actions/reportList";

const SearchBar = (moduleName) => {
  const categoryLimit = {
    skip: 0,
    limit: 22,
  };
  const reportListLimit = {
    skip: 0,
    limit: 10,
  };
  const MaxLength = 59;
  const [count, setCount] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [autoCompleteData, setAutoCompleteData] = useState([]);

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const browseData = useSelector((state) => state.reportDeskHome.browseData);
  const homeReportsData = useSelector(
    (state) => state.reportDeskHome.homeReportListData
  );

  const highlightClass = "text-primary";

  const autoCompleteOPtions = useSelector(
    (state) => state.reportDeskHome.autoCompleteOptions
  );

  const reportCategory = useSelector((state) => state.reportDeskHome.reportPdf);

  let category = [];

  useEffect(() => {
    getBrowseSector(categoryLimit);
    getHomeReportListData(reportListLimit);
    if (location?.state?.report_name) {
      setSearchValue(location?.state?.report_name);
    }
  }, []);

  useEffect(() => {
    setCount(1);
  }, [count]);

  const removeDiacritics = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const searchReports = async (searchObject) => {
    setFetching(true);
    await homeSearchReportList({ skip: 0, limit: 10000 }, searchObject)
      .then((res) => {
        res &&
          res.categoryList &&
          res.categoryList.docs &&
          res.categoryList.docs
            .filter((item) => item?.is_active)
            .map((item) => {
              const idx = removeDiacritics(item.name)
                .toLowerCase()
                .indexOf(removeDiacritics(searchObject).toLowerCase());
              const hightLightClassName = Array.isArray(highlightClass)
                ? highlightClass.join(" ")
                : typeof highlightClass == "string"
                ? highlightClass
                : "";
              category.push({
                key: item._id,
                label: (
                  <button
                    type="button"
                    className="dropdown-item"
                    data-label={item._id}
                    data-value={item.name}
                  >
                    {item.name.substring(0, idx)}
                    <span className={hightLightClassName}>
                      {item.name.substring(idx, idx + searchObject.length)}
                    </span>
                    {item.name.substring(
                      idx + searchObject.length,
                      item.name.length
                    )}
                  </button>
                ),
                value: item?.name || "",
                type: item?.category_id ? "Sub_Category" : "Category",
              });
            });
        setAutoCompleteData(category);
        dispatch(setAutocompleteOptions(category.length >= 1 ? category : []));
        setFetching(false);
      })
      .catch((err) => {
        setFetching(false);
      });
  };

  const getBrowseSector = async (paginationData) => {
    await categoryList(paginationData)
      .then((res) => {
        dispatch(setBrowseData(res.categoryList.docs));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getHomeReportListData = async (pagination) => {
    await homeSearchReportList(pagination)
      .then((res) => {
        dispatch(setSearchReportListData(res.categoryList.docs));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = (value) => {
    searchReports(value);
  };

  const onSelect = (value, option) => {
    if (option?.key && option?.value) {
      setSearchHistory(option.value);
      history.push(`report-details/${option.key}`);
    }
  };

  const handleOnKeyDown = (event) => {
    if (event?.key === "Enter") {
      setSearchHistory(event.target.value);
      if (moduleName.moduleName === "ReportList") {
        dispatch(
          getMyReportList(
            { skip: 0, limit: 4, name: event.target.value },
            false
          )
        );
      } else {
        history.push({
          pathname: "/reports",
          state: { report_name: event.target.value },
        });
      }
    }
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

  const onSelectBrowseByCategory = (data) => {
    !data.category_id
      ? history.push({
          pathname: "/reports",
          state: { key: data?._id, type: "Category" },
          customData: { key: data?._id, type: "Category" },
        })
      : history.push({
          pathname: "/reports",
          state: { key: data?._id, type: "Sub_Category" },
          customData: { key: data?._id, type: "Sub_Category" },
        });
  };

  const renderSearchBarWithSection = () => {
    return (
      <section
        className={`position-relative rd_home_search ${
          moduleName.moduleName === "ReportList" ? "w-100" : ""
        }`}
      >
        {/* <!-- Search bar --> */}
        <div className="search_bar_out">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col col-12">{renderSearchBar()}</div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderSearchBar = () => {
    return (
      <div
        className={`search-bar ${
          moduleName.moduleName === "ReportList" ? "report-search-bar" : ""
        }`}
      >
        <div className="position-relative mb-3">
          <form className="mb-0" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <span className="input-group-text" id="basic-addon1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-search"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <AutoComplete
                defaultActiveFirstOption={false}
                value={searchValue}
                getPopupContainer={(trigger) => trigger.parentNode}
                style={{ flex: 1 }}
                options={autoCompleteData}
                onSelect={onSelect}
                onChange={(value) => {
                  setSearchValue(value);
                }}
                menuPosition="fixed"
                onSearch={debounce(handleSearch, 300)}
                onKeyDown={handleOnKeyDown}
                placeholder={
                  <h6 className="d-flex">
                    <span>You can type&nbsp;</span>
                    {count && (
                      <Typist
                        avgTypingDelay={50}
                        onTypingDone={() => setCount(0)}
                        className="d-flex"
                      >
                        <Typist.Delay ms={2000} />
                        {homeReportsData &&
                          homeReportsData.length >= 1 &&
                          homeReportsData.map((item, index) => {
                            return (
                              <div key={index} className="d-flex">
                                {moduleName &&
                                moduleName.moduleName === "HomePage" ? (
                                  <h6>{item.name}</h6>
                                ) : item.name.length > MaxLength ? (
                                  <h6>{` ${item.name.substring(0, 58)}...`}</h6>
                                ) : (
                                  <h6>{item.name}</h6>
                                )}
                                {
                                  <Typist.Backspace
                                    count={item?.name?.length || 20}
                                    delay={1000}
                                  />
                                }
                              </div>
                            );
                          })}
                      </Typist>
                    )}
                  </h6>
                }
                notFoundContent={fetching ? <Spin /> : "No result found!!!"}
                bordered={false}
              ></AutoComplete>
            </div>
          </form>
        </div>
        {moduleName && moduleName.moduleName === "HomePage" ? (
          <div className="browse_by_sec">
            <h5>Browse by sector</h5>
            <div className="browse_by_sec_list">
              {browseData
                .filter((item) => !item?.category_id)
                .map((data) => {
                  return (
                    <a
                      href="#"
                      key={data._id}
                      onClick={() => onSelectBrowseByCategory(data)}
                    >
                      <span>{data.name}</span>
                    </a>
                  );
                })}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  return moduleName.moduleName === "ReportList"
    ? renderSearchBar()
    : renderSearchBarWithSection();
};

export default SearchBar;
