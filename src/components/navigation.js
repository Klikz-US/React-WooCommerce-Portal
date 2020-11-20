import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { Accordion, Button } from "react-bootstrap";
import { MDBListGroupItem, MDBIcon } from "mdbreact";

import logo from "./../assets/images/logo.png";

export default function Navigation() {
  const auth_obj = useSelector((state) => state.auth);
  const { isAdmin } = auth_obj.user;

  return (
    <>
      <div className="w-100 p-5">
        <Link to="/dashboard">
          <img src={logo} className="img-fluid" alt="C2 Keep" />
        </Link>
      </div>

      <Link to="/dashboard" className="btn w-100 p-0 m-0 text-left">
        <MDBListGroupItem>
          <MDBIcon icon="chart-pie" className="mr-2" />
          Dashboard
        </MDBListGroupItem>
      </Link>

      <Accordion className="w-100">
        {isAdmin && (
          <>
            <Accordion.Toggle
              as={Button}
              variant="link"
              className="btn w-100 p-0 m-0 text-left"
              eventKey="0"
            >
              <MDBListGroupItem>
                <MDBIcon icon="user" className="mr-2" />
                Account Mangement
              </MDBListGroupItem>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <>
                <Link
                  to="/users"
                  className="shadow-none btn w-100 p-0 pl-3 m-0 text-left"
                >
                  <MDBListGroupItem className="border-0">
                    <MDBIcon icon="align-justify" className="mr-2" />
                    All Accounts
                  </MDBListGroupItem>
                </Link>
                <Link
                  to="/users/add"
                  className="shadow-none btn w-100 p-0 pl-3 m-0 text-left"
                >
                  <MDBListGroupItem className="border-0">
                    <MDBIcon icon="plus" className="mr-2" />
                    Add New Account
                  </MDBListGroupItem>
                </Link>
              </>
            </Accordion.Collapse>
          </>
        )}

        <Accordion.Toggle
          as={Button}
          variant="link"
          className="btn w-100 p-0 m-0 text-left"
          eventKey="1"
        >
          <MDBListGroupItem>
            <MDBIcon icon="clipboard-list" className="mr-2" />
            Inventory Mangement
          </MDBListGroupItem>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="1">
          <>
            <Link
              to="/inventories"
              className="shadow-none btn w-100 p-0 pl-3 m-0 text-left"
            >
              <MDBListGroupItem className="border-0">
                <MDBIcon icon="align-justify" className="mr-2" />
                All Inventories
              </MDBListGroupItem>
            </Link>
            <Link
              to="/inventories/add"
              className="shadow-none btn w-100 p-0 pl-3 m-0 text-left"
            >
              <MDBListGroupItem className="border-0">
                <MDBIcon icon="plus" className="mr-2" />
                Add New Inventory
              </MDBListGroupItem>
            </Link>
            <Link
              to="/inventories/add"
              className="shadow-none btn w-100 p-0 pl-3 m-0 text-left"
            >
              <MDBListGroupItem className="border-0">
                <MDBIcon icon="edit" className="mr-2" />
                Dispense Inventory
              </MDBListGroupItem>
            </Link>
            <Link
              to="/inventories/add"
              className="shadow-none btn w-100 p-0 pl-3 m-0 text-left"
            >
              <MDBListGroupItem className="border-0">
                <MDBIcon icon="trash-alt" className="mr-2" />
                Amend Inventory
              </MDBListGroupItem>
            </Link>
          </>
        </Accordion.Collapse>

        <Accordion.Toggle
          as={Button}
          variant="link"
          className="btn w-100 p-0 m-0 text-left"
          eventKey="2"
        >
          <MDBListGroupItem>
            <MDBIcon icon="chart-line" className="mr-2" />
            Review Activity
          </MDBListGroupItem>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="2">
          <>
            <Link
              to="/report"
              className="shadow-none btn w-100 p-0 pl-3 m-0 text-left"
            >
              <MDBListGroupItem className="border-0">
                <MDBIcon icon="align-justify" className="mr-2" />
                All Activity
              </MDBListGroupItem>
            </Link>
            <Link
              to="/report/user-defined"
              className="shadow-none btn w-100 p-0 pl-3 m-0 text-left"
            >
              <MDBListGroupItem className="border-0">
                <MDBIcon icon="user-circle" className="mr-2" />
                User Defined Activity
              </MDBListGroupItem>
            </Link>
            <Link
              to="/report/drug-defined"
              className="shadow-none btn w-100 p-0 pl-3 m-0 text-left"
            >
              <MDBListGroupItem className="border-0">
                <MDBIcon icon="pills" className="mr-2" />
                Drug Defined Activity
              </MDBListGroupItem>
            </Link>
            <Link
              to="/report/dea-compliant"
              className="shadow-none btn w-100 p-0 pl-3 m-0 text-left"
            >
              <MDBListGroupItem className="border-0">
                <MDBIcon icon="radiation-alt" className="mr-2" />
                DEA Compliant
              </MDBListGroupItem>
            </Link>
          </>
        </Accordion.Collapse>
      </Accordion>
    </>
  );
}
