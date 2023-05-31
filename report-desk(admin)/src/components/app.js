import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import logo_hr from "../assets/images/logo_hr.png";

const AppLayout = ({ children, props }) => {
  const { loginUserData } = useSelector((state) => state.auth);
  const history = useHistory();
  const dispatch = useDispatch();

  const onLogout = async () => {
    await dispatch({
      type: "USER_LOGOUT",
    });
    history.push(`${process.env.PUBLIC_URL}/login`);
  };

  const onChangePassword = async () => {
    history.push(`${process.env.PUBLIC_URL}/change-password`);
  };

  const onDashboard = async () => {
    history.push(`${process.env.PUBLIC_URL}/dashboard`);
  };

  const onReRoute = (newRoute) => {
    history.push(newRoute);
  };

  const headerName = () => {
    if (history.location.pathname.includes("/dashboard")) {
      return "Dashboard";
    }

    if (history.location.pathname.includes("/change-password")) {
      return "Change Password";
    }

    if (history.location.pathname.includes("/users")) {
      return "User List";
    }

    if (history.location.pathname.includes("/reports")) {
      return "Report List";
    }
    if (history.location.pathname.includes("/train-model")) {
      return "Train Model";
    }

    if (history.location.pathname.includes("/create-reports")) {
      return "Add/Edit Reports";
    }

    if (history.location.pathname.includes("/categories")) {
      return "Categories List";
    }

    if (history.location.pathname.includes("/sub-categories")) {
      return "Sub Categories List";
    }

    if (history.location.pathname.includes("/search-history")) {
      return "Search History";
    }
  };

  return (
    <div>
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          {/* Menu */}
          <aside
            id="layout-menu"
            className="layout-menu menu-vertical menu bg-menu-theme"
          >
            <div className="app-brand demo">
              <a
                href="javascript::void(0)"
                className="app-brand-link py-3"
                onClick={() => onDashboard()}
              >
                <span className="app-brand-logo demo">
                  <img
                    src={logo_hr}
                    alt="logo"
                    className="img-fluid"
                    width={150}
                    height={29}
                  />
                </span>
              </a>
            </div>
            <div className="menu-inner-shadow" />
            <ul className="menu-inner py-1">
              {/* Dashboard */}
              <li
                className={`menu-item ${
                  history.location.pathname.includes("/dashboard")
                    ? "active"
                    : ""
                }`}
              >
                <a
                  href="javascript::void(0)"
                  onClick={() =>
                    onReRoute(`${process.env.PUBLIC_URL}/dashboard`)
                  }
                  className="menu-link"
                >
                  <i className="fas fa-border-all menu-icon" />
                  <div data-i18n="Analytics">Dashboard</div>
                </a>
              </li>
               {/* Train Model */}
               <li
                className={`menu-item ${
                  history.location.pathname.includes("/train-model")
                    ? "active"
                    : ""
                }`}
              >
                <a
                  href="javascript::void(0)"
                  onClick={() =>
                    onReRoute(`${process.env.PUBLIC_URL}/train-model`)
                  }
                  className="menu-link"
                >
                  <i className="fas fa-border-all menu-icon" />
                  <div data-i18n="Analytics">Train Model</div>
                </a>
              </li>
              {/* Users */}
              <li
                className={`menu-item ${
                  history.location.pathname.includes("/users") ? "active" : ""
                }`}
              >
                <a
                  href="javascript::void(0)"
                  className="menu-link"
                  onClick={() => onReRoute(`${process.env.PUBLIC_URL}/users`)}
                >
                  <i className="far fa-user-circle menu-icon" />
                  <div data-i18n="Analytics">Users List</div>
                </a>
              </li>
              {/* Reports */}
              <li className="menu-header small text-uppercase">
                <span className="menu-header-text">Reports</span>
              </li>
              <li
                className={`menu-item ${
                  history.location.pathname.includes("/reports") ? "active" : ""
                }`}
              >
                <a
                  href="javascript::void(0)"
                  className="menu-link"
                  onClick={() => onReRoute(`${process.env.PUBLIC_URL}/reports`)}
                >
                  <i className="fa-regular fa-file menu-icon" />
                  <div data-i18n="Analytics">Reports List</div>
                </a>
              </li>
              <li
                className={`menu-item ${
                  history.location.pathname.includes("/create-reports")
                    ? "active"
                    : ""
                }`}
              >
                <a
                  href="javascript::void(0)"
                  className="menu-link"
                  onClick={() =>
                    onReRoute(`${process.env.PUBLIC_URL}/create-reports`)
                  }
                >
                  <i className="fa-solid fa-plus menu-icon" />
                  <div data-i18n="Analytics">Upload New Report</div>
                </a>
              </li>
              {/* Reports */}
              <li className="menu-header small text-uppercase">
                <span className="menu-header-text">Categories</span>
              </li>
              <li
                className={`menu-item ${
                  history.location.pathname.includes("/categories")
                    ? "active"
                    : ""
                }`}
              >
                <a
                  href="javascript::void(0)"
                  className="menu-link"
                  onClick={() =>
                    onReRoute(`${process.env.PUBLIC_URL}/categories`)
                  }
                >
                  <i className="fas fa-list-ul menu-icon" />
                  <div data-i18n="Analytics">Categories List</div>
                </a>
              </li>
              <li
                className={`menu-item ${
                  history.location.pathname.includes("/sub-categories")
                    ? "active"
                    : ""
                }`}
              >
                <a
                  href="javascript::void(0)"
                  className="menu-link"
                  onClick={() =>
                    onReRoute(`${process.env.PUBLIC_URL}/sub-categories`)
                  }
                >
                  <i className="far fa-list-alt menu-icon" />
                  <div data-i18n="Analytics">Sub-categories List</div>
                </a>
              </li>
              {/* History */}
              <li className="menu-header small text-uppercase">
                <span className="menu-header-text">History</span>
              </li>
              <li
                className={`menu-item ${
                  history.location.pathname.includes("/search-history")
                    ? "active"
                    : ""
                }`}
              >
                <a
                  href="javascript::void(0)"
                  className="menu-link"
                  onClick={() =>
                    onReRoute(`${process.env.PUBLIC_URL}/search-history`)
                  }
                >
                  <i className="fa-solid fa-clock-rotate-left menu-icon" />
                  <div data-i18n="Analytics">Search History</div>
                </a>
              </li>
            </ul>
          </aside>
          {/* / Menu */}
          <div className="layout-page">
            {/* Navbar */}
            <nav
              className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
              id="layout-navbar"
            >
              <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                <a
                  className="nav-item nav-link px-0 me-xl-4"
                  href="javascript:void(0)"
                >
                  <i className="fa-solid fa-bars" />
                </a>
              </div>
              <h5 className="py-3 mb-0 w-100">
                <span className="text-muted fw-light" />
                {headerName()}
              </h5>
              <div
                className="navbar-nav-right d-flex align-items-center"
                id="navbar-collapse"
              >
                <ul className="navbar-nav flex-row align-items-center ms-auto">
                  {/* User */}
                  <li className="nav-item navbar-dropdown dropdown-user dropdown">
                    <a
                      className="nav-link dropdown-toggle hide-arrow"
                      href="javascript:void(0);"
                      data-bs-toggle="dropdown"
                    >
                      <div className="flex-grow-1">
                        <span className="fw-semibold d-block">
                          <i className="fa-regular fa-user me-2" />
                          John Doe
                          <i className="fa-solid fa-angle-down ms-2" />
                        </span>
                      </div>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <a
                          className="dropdown-item"
                          href="javascript::void(0)"
                          onClick={() => onChangePassword()}
                        >
                          <i className="bx bx-user me-2" />
                          <span className="align-middle">Change Password</span>
                        </a>
                      </li>
                      <li>
                        <div className="dropdown-divider" />
                      </li>
                      <li>
                        <a
                          className="dropdown-item"
                          href="javascript::void(0)"
                          onClick={() => onLogout()}
                        >
                          <i className="bx bx-power-off me-2" />
                          <span className="align-middle">Log Out</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                  {/*/ User */}
                </ul>
              </div>
            </nav>
            {/* / Navbar */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
