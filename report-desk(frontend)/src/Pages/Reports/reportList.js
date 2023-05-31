import React from "react";
import reportBg from "../../assets/images/rd_home/report_bg.png";
import { Link } from "react-router-dom";

const ReportList = (props) => {
  const { data } = props;
  return (
    <div className="home_reports_card shadow-sm bg-white mb-3">
      <div className="row">
        <div className="col col-md-4 col-12">
          <div className="home_reports_img">
            <div className="report_img_content">
              <p>
                <span>{data.category_id.name}</span>
              </p>
              <div className="report_img_heading">
                <h5>{data.name}</h5>
              </div>
            </div>
            <img src={reportBg} alt="Report" className="img-fluid border" />
          </div>
        </div>
        <div className="col col-md-8 col-12">
          <div className="home_reports_details">
            <Link to={`report-details/${data._id}`}>
              <h5>{data.name}</h5>
            </Link>
            <p>
              <span>{data.sub_category_id.name}</span>
            </p>
            <p>{data.description}</p>
            <div className="position-relative text-end">
              <Link to={`report-details/${data._id}`}>
                View Report
                <i className="fa-solid fa-chevron-right ms-2"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportList;
