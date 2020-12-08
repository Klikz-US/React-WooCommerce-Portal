import React from "react";
import { MDBCol, MDBCard, MDBCardBody, MDBCardHeader, MDBRow } from "mdbreact";
import { Line, Doughnut } from "react-chartjs-2";
import moment from "moment";

const ChartSection = (props) => {
  var salesDataLineLabel = [],
    salesDataLineData1 = [],
    salesDataLineData2 = [],
    productsDoughnutLabel = [],
    productsDoughnutData = [],
    customersDoughnutLabel = [],
    customersDoughnutData = [];

  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    salesDataLineLabel.push(
      moment(new Date().setDate(today.getDate() - i)).format("MM/DD")
    );
  }

  if (props.sales.length !== 0) {
    const totals = Object.values(props.sales[0].totals);

    for (let i = 0; i < totals.length; i++) {
      const total = totals[i];

      if (i < 30) {
        salesDataLineData2.push(total.sales);
      } else {
        salesDataLineData1.push(total.sales);
      }
    }
  }

  const salesDataLine = {
    labels: salesDataLineLabel,
    datasets: [
      {
        label: "Last Month",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "rgba(75,192,192,1)",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(75,192,192,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: salesDataLineData1,
      },
      {
        label: "Compare to previous dates",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(220,220,220,0.4)",
        borderColor: "rgba(220,220,220,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(220,220,220,1)",
        pointBackgroundColor: "rgba(220,220,220,1)",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(220,220,220,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: salesDataLineData2,
      },
    ],
  };

  if (props.products.length !== 0) {
    for (let i = 0; i < props.products.length; i++) {
      const product = props.products[i];
      productsDoughnutLabel.push(product.name);
      productsDoughnutData.push(product.total);
    }
  }

  if (props.customers.length !== 0) {
    for (let i = 0; i < props.customers.length; i++) {
      const product = props.customers[i];
      customersDoughnutLabel.push(product.name);
      customersDoughnutData.push(product.total);
    }
  }

  const productsDoughnut = {
    labels: productsDoughnutLabel,
    datasets: [
      {
        data: productsDoughnutData,
        backgroundColor: [
          "#F7464A",
          "#46BFBD",
          "#FDB45C",
          "#949FB1",
          "#4D5360",
        ],
        hoverBackgroundColor: [
          "#FF5A5E",
          "#5AD3D1",
          "#FFC870",
          "#A8B3C5",
          "#616774",
        ],
      },
    ],
  };

  const customersDoughnut = {
    labels: customersDoughnutLabel,
    datasets: [
      {
        data: customersDoughnutData,
        backgroundColor: [
          "#F7464A",
          "#46BFBD",
          "#FDB45C",
          "#949FB1",
          "#4D5360",
        ],
        hoverBackgroundColor: [
          "#FF5A5E",
          "#5AD3D1",
          "#FFC870",
          "#A8B3C5",
          "#616774",
        ],
      },
    ],
  };

  return (
    <MDBRow className="mb-4">
      <MDBCol md="12" className="mb-4">
        <MDBCard className="mb-4">
          <MDBCardHeader style={{ backgroundColor: "rgba(3, 169, 244, 0.6)" }}>
            Monthly Sales Overview
          </MDBCardHeader>
          <MDBCardBody>
            <Line data={salesDataLine} options={{ responsive: true }} />
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol md="12" lg="6" className="mb-4">
        <MDBCard className="mb-4">
          <MDBCardHeader style={{ backgroundColor: "rgba(3, 169, 244, 0.6)" }}>
            Products Overview
          </MDBCardHeader>
          <MDBCardBody>
            <Doughnut
              data={productsDoughnut}
              height={300}
              options={{ responsive: true }}
            />
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol md="12" lg="6" className="mb-4">
        <MDBCard className="mb-4">
          <MDBCardHeader style={{ backgroundColor: "rgba(3, 169, 244, 0.6)" }}>
            Customers Overview
          </MDBCardHeader>
          <MDBCardBody>
            <Doughnut
              data={customersDoughnut}
              height={300}
              options={{ responsive: true }}
            />
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
};

export default ChartSection;
