import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import withProvider from "../../hoc/WithProvider";
import reportBg from "../../assets/images/rd_home/report_bg.png";
import { Link } from "react-router-dom";
import { downloadReport, similarReport } from "../../Graphs/Auth/reportDetails";
import { setSimilarReport } from "../../actions/similarReport";
import Fancybox from "../../components/fancybox";
import { notification, Popover } from "antd";
import { searchReport } from "../../Graphs/Auth/searchReport";
import countryList from "react-select-country-list";

const Index = () => {
  const params = useParams();
  const reportId = params?.id;
  const [report, setReport] = useState({});
  const history = useHistory();

  const content = (
    <div>
      <p>Sign up for free to download Report.</p>
    </div>
  );

  const dispatch = useDispatch();

  const reportListData = useSelector(
    (state) => state?.reportListData?.reportList?.data
  );

  const similarReportData = useSelector((state) => state.similarReport);
  const loginFlag = useSelector((state) => state.auth.loginFlag);

  useEffect(() => {
    const reportById = reportListData?.docs.find(
      (data) => data._id === reportId
    );
    if (!reportId) {
      history.push("/reports");
      notification["error"]({
        message: "Report details not found. Please try again later.",
      });
      return;
    }
    getReportDetails(reportId);
    getSimilarReport(reportId);
    document
      .getElementById("scrollableDiv")
      .scrollTo({ top: 0, behavior: "smooth" });
    // setReport(reportById);

    const script = document.createElement("script");
    script.innerHTML = `
    var swiper = new Swiper('.swiper_reports', {
        slidesPerView: 4,
        spaceBetween: 0,
        navigation: {
             nextEl: '.swiper-button-next',
             prevEl: '.swiper-button-prev',
        },
        pagination: {
        el: '.swiper-pagination',
        clickable: true,
        },
        breakpoints: {
             1024: {
                  slidesPerView: 4
             },
             768: {
                  slidesPerView: 2,
                  spaceBetween: 15,
             },
             640: {
                  slidesPerView: 1,
                  spaceBetween: 15
             },
             320: {
                  slidesPerView: 1,
                  spaceBetween: 15
             }
             }
   })        
    `;
    document.body.appendChild(script);
  }, [reportId]);

  const getReportDetails = async (selectedReportId) => {
    await searchReport(selectedReportId)
      .then((res) => {
        if (res.status === 200) {
          setReport(res.reportData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const downloadReportPdf = async (id) => {
    await downloadReport(id)
      .then((res) => {
        console.log("Download Report Response", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSimilarReport = async (data) => {
    await similarReport(data)
      .then((res) => {
        dispatch(setSimilarReport(res?.listReportData?.docs));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const returnCountryName = (countryCode) => {
    if (countryCode) {
      let countryObj = countryList()
        .getData()
        .find((item) => item.value === countryCode);
      return countryObj?.label || "-";
    }
    return "-";
  };

  return (
    <div>
      {/* <!-- Reports --> */}
      <section className="position-relative reports_details section_pad bg_light_blue view">
        <div className="container ">
          <div className="row">
            <div className="col col-12">
              {/* <div className="home_reports_details mb-4">
                <a
                  href={report?.thumb_report_url}
                  data-fancybox="group"
                  in
                >
                  <h3>
                    {report?.name} {report?.published_year}
                  </h3>
                </a>
              </div> */}
            </div>
            <div className="col col-lg-6 col-12">
              <div className="position-relative">
                <div className="position-relative home_reports_img mb-4">
                  <div className="report_img_content">
                    <p>
                      <span>{report?.category_id?.name}</span>
                    </p>
                    <div className="report_img_heading">
                      <h5>{report?.name}</h5>
                    </div>
                  </div>
                  <div className="d-flex">
                    <img
                      src={reportBg}
                      alt="Report"
                      className="img-fluid border report-bg-resize"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col col-lg-6 col-12" key={report?._id}>
              <div className="home_reports_details mb-4">
                <Fancybox
                  options={{
                    infinite: false,
                    Toolbar: {
                      display: ["close"],
                    },
                    Thumbs: false,
                  }}
                >
                  <a
                    data-src={report?.thumb_report_url}
                    data-fancybox="group"
                    style={{ width: "40%" }}
                    in
                  >
                    <h3>{report?.name}</h3>
                  </a>
                </Fancybox>
              </div>
              <div key={report?._id}>
                <div className="position-relative reports_list_filter shadow-sm bg-white p-3 mb-3">
                  <div className="position-relative mb-3">
                    {loginFlag ? (
                      <>
                        <div className="position-relative d-flex align-items-center justify-content-around">
                          <Fancybox
                            options={{
                              infinite: false,
                              Toolbar: {
                                display: ["close"],
                              },
                              Thumbs: false,
                            }}
                          >
                            <a
                              href={report?.thumb_report_url}
                              data-fancybox="gallary"
                              className="btn btn-custom2 me-2"
                              in
                              style={{ width: "40%" }}
                            >
                              <i className="fas fa-eye me-2"></i> Preview
                            </a>
                          </Fancybox>
                          <a
                            download="Report"
                            href={report?.report_url}
                            className="btn btn-custom2 me-2"
                            target="_blank"
                            onClick={() => downloadReportPdf(report?._id)}
                            style={{ width: "40%" }}
                          >
                            <i className="fas fa fa-download me-2"></i>Download
                          </a>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="position-relative d-flex align-items-center justify-content-around">
                          <Fancybox
                            options={{
                              infinite: false,
                              Toolbar: {
                                display: ["close"],
                              },
                              Thumbs: false,
                            }}
                          >
                            <a
                              data-src={report?.thumb_report_url}
                              data-fancybox="gallary"
                              className="btn btn-custom2 me-2"
                              in
                              style={{ width: "40%" }}
                            >
                              <i className="fas fa-eye me-2"></i> Preview
                            </a>
                          </Fancybox>
                          <Popover content={content}>
                            <a
                              className="btn me-1 disabled-button"
                              style={{ width: "40%" }}
                            >
                              <i className="fas fa fa-download me-1"></i>
                              Download
                            </a>
                          </Popover>
                        </div>
                      </>
                    )}
                  </div>
                  {report?.countries &&
                    report?.countries.length >= 1 &&
                    report?.countries[0]?.country && (
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
                        <p>
                          {report?.countries
                            ?.map((item) => returnCountryName(item?.country))
                            .join(",")}
                        </p>
                      </div>
                    )}
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
                    <p>
                      {report?.regions?.map((item) => item.region).join(",")}
                    </p>
                  </div>
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
                    <p>{report?.published_year}</p>
                  </div>
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
                    <p>{report?.type}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* </>
              ) : null;
            })} */}
          </div>
          <div className="row">
            <div className="col col-12">
              <div className="home_reports_details">
                <p>{report?.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Similar Reports --> */}
      {similarReportData &&
        similarReportData?.similarReport &&
        similarReportData?.similarReport?.length >= 1 && (
          <section className="position-relative home_reports section_pad">
            <div className="position-relative view_all_reports_btn mb-3">
              <div className="container">
                <div className="position-relative mb-3">
                  <h4>Similar Reports</h4>
                </div>
              </div>
            </div>
            <div className="position-relative">
              <div className="container">
                <div className="swiper swiper_reports">
                  <div className="swiper-wrapper">
                    {similarReportData &&
                      similarReportData?.similarReport?.map((item) => {
                        return (
                          <div className="swiper-slide">
                            <div className="home_reports_card">
                              <div className="home_reports_img">
                                <div className="report_img_content">
                                  <p>
                                    <span>{item.category_id.name}</span>
                                  </p>
                                  <div className="report_img_heading">
                                    <h4>{item.name}</h4>
                                  </div>
                                </div>
                                <img
                                  src={reportBg}
                                  alt="Report"
                                  className="img-fluid border"
                                />
                              </div>
                              <div className="home_reports_details">
                                <h5>{item.name}</h5>
                                <p>
                                  <span>{item.sub_category_id.name}</span>
                                </p>
                                <p>{item.description}</p>
                                <div className="position-relative text-end">
                                  <Link to={`${item._id}`}>
                                    View Report
                                    <i className="fa-solid fa-chevron-right ms-2"></i>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <div className="swiper-button-next"></div>
                  <div className="swiper-button-prev"></div>
                </div>
              </div>
            </div>
          </section>
        )}
    </div>
  );
};

export default withProvider(Index);
