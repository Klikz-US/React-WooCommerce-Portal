import React from "react";
import { Link } from "react-router-dom";

import {
  MDBCard,
  MDBCardBody,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBFormInline,
} from "mdbreact";

const BreadcrumSection = ({ breadcrumb }) => {
  return (
    <MDBCard className="mb-5">
      <MDBCardBody
        id="breadcrumb"
        className="d-flex align-items-center justify-content-between flex-wrap"
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

        {breadcrumb.btnLink && (
          <MDBFormInline className="mx-0 my-2">
            <Link
              to={breadcrumb.btnLink}
              className="btn m-0 bg-primary text-white"
            >
              <span>{breadcrumb.btnText}</span>
            </Link>
          </MDBFormInline>
        )}
      </MDBCardBody>
    </MDBCard>
  );
};

export default BreadcrumSection;
