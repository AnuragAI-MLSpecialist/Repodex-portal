import React from "react";
// import ConfigStore from "../store/index";
import WithRedux from "./WithRedux";
import { withRouter } from "react-router";
import Header from "../components/header";
import Footer from "../components/footer";
var _ = require("lodash");

export default function withProvider(
  Component,
  loginRequired = false,
  lightFooter = false
) {
  return WithRedux(
    withRouter(
      class extends React.Component {
        constructor(props) {
          super(props);
          this.state = {};
          //   this.store = ConfigStore();
        }

        componentDidMount() {
          //   let storeState = this.store.getState();
          //   if (loginRequired && !storeState.auth.loginFlag) {
          //     Router.push("/login");
          //   }
          //   if (
          //     storeState.auth.loginFlag &&
          //     (this.props.router.pathname === "/login" ||
          //       this.props.router.pathname === "/signup")
          //   ) {
          //     Router.push("/home");
          //   }
        }

        render() {
          return (
            <div>
              <div
                id="scrollableDiv"
                style={{
                  height: "100vh",
                  overflow: "auto",
                }}
              >
                <Header />
                <Component
                  {...this.props}
                  path={this.props.location.pathname}
                />
                <Footer />
                {/* {lightFooter ? <LightFooter /> : <DarkFooter />} */}
              </div>

              {/* <script src="..//static/js/toggle.js"></script>
            <script src="https://unpkg.com/react-medium-image-zoom"></script> */}
            </div>
          );
        }
      }
    )
  );
}
