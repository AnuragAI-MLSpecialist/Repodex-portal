import React from "react";
import { useSelector } from "react-redux";
import DownloadReportList from "./downloadReportList";
import { Spin } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

const DownloadReports = (props) => {
  const { reportData, loadMoreList } = props;

  const downloadedReport = useSelector(
    (state) => state.usersReportData?.reportList?.data?.list
  );

  const itemList = [];

  if (reportData && reportData.length >= 1) {
    reportData.forEach((model, index) => {
      const randomNumber = Math.floor(Math.random() * 6);
      itemList.push(
        <DownloadReportList
          data={model}
          key={`entity_list_item_${model._id}`}
          randomNumber={randomNumber}
        />
      );
    });
  }
  return (
    <>
      <InfiniteScroll
        style={{ overflow: "hidden" }}
        dataLength={itemList.length} // This is important field to render the next data
        next={loadMoreList}
        hasMore={downloadedReport?.hasMore}
        loader={
          <div className="d-flex justify-content-center">
            <Spin />
          </div>
        }
        scrollableTarget="scrollableDiv"
      >
        {itemList}
      </InfiniteScroll>
    </>
  );
};

export default DownloadReports;
