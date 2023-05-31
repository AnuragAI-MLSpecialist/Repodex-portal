import React from "react";
import withProvider from "../../hoc/WithProvider";
import rdImage from "../../assets/images/about/rd.png";

const Index = () => {
  return (
    <div>
      {/* <!-- Page Heading --> */}
      <section className="position-relative sub_page_title bg_light_blue">
        <div className="container">
          <div className="row">
            <div className="col col-12">
              <div className="position-relative text-center">
                <h2>
                  About <span>Report Desk</span>
                </h2>
                <p>Get global information intelligently.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- About --> */}
      <section className="position-relative about_main section_pad">
        <div className="container">
          <div className="row">
            <div className="col col-lg-6 col-md-12 col-12 d-flex align-items-center">
              <div className="detailed_content">
                <h2>
                  We're a{" "}
                  <span className="d-block">Global Business Data Platform</span>
                </h2>
                <p>
                  Report Desk is your one-stop platform as we provide an
                  ever-expanding set of datasets, and data feeds, obtain
                  comprehensive market insights, industry, and country
                  information across countries, territories, and regions.
                  Discover much more in Healthcare and Automotive sectors.
                </p>
                <p>
                  The Report Desk team will assist you and give customized
                  service based on your specific requirements, collecting, and
                  analysing data both offline and online.
                </p>

                <div className="about_cat">
                  <div className="row">
                    <div className="col col-lg-3 col-4">
                      <div className="position-relative text-center">
                        <i className="fas fa-plus"></i>
                        <p>Healthcare</p>
                      </div>
                    </div>
                    <div className="col col-lg-3 col-4">
                      <div className="position-relative text-center">
                        <i className="fas fa-car"></i>
                        <p>Automotive</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col col-lg-6 col-md-12 col-12 d-flex align-items-center">
              <div className="position-relative ps-3">
                <img src={rdImage} alt="Report Desk" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Offering --> */}
      <section className="position-relative about_categories section_pad">
        <div className="container">
          <div className="row">
            <div className="col col-12">
              <div className="detailed_content text-center">
                <h2>
                  Our <span>offerings</span> in Healthcare and Automotive
                </h2>
              </div>
            </div>

            <div className="col col-md-6 col-12">
              <div className="detailed_content">
                <ul>
                  <li>Market Trends and Opportunities</li>
                  <li>Market Landscape</li>
                  <li>Market Segmentation </li>
                  <li>Demographic Segmentation</li>
                  <li>Market Drivers and Market Players</li>
                  <li>Competitive landscape and component benchmarking</li>
                  <li>Policy and regulatory terms</li>
                  <li>
                    Financial Performance - forecasting and estimation of growth
                    in the sector
                  </li>
                  <li>
                    Existing Reports (available on forums/ published reports)
                  </li>
                </ul>
              </div>
            </div>

            <div className="col col-md-6 col-12">
              <div className="detailed_content">
                <ul>
                  <li>
                    {" "}
                    Strategic Initiatives - Market strategy and evaluation
                  </li>
                  <li>Service Benchmarking</li>
                  <li>Primary and Secondary Research Reports </li>
                  <li>Qualitative and Quantitative Analysis</li>
                  <li>Surveys - Product and Consumer</li>
                  <li>User Experience</li>
                  <li>Porters 5 Forces, PESTEL Analysis, SWOT Analysis</li>
                  <li>Investors and VCs</li>
                  <li>Seed funding and investments</li>
                  <li>Startups in the field</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Statistics --> */}
      <section className="position-relative about_statistics bg_light_blue section_pad">
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
              <div className="about_statistics_card bg-white shadow-sm d-flex align-items-center">
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
              <div className="about_statistics_card bg-white shadow-sm d-flex align-items-center">
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
              <div className="about_statistics_card bg-white shadow-sm d-flex align-items-center">
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
      </section>
      
    </div>
  );
};

export default withProvider(Index);
