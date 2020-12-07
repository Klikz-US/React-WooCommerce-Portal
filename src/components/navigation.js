import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import logo from "./../assets/images/logo.png";

import { FcHome } from "react-icons/fc";
import { FcCustomerSupport } from "react-icons/fc";
import { FcContacts } from "react-icons/fc";
import { FcCurrencyExchange } from "react-icons/fc";
import { FcApproval } from "react-icons/fc";
import { FcBullish } from "react-icons/fc";

export default function Navigation() {
  const auth_obj = useSelector((state) => state.auth);
  const { isAdmin } = auth_obj.user !== null ? auth_obj.user : false;

  const location = useLocation();

  const hideMenu = () => {
    document.getElementById("navbar-toggler").classList.add("collapsed");
    document.getElementById("responsive-navbar-nav").classList.remove("show");
  };

  return (
    <>
      <div className="w-100 p-3 collapse-hide">
        <img src={logo} className="img-fluid" alt="CleanAir Engineering" />
      </div>

      <Link
        to="/"
        className={`btn w-100 px-4 py-3 m-0 mb-1 text-left ${
          location.pathname === "/" ? "bg-info text-white" : "bg-white"
        }`}
        onClick={hideMenu}
      >
        <FcHome size="24" style={{ verticalAlign: "bottom" }} />
        <span className="ml-2" style={{ fontSize: "16px" }}>
          Dashboard
        </span>
      </Link>

      {isAdmin && (
        <Link
          to="/users"
          className={`btn w-100 px-4 py-3 m-0 mb-1 text-left ${
            location.pathname === "/users" ? "bg-info text-white" : "bg-white"
          }`}
          onClick={hideMenu}
        >
          <FcCustomerSupport size="24" style={{ verticalAlign: "bottom" }} />
          <span className="ml-2" style={{ fontSize: "16px" }}>
            Users
          </span>
        </Link>
      )}

      <Link
        to="/products"
        className={`btn w-100 px-4 py-3 m-0 mb-1 text-left ${
          location.pathname === "/products" ? "bg-info text-white" : "bg-white"
        }`}
        onClick={hideMenu}
      >
        <FcApproval size="24" style={{ verticalAlign: "bottom" }} />
        <span className="ml-2" style={{ fontSize: "16px" }}>
          Products
        </span>
      </Link>

      <Link
        to="/orders"
        className={`btn w-100 px-4 py-3 m-0 mb-1 text-left ${
          location.pathname === "/orders" ? "bg-info text-white" : "bg-white"
        }`}
        onClick={hideMenu}
      >
        <FcCurrencyExchange size="24" style={{ verticalAlign: "bottom" }} />
        <span className="ml-2" style={{ fontSize: "16px" }}>
          Orders
        </span>
      </Link>

      <Link
        to="/customers"
        className={`btn w-100 px-4 py-3 m-0 mb-1 text-left ${
          location.pathname === "/customers" ? "bg-info text-white" : "bg-white"
        }`}
        onClick={hideMenu}
      >
        <FcContacts size="24" style={{ verticalAlign: "bottom" }} />
        <span className="ml-2" style={{ fontSize: "16px" }}>
          Customers
        </span>
      </Link>

      <Link
        to="/activity"
        className={`btn w-100 px-4 py-3 m-0 mb-1 text-left ${
          location.pathname === "/activity" ? "bg-info text-white" : "bg-white"
        }`}
        onClick={hideMenu}
      >
        <FcBullish size="24" style={{ verticalAlign: "bottom" }} />
        <span className="ml-2" style={{ fontSize: "16px" }}>
          Activity
        </span>
      </Link>
    </>
  );
}
