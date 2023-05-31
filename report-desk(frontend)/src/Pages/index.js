import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import withProvider from "../hoc/WithProvider";
import banner from "./../assets/images/rd_home/rd_banner.png";
import automotiveHome from "../assets/images/rd_home/automotive_home.png";
import reportBg from "../assets/images/rd_home/report_bg.png";
import SearchBar from "../components/searchBar";
import {
  reportPdfList,
  reportHomeList,
  visitorCount,
} from "../Graphs/Auth/homePage";
import { setReportList, setReportPdfs } from "../actions/reportDeskAction";
import { setReportListData } from "../actions/reportList";
import Fancybox from "../components/fancybox";
import healthCareImg from "../assets/images/rd_home/healthcare_home.png";
import Login from "../components/login";
import Signup from "../components/signup";
import Otp from "../components/otp";
import ForgotPassword from "../components/forgotPassword";

const ReportDeskHome = () => {
  const dispatch = useDispatch();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [forgotPwdModalVisible, setForgotPwdModalVisible] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);

  const reportFormatPng = useSelector(
    (state) => state.reportDeskHome.reportList
  );
  const reportFormatPdf = useSelector(
    (state) => state.reportDeskHome.reportPdf
  );

  const auth = useSelector((state) => state?.auth?.loginFlag);
  const loginUserData = useSelector((state) => state?.auth?.loginUserData);

  useEffect(() => {
    getPdfList();
    getReportHome();
    manageVisitorCount(); // on home page log user count
    const script = document.createElement("script");
    script.innerHTML = `
    var swiper = new Swiper('.swiper_reports', {
     slidesPerView: 4,
     spaceBetween: 0,
     centeredSlides: true,
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
               slidesPerView: 3,
               centeredSlides: false,
               spaceBetween: 15,
          },
          640: {
               slidesPerView: 1,
               centeredSlides: false,
               spaceBetween: 15
          },
          320: {
               slidesPerView: 1,
               centeredSlides: false,
               spaceBetween: 15
          }
          }
    }); 

    var swiper = new Swiper('.png_reports_swiper', {
        slidesPerView: 3,
        spaceBetween: 15,
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
                  slidesPerView: 3
              },
              768: {
                  slidesPerView: 2
              },
              640: {
                  slidesPerView: 1
              },
              320: {
                  slidesPerView: 1
              }
        }
    });
    `;
    document.body.appendChild(script);
    // return ()=>{
    //   dispatch(setReportListData());
    // }
  }, []);

  const getPdfList = async () => {
    await reportPdfList()
      .then((res) => {
        dispatch(setReportPdfs(res.listReportData.docs));
        dispatch(setReportListData(res.listReportData));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getReportHome = async () => {
    await reportHomeList()
      .then((res) => {
        dispatch(setReportList(res.listReportData.docs));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const manageVisitorCount = async () => {
    await visitorCount(loginUserData?._id || undefined)
      .then((res) => {
        // console.log(res)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOpenModal = (props) => {
    console.log(props);
  };

  const addSubmit = async (values) => {
    const {
      authToken,
      history,
      setLoginFlag,
      setUserData,
      setUserToken,
      setListAdminData,
      setListAdminDataTotal,
    } = this.props;

    try {
      let userData = await userData(authToken, values);

      if (userData.status === 200) {
        notification["success"]({
          message: "New User Added Successfully",
        });
      } else if (userData.status === 401) {
        await setLoginFlag(false);
        await setUserData(null);
        await setUserToken(null);
        history.push(`${process.env.PUBLIC_URL}/login`);
      }
    } catch (e) {
      notification["success"]({
        message: "There was a problem in Adding User",
      });
      console.log("!!!!!!!!e", e);
    }
  };

  const handleLoginModal = () => {
    setLoginModalVisible(true);
    setShowSignupModal(false);
  };

  const handleForgotPasswordModal = () => {
    setLoginModalVisible(false);
    setForgotPwdModalVisible(true);
  };

  const handleSignupModal = () => {
    setShowSignupModal(true);
    setLoginModalVisible(false);
  };

  const handleOtpModalVisible = () => {
    setShowSignupModal(false);
    setOtpModalVisible(true);
  };

  return (
    <div>
      {/* <!-- Header --> */}
      <section className="position-relative rd_home_banner section_pad">
        <div className="rd_home_banner_inn">
          <div className="container">
            <div className="row">
              <div className="col col-md-6 col-12 d-flex align-items-center">
                <div className="rd_home_banner_content">
                  <h1>Discover data that empowers you</h1>
                  <p>
                    Report Desk guarantees the highest-quality data in the
                    market, as well as the perfect combination of consumers,
                    business experts, and hard-to-reach demographics. We are
                    committed to providing inspected and validated data, to be
                    available and accessible for your research. We believe this
                    is our backbone which includes a full array of services for
                    industry insights, and measurement throughout the marketing
                    funnel.
                  </p>
                </div>
              </div>
              <div className="col col-md-6 col-12">
                <div className="rd_home_banner_imgs">
                  <img src={banner} alt="banner img" className="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Search --> */}
      <SearchBar moduleName="HomePage" />

      {/* <!-- Categories --> */}
      <section className="position-relative home_categories section_pad">
        <div className="container">
          <div className="row">
            <div className="col col-md-6 col-12 d-flex align-items-center">
              <div className="detailed_content">
                <div className="title_line"></div>
                <h2>
                  Get <span>Automotive</span> Reports
                </h2>
                <p>
                  The automotive industrial sector is at the core of a profound
                  change in technical innovation. They are the major technology
                  absorbers, making substantial development over time.
                </p>
                <p>
                  Our reports remain updated with every change in the industry,
                  ensuring that our clients receive the finest of the best
                  reports. Consuming technology faster than the speed of light
                  in the automotive industry such as Air Cargo, Electric
                  Vehicles, Automotive infotainment, Connected Car, Armored
                  Vehicle, Off Road Automobiles, Luxury Cars, Military Aircraft,
                  Military Automotives sector, All-terrain Vehicles, Ambulance
                  Automotive among many others.
                </p>
                <Link to="reports" className="btn btn-custom">
                  View Report List
                  <i className="fa-solid fa-chevron-right ms-2"></i>
                </Link>
              </div>
            </div>
            <div className="col col-md-6 col-12">
              <div className="position-relative">
                <div className="home_categories_imgs">
                  <img
                    src={automotiveHome}
                    alt="How it works"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="position-relative home_categories">
        <div className="container">
          <div className="row">
            <div className="col col-md-6 col-12 d-flex align-items-center">
              <div className="position-relative">
                <div className="home_categories_imgs">
                  <img
                    src={healthCareImg}
                    alt="How it works"
                    className="img-fluid"
                  />
                </div>
              </div>
            </div>
            <div className="col col-md-6 col-12">
              <div className="detailed_content mt-4">
                <div className="title_line"></div>
                <h2>
                  Get <span>Healthcare</span> Reports
                </h2>
                <p>
                  Report Desk has created bespoke proprietary reports using
                  modern technology and data science to better meet your needs
                  and industry trends.
                </p>
                <p>
                  Keeping in mind the ongoing trends of digitalization in the
                  sector such as Biotechnology, Pharmaceuticals, Global Health,
                  Diet and Nutrition, Endodontic and Orthodontics, Medical
                  Imaging Technology, Post-Op Recovery, Oncology, Medical
                  Equipment, Artificial Intelligence in Health Care,
                  Kyphoplasty, Remote care, Robotics in Healthcare, and many
                  more upcoming technologies.
                </p>
                <Link to="reports" className="btn btn-custom">
                  View Report List
                  <i className="fa-solid fa-chevron-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="position-relative home_png_reports bg_light_blue section_pad">
        <div className="container">
          <div className="position-relative">
            <div className="swiper png_reports_swiper">
              <div className="swiper-wrapper">
                {reportFormatPng &&
                  reportFormatPng.map((item, index) => {
                    return item.type === "Infographic" && index < 5 ? (
                      <div className="swiper-slide p-0" key={item._id}>
                        <div className="home_reports_card">
                          <div className="home_reports_img">
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
                                data-src={item.thumb_report_url}
                                data-fancybox="group"
                                in
                              >
                                <img
                                  src={item.thumb_report_url}
                                  alt="Banner"
                                  className="img-fluid border"
                                />
                              </a>
                            </Fancybox>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div class="position-relative reports_list_filter shadow-sm bg-white p-3 mb-3">
                        <label>{"Data not found"}</label>
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

      {/* <!-- Reports --> */}
      <section className="position-relative home_reports section_pad">
        <div className="row">
          <div className="col col-md-3 col-12 d-flex align-items-end">
            <div className="position-relative view_all_reports_btn ms-auto text-end">
              <div className="position-relative pe-3">
                <Link to="reports" className="btn btn-custom">
                  View All Report
                  <i className="fa-solid fa-chevron-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="col order-last report-flex-shrink">
            <div className="position-relative order-last">
              <div className="swiper swiper_reports">
                <div className="swiper-wrapper">
                  {reportFormatPdf.map((item) => {
                    return (
                      <div className="swiper-slide" key={item._id}>
                        <div className="home_reports_card">
                          <div className="home_reports_img">
                            <div className="report_img_content">
                              <p>
                                <span>{item.category_id.name}</span>
                              </p>
                              <div className="report_img_heading">
                                <h5>{item.name}</h5>
                              </div>
                            </div>
                            <img
                              src={reportBg}
                              alt="Report"
                              className="img-fluid border"
                            />
                          </div>
                          <div className="home_reports_details">
                            <Link to={`report-details/${item._id}`}>
                              <h5>{item.name}</h5>
                            </Link>
                            <p>
                              <span>{item.sub_category_id.name}</span>
                            </p>
                            <p>{item.description}</p>
                            <div className="position-relative text-end">
                              {item?.type === "Infographic" ? (
                                <Link to={`report-details/${item._id}`}>
                                  View Infographic
                                  <i className="fa-solid fa-chevron-right ms-2"></i>
                                </Link>
                              ) : (
                                <Link to={`report-details/${item._id}`}>
                                  View
                                  <i className="fa-solid fa-chevron-right ms-2"></i>
                                </Link>
                              )}
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
          <div className="col order-first">
            <div className="home_reports_abs section_pad">
              <div className="container">
                <div className="row">
                  <div className="col col-lg-4 col-md-12 col-12 d-flex align-items-center">
                    <div className="detailed_content px-0">
                      <div className="title_line"></div>
                      <h2>
                        Get <span>Latest</span> Reports
                      </h2>
                      <p>
                        Make informed decisions based on latest market research
                        reports to make your business stay ahead of the curve.
                      </p>
                    </div>
                  </div>
                  <div className="col col-lg-4 col-md-0 col-12"></div>
                  <div className="col col-lg-4 col-md-0 col-12 d-flex align-items-center">
                    <div className="detailed_content ri_latest_content px-0">
                      <div className="title_line"></div>
                      <h2>
                        Get <span>Latest</span> Reports
                      </h2>
                      <p>
                        Make informed decisions based on latest market research
                        reports to make your business stay ahead of the curve.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Statistics --> */}
      {/* <section className="position-relative about_statistics home_statistics bg_light_blue section_pad">
        <div className="container">
          <div className="row">
            <div className="col col-12">
              <div className="detailed_content text-center">
                <h2>
                  Our <span>Statistics</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="row about_statistics_inn">
            <div className="col col-md-4 col-12 h-100">
              <div className="about_statistics_card bg-white shadow-sm d-flex align-items-center border">
                <svg
                  width="70"
                  height="70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#308894"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-users"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <div className="detailed_content">
                  <p className="mb-1">Registered Users</p>
                  <h2 className="mb-0">
                    <span>20000</span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="col col-md-4 col-12 h-100">
              <div className="about_statistics_card bg-white shadow-sm d-flex align-items-center border">
                <svg
                  width="70"
                  height="70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#308894"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-file"
                >
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                  <polyline points="13 2 13 9 20 9"></polyline>
                </svg>
                <div className="detailed_content">
                  <p className="mb-1">Total Reports</p>
                  <h2 className="mb-0">
                    <span>30000</span>
                  </h2>
                </div>
              </div>
            </div>
            <div className="col col-md-4 col-12 h-100">
              <div className="about_statistics_card bg-white shadow-sm d-flex align-items-center border">
                <svg
                  width="70"
                  height="70"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#308894"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-download"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <div className="detailed_content">
                  <p className="mb-1">Downloads</p>
                  <h2 className="mb-0">
                    <span>50000</span>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* <!-- Download card --> */}
      <section className="position-relative home-download-bg">
        <div className="home_download_inn">
          <div className="container">
            <div className="download_bg">
              <div className="row">
                <div className="col col-md-8 col-12">
                  <div className="detailed_content text-white">
                    <div className="title_line bg-white"></div>
                    <h4 className="text-white bg_line">How does it work? </h4>
                    <p>
                      Report Desk uses real-time statistics to generate reports.
                      Using AI, Report Desk gathers all pertinent market data
                      and reports, and the platform automatically sorts them
                      into specific categories. This filter enables users to
                      quickly navigate, read, and download these documents.
                    </p>
                    <p>
                      Download reports for free by just signing up with Report
                      Desk.
                    </p>
                    <p>
                      Users can contact the Report Desk team for questions or
                      specific requirements regarding market reports by filling
                      out the contact form or using the chatbot.
                    </p>

                    {auth ? (
                      <Link to="my-downloads" className="btn btn-white">
                        Download Reports For Free
                        <i className="fa-solid fa-chevron-right ms-2"></i>
                      </Link>
                    ) : (
                      <>
                        <p onClick={handleLoginModal} className="btn btn-white">
                          Download Reports For Free
                          <i className="fa-solid fa-chevron-right ms-2"></i>
                        </p>
                        {loginModalVisible && (
                          <Login
                            onSubmit={handleOpenModal}
                            loginModalVisible={loginModalVisible}
                            setLoginModalVisible={setLoginModalVisible}
                            handleForgotPasswordModal={
                              handleForgotPasswordModal
                            }
                            handleSignupModal={handleSignupModal}
                          />
                        )}

                        {forgotPwdModalVisible && (
                          <ForgotPassword
                            forgotPwdModalVisible={forgotPwdModalVisible}
                            setForgotPwdModalVisible={setForgotPwdModalVisible}
                          />
                        )}

                        {showSignupModal && (
                          <Signup
                            onSubmit={addSubmit}
                            showSignupModal={showSignupModal}
                            setShowSignupModal={setShowSignupModal}
                            handleOtpModalVisible={handleOtpModalVisible}
                          />
                        )}
                        {otpModalVisible && (
                          <Otp
                            otpModalVisible={otpModalVisible}
                            setOtpModalVisible={setOtpModalVisible}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default withProvider(ReportDeskHome);
