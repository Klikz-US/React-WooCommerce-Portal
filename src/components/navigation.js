import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Accordion, Button } from "react-bootstrap";

import logo from "./../assets/images/logo.png";

import {
  FcHome,
  FcCustomerSupport,
  FcContacts,
  FcCurrencyExchange,
  FcApproval,
  FcBullish,
} from "react-icons/fc";
import { FiShoppingCart } from "react-icons/fi";
import { BsChatQuote } from "react-icons/bs";
import { CgNotes } from "react-icons/cg";

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

      <Accordion className="w-100 btn m-0 mb-1 p-0">
        <Accordion.Toggle
          as={Button}
          variant="link"
          className="btn w-100 m-0 text-left px-4 py-3"
          eventKey="2"
        >
          <FcCurrencyExchange size="24" style={{ verticalAlign: "bottom" }} />
          <span className="ml-2" style={{ fontSize: "16px" }}>
            Orders
          </span>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="2">
          <>
            <Link
              to="/orders"
              className={`d-block w-100 px-4 py-3 m-0 text-left ${
                location.pathname === "/orders"
                  ? "bg-info text-white"
                  : "bg-white text-dark"
              }`}
              onClick={hideMenu}
              style={{ borderTop: "1px solid #cccccc" }}
            >
              <FiShoppingCart
                className="ml-2"
                size="20"
                color="#007CC3"
                style={{ verticalAlign: "bottom" }}
              />
              <span className="ml-2" style={{ fontSize: "16px" }}>
                Purchase Orders
              </span>
            </Link>

            <Link
              to="/orders/rentals"
              className={`d-block w-100 px-4 py-3 m-0 text-left ${
                location.pathname === "/orders/rentals"
                  ? "bg-info text-white"
                  : "bg-white text-dark"
              }`}
              onClick={hideMenu}
            >
              <BsChatQuote
                className="ml-2"
                size="20"
                color="#007CC3"
                style={{ verticalAlign: "bottom" }}
              />
              <span className="ml-2" style={{ fontSize: "16px" }}>
                Rental Quotes
              </span>
            </Link>

            <Link
              to="/orders/proposals"
              className={`d-block w-100 px-4 py-3 m-0 text-left ${
                location.pathname === "/orders/proposals"
                  ? "bg-info text-white"
                  : "bg-white text-dark"
              }`}
              onClick={hideMenu}
            >
              <CgNotes
                className="ml-2"
                size="20"
                color="#007CC3"
                style={{ verticalAlign: "bottom" }}
              />
              <span className="ml-2" style={{ fontSize: "16px" }}>
                Purchase Proposals
              </span>
            </Link>
          </>
        </Accordion.Collapse>
      </Accordion>

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
