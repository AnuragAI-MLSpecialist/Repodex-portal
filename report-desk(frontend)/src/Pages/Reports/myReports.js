import React from "react";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import ReportList from "./reportList";

const MyReports = (props) => {
  const { reportData, loadMoreList } = props;

  const reportList = useSelector((state) => state.reportListData);
  const itemList = [];

  if (reportData && reportData.docs && reportData.docs.length >= 1) {
    reportData.docs.forEach((model, index) => {
      const randomNumber = Math.floor(Math.random() * 6);
      itemList.push(
        <ReportList
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
        hasMore={reportList?.reportList?.data?.hasMore}
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

export default MyReports;
