import React from "react";
import { Provider } from "react-redux";
// import ConfigStore from "../store/index";
import { withRouter } from "react-router"
var _ = require("lodash");

export default function withRedux(Component) {
  return withRouter(
    class extends React.Component {
      constructor(props) {
        super(props);
        this.state = {};
        // this.store = ConfigStore();
      }

      render() {
          console.log(this.props);
        return (
          <div>
            {/* <Provider store={this.store}> */}
              <div>
                <Component {...this.props} path={this.props.location.pathname} />
              </div>
            {/* </Provider> */}
          </div>
        );
      }
    }
  );
}
