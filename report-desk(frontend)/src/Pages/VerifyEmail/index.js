import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import withProvider from "../../hoc/WithProvider";
import { verifyEmail } from "../../Graphs/Auth/verifyEmail";
import { Result } from "antd";
import { Link } from "react-router-dom";

const Index = () => {
  const params = useParams();
  const [metaTitle, setMetaTitle] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      emailVerification(params.id);
    }, 500);
  }, []);

  const emailVerification = async (Id) => {
    setIsLoading(true);
    await verifyEmail(Id)
      .then((res) => {
        if (res.status === 200) {
          setMetaTitle("Thank you. Your email has been verified.");
          setStatus("success");
          setIsLoading(false);
          notification["success"]({
            message: "Email verified Successfully",
          });
        } else {
          notification["error"]({
            message: "Email verification failed",
          });
          setMetaTitle("Failed to verify your email. Please try again later.");
          setStatus("error");
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setMetaTitle("Failed to verify your account. Please try again later.");
        setStatus("error");
        setIsLoading(false);
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center h-50 mb-5">
      {isLoading && (
        <>
          <div className="d-flex flex-column justify-content-center">
            <LoadingOutlined style={{ fontSize: 38 }} spin />
            <label className="mt-4">{" Verifying your account..."}</label>
          </div>
        </>
      )}

      {status === "success" && (
        <Result
          status="success"
          title={metaTitle}
          subTitle="Your account is now active. You can now login to your account."
        />
      )}
      {status === "error" && (
        <Result
          status="error"
          title={metaTitle}
          extra={
            <Link to="/">
              <button
                className="btn btn-custom2 auth_form_btn d-flex flex-row align-items-center"
                style={{ margin: "auto" }}
              >
                Go to Home Page
              </button>
            </Link>
          }
        />
      )}
    </div>
  );
};

export default withProvider(Index);
