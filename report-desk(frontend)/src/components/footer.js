import React from "react";
import { Link } from "react-router-dom";
import logo_tr from "../assets/images/chatbot.png";
const Footer = () => {
  return (
    <div>
      {/* <!-- Footer --> */}
      <footer className="footer">
        <div className="position-relative section_pad">
          <div className="container">
            <div className="row">
              <div className="col col-lg-9 col-md-12 col-6 d-flex">
                <div className="footer_links">
                  <ul className="footer_links_list">
                    <li>
                      <Link to="/about-us">About Us</Link>{" "}
                      <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                    </li>
                    <li>
                      <Link to="/terms-and-conditions">
                        Terms and conditions
                      </Link>{" "}
                      <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                    </li>
                    <li>
                      <Link to="/sitemap.xml">Sitemap</Link>{" "}
                      <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                    </li>
                    <li>
                      <Link to="/disclaimer">Disclaimer</Link>{" "}
                      <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                    </li>
                    <li>
                      <Link to="/contact-us">Don't publish my report</Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col col-lg-3 col-md-3 col-6 d-flex">
                <div className="footer_social ms-auto">
                  <h5>
                    <span></span>Follow us on
                  </h5>
                  <ul className="footer_social_icons">
                    <li>
                      <a href="#">
                        <span className="fab fa-facebook-f"></span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <span className="fab fa-instagram"></span>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <span className="fab fa-twitter"></span>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.linkedin.com/company/report-desk/?viewAsMember=true"
                        target="_blank"
                      >
                        <span className="fab fa-linkedin"></span>
                      </a>
                    </li>
                    <li id="chatbotli">
                      <a id="chatbot"
                        href=" https://reportdesk.azurewebsites.net/"
                        target="_blank"
                      >
                        <img src={logo_tr} alt="Reportdesk logo" width="100" height="80" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="position-relative copyright pt-3 border-top">
          <div className="container">
            <div className="row">
              <div className="col col-md-6 col-12">
                <p>© 2022. All rights reserved.</p>
              </div>
              <div className="col col-md-6 col-12">
                <div className="copyright_designby">
                  <p>
                    Designed By -{" "}
                    <a href="https://prometteursolutions.com/" target="_blank">
                      Prometteur Solutions
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
