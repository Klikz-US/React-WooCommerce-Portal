import React from "react";
import {
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBRow,
  MDBCol,
} from "mdbreact";

const Shipping = (props) => (
  <tr>
    <td>{props.no + 1}</td>
    <td>{props.shipping.title}</td>
  </tr>
);

const listShipping = (shippings) => {
  return shippings.map((shipping, index) => {
    return <Shipping shipping={shipping} no={index} key={index} />;
  });
};

const Tax = (props) => (
  <tr>
    <td>{props.no + 1}</td>
    <td>{props.tax.name}</td>
    <td>{props.tax.city}</td>
    <td>{props.tax.state}</td>
    <td>{props.tax.postcode}</td>
    <td>{props.tax.country}</td>
    <td>{props.tax.rate}</td>
    <td>{props.tax.priority}</td>
  </tr>
);

const listTax = (taxes) => {
  return taxes.map((tax, index) => {
    return <Tax tax={tax} no={index} key={index} />;
  });
};

const TableSection = (props) => {
  return (
    <MDBRow className="mb-4">
      <MDBCol sm="12" md="4">
        <MDBCard>
          <MDBCardHeader style={{ backgroundColor: "rgba(3, 169, 244, 0.6)" }}>
            Available Shipping Methods
          </MDBCardHeader>
          <MDBCardBody>
            <MDBTable hover>
              <MDBTableHead color="blue-grey lighten-4">
                <tr>
                  <th>No.</th>
                  <th>Method Name</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>{listShipping(props.shipping)}</MDBTableBody>
            </MDBTable>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol sm="12" md="8" className="mb-4">
        <MDBCard>
          <MDBCardHeader style={{ backgroundColor: "rgba(3, 169, 244, 0.6)" }}>
            Custom Tax Classes
          </MDBCardHeader>
          <MDBCardBody>
            <MDBTable hover>
              <MDBTableHead color="blue lighten-4">
                <tr>
                  <th>No.</th>
                  <th>Tax Name</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Postcode</th>
                  <th>Country</th>
                  <th>Rate</th>
                  <th>Priority</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>{listTax(props.tax)}</MDBTableBody>
            </MDBTable>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
};

export default TableSection;
