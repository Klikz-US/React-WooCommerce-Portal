import React from "react";
import { Link } from "react-router-dom";

import {
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBFormInline,
  MDBBtn,
} from "mdbreact";

const BreadcrumSection = ({ breadcrumb }) => {
  return (
    <MDBCard className="mb-5">
      <MDBCardBody
        id="breadcrumb"
        className="d-flex align-items-center justify-content-between"
      >
        <MDBBreadcrumb className="m-0">
          <MDBBreadcrumbItem>
            <Link to="/">Home</Link>
          </MDBBreadcrumbItem>
          {breadcrumb.parentPath !== "" && (
            <MDBBreadcrumbItem>
              <Link to={breadcrumb.parentLink}>{breadcrumb.parentPath}</Link>
            </MDBBreadcrumbItem>
          )}
          {breadcrumb.activePath !== "" && (
            <MDBBreadcrumbItem active>
              {breadcrumb.activePath}
            </MDBBreadcrumbItem>
          )}
        </MDBBreadcrumb>

        <MDBFormInline className="md-form m-0">
          <input
            className="form-control form-control-md px-2"
            type="search"
            placeholder="Quick Search"
            aria-label="Search"
          />
          <MDBBtn size="sm" color="primary" className="my-0" type="submit">
            <MDBIcon icon="search" />
          </MDBBtn>
        </MDBFormInline>
      </MDBCardBody>
    </MDBCard>
  );
};

export default BreadcrumSection;
