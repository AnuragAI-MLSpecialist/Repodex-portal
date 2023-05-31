import React from "react";

const DownloadReportList = (props) => {
  const {data } = props
  return (
    <div>
      <div className="home_reports_card shadow-sm bg-white">
        <div className="row">
          <div className="col col-12">
            <div className="home_reports_details my_downlods_list p-3">
              <div className="row">
                <div className="col col-md-9 col-12">
                  <h5>{data.report_id.name}</h5>
                  <p className="mb-0">
                    <span>
                      <small>{data.category_id.name} </small>
                    </span>
                    <small className="ms-2">Download date: {new Date(data.downloaded_at).toLocaleDateString()}</small>
                  </p>
                </div>
                <div className="col col-md-3 col-12 d-flex align-items-end">
                  <div className="position-relative ms-auto mt-2">
                    <a
                      href={data.report_id.thumb_report_url}
                      target="_blank"
                    >
                      View Report
                      <i className="fa-solid fa-chevron-right ms-2"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadReportList;
