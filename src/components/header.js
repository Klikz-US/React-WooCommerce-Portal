import React from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Button } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { FiLogOut, FiSettings } from "react-icons/fi";
import logo_white from "./../assets/images/logo-white.png";

import { userLogoutAsync } from "../actions/auth-async.action";
import Navigation from "../components/navigation";

export default function Header() {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    dispatch(userLogoutAsync());
    history.push("/");
  };

  return (
    <header>
      <Navbar
        collapseOnSelect
        expand="lg"
        className="ml-auto d-flex flex-row justify-content-end pr-4 bg-info"
      >
        <Navbar.Brand className="custom--desktop-hide mr-auto">
          <img src={logo_white} alt="CleanAir Engineering" />
        </Navbar.Brand>
        <Navbar.Toggle
          id="navbar-toggler"
          aria-controls="responsive-navbar-nav"
        />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto custom--desktop-hide my-4">
            <Navigation />
          </Nav>
          <Nav className="ml-auto navbar-nav d-flex flex-row">
            <Link to="/setting" className="d-block ml-auto">
              <Button className="px-2" variant="info">
                <FiSettings size={24} className="text-white" />
              </Button>
            </Link>

            <Button
              className="px-2"
              variant="info"
              onClick={handleLogout}
              style={{ width: "40px" }}
            >
              <FiLogOut size={24} className="text-white" />
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
}
