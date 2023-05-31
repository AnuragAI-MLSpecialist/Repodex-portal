/* eslint-disable react-hooks/rules-of-hooks */
import React, { Fragment, useState } from "react";

const CustomLoader = () => {
  // const [show, setShow] = useState(true);
  const [show] = useState(true);

  return (
    <Fragment>
      <div id="loader-container" className={show ? "" : "closeLoader"}>
        <div className="loadingio-spinner-ripple-lfgi9qy0qan">
          <div className="ldio-t38nnne4r5e">
            <div></div>
            <div></div>
            {/* <img src="../../static/images/logo.png" alt="logo" /> */}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CustomLoader;
