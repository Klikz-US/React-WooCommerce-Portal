import React from "react";
import { MDBCard, MDBCardBody, MDBIcon, MDBRow, MDBCol } from "mdbreact";

const AdminCardSection2 = (props) => {
  var pre_sales = 0,
    post_sales = 0,
    diff_sales = "0.00",
    pre_customers = 0,
    post_customers = 0,
    diff_customers = "0.00",
    pre_orders = 0,
    post_orders = 0,
    diff_orders = "0.00";

  if (props.sales.length !== 0) {
    const totals = Object.values(props.sales[0].totals);

    for (let i = 0; i < totals.length; i++) {
      const total = totals[i];

      if (i < 30) {
        pre_sales += parseInt(total.sales);
        pre_customers += total.customers;
        pre_orders += total.orders;
      } else {
        post_sales += parseInt(total.sales);
        post_customers += total.customers;
        post_orders += total.orders;
      }
    }

    diff_sales =
      pre_sales === 0
        ? "0.00"
        : (((post_sales - pre_sales) / pre_sales) * 100).toFixed(2);
    diff_customers =
      pre_customers === 0
        ? "0.00"
        : (((post_customers - pre_customers) / pre_customers) * 100).toFixed(2);
    diff_orders =
      pre_orders === 0
        ? "0.00"
        : (((post_orders - pre_orders) / pre_orders) * 100).toFixed(2);
  }

  return (
    <MDBRow className="mb-4">
      <MDBCol xl="4" md="6" className="mb-3">
        <MDBCard color="primary-color" className="classic-admin-card">
          <MDBCardBody>
            <div className="float-right">
              <MDBIcon far icon="money-bill-alt" />
            </div>
            <p className="white-text">Monthly Sales</p>
            <h4>
              <strong>${post_sales}</strong>
            </h4>
          </MDBCardBody>
          <div className="progress">
            <div
              aria-valuemax="100"
              aria-valuemin="0"
              aria-valuenow={diff_sales}
              className="progress-bar bg grey darken-3"
              role="progressbar"
              style={{ width: diff_sales + "%" }}
            ></div>
          </div>
          <MDBCardBody>
            <p>
              {diff_sales < 0 ? "Worse" : "Better"} than previous month (
              {diff_sales}
              %)
            </p>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol xl="4" md="6" className="mb-3">
        <MDBCard color="warning-color" className="classic-admin-card">
          <MDBCardBody>
            <div className="float-right">
              <MDBIcon icon="chart-line" />
            </div>
            <p className="white-text">Monthly Customers</p>
            <h4>
              <strong>{post_customers}</strong>
            </h4>
          </MDBCardBody>
          <div className="progress">
            <div
              aria-valuemax="100"
              aria-valuemin="0"
              aria-valuenow="25"
              className="progress-bar bg grey darken-3"
              role="progressbar"
              style={{ width: "25%" }}
            ></div>
          </div>
          <MDBCardBody>
            <p>
              {diff_customers < 0 ? "Worse" : "Better"} than previous month (
              {diff_customers}
              %)
            </p>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol xl="4" md="6" className="mb-3">
        <MDBCard color="primary-color" className="classic-admin-card">
          <MDBCardBody>
            <div className="float-right">
              <MDBIcon icon="chart-pie" />
            </div>
            <p className="white-text">Monthly Orders</p>
            <h4>
              <strong>{post_orders}</strong>
            </h4>
          </MDBCardBody>
          <div className="progress">
            <div
              aria-valuemax="100"
              aria-valuemin="0"
              aria-valuenow="75"
              className="progress-bar bg grey darken-3"
              role="progressbar"
              style={{ width: "75%" }}
            ></div>
          </div>
          <MDBCardBody>
            <p>
              {diff_orders < 0 ? "Worse" : "Better"} than previous month (
              {diff_orders}
              %)
            </p>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
};

export default AdminCardSection2;
