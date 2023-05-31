import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ScrollContext } from "react-router-scroll-4";
import Router from "./router/index";

//css
import "./assets/css/bootstrap.css";
import "./assets/css/bootstrap.min.css";
import "./assets/css/style.css";
import "./assets/css/login.css";
import "./assets/css/core.css";
import "./assets/css/responsive.css";

// ** Import custom components for redux**
import { Provider } from "react-redux";
import store from "./store/index";
import axios from "axios";
import setupAxios from "./Graphs/axios";

setupAxios(axios, store);

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter basename={"/"}>
          <ScrollContext>
            <Router />
          </ScrollContext>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
