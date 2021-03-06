import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { PageLoading } from "../utils/page-status.util";

import {
  verifyTokenAsync,
  userLogoutAsync,
} from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import {
  orderGetTotal,
  orderGetListService,
  orderSearchService,
} from "../services/order.service";

import BreadcrumSection from "./sections/breadcrumb.section";
import Pagination from "../utils/pagination.util";
import { useFormInput } from "../utils/form-input.util";
import { convertArrayToObject } from "../utils/custom-functions.util";

export default function OrderList() {
  /*
   * Private Page Token Verification Module.
   */
  const auth_obj = useSelector((state) => state.auth);
  const { token, expiredAt } = auth_obj;
  const dispatch = useDispatch();
  useEffect(() => {
    setAuthToken(token);
    const verifyTokenTimer = setTimeout(() => {
      dispatch(verifyTokenAsync(true));
    }, moment(expiredAt).diff() - 10 * 1000);
    return () => {
      clearTimeout(verifyTokenTimer);
    };
  }, [expiredAt, token, dispatch]);
  /* ----------------------- */

  const [orders, setOrders] = useState([]);

  const [pageLoading, setPageLoading] = useState(true);

  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchValue = useFormInput("");
  const [hasResult, setHasResult] = useState(false);
  const [hasSearchError, setHasSearchError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function fetchTotal() {
      const orderTotal = await orderGetTotal();
      if (orderTotal.error) {
        dispatch(userLogoutAsync());
      } else {
        let orderTotalNum = 0;
        orderTotal.data.forEach((total) => {
          orderTotalNum += total.total;
        });
        setTotalPages(parseInt(orderTotalNum / 20) + 1);
      }
    }
    async function fetchData() {
      const orderList = await orderGetListService(activePage);
      if (orderList.error) {
        dispatch(userLogoutAsync());
      } else {
        setOrders(orderList.data);
      }
      setPageLoading(false);
    }
    if (!hasResult) {
      setPageLoading(true);
      fetchTotal();
      fetchData();
    }
  }, [dispatch, activePage, hasResult]);

  const Order = (props) => (
    <tr>
      <td>
        <Link to={`/orders/edit/${props.order.number}`}>
          {props.order.number}
        </Link>
      </td>
      <td>
        {props.order.customer_id === 0 ? (
          "Guest"
        ) : (
          <Link
            to={"/customers/edit/" + props.order.customer_id}
            className="text-capitalize"
          >
            {props.order.shipping.first_name +
              " " +
              props.order.shipping.last_name}
          </Link>
        )}
      </td>
      <td className="text-capitalize">{props.order.status}</td>
      <td>${props.order.total}</td>
      <td>{props.order.payment_method_title}</td>
      <td>
        {props.order.shipping.company}
        {props.order.shipping.company ? ", " : ""}
        {props.order.shipping.company && <br />}
        {props.order.shipping.address_1} {props.order.shipping.address_2}
        {", "} {props.order.shipping.city}
        {", "}
        {props.order.shipping.state} {props.order.shipping.postcode}
        {", "}
        {props.order.shipping.country}
      </td>
      <td>
        {props.shippingTrack && (
          <>
            <p className="mb-0 text-capitalize">
              {props.shippingTrack.value[0].tracking_provider === "fedex"
                ? "Fedex"
                : props.shippingTrack.value[0].tracking_provider === "ups"
                ? "UPS"
                : props.shippingTrack.value[0].tracking_provider}
            </p>
            <a
              href={
                props.shippingTrack.value[0].tracking_provider === "fedex"
                  ? `http://www.fedex.com/Tracking?action=track&tracknumbers=${props.shippingTrack.value[0].tracking_number}`
                  : `http://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=${props.shippingTrack.value[0].tracking_number}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {props.shippingTrack.value[0].tracking_number}
            </a>
          </>
        )}
      </td>
      <td>
        {moment(new Date(props.order.date_created)).format("MMM D, YYYY")}
      </td>
    </tr>
  );

  const orderList = (orders) => {
    return orders.map(function (order, index) {
      const order_meta = convertArrayToObject(order.meta_data, "key");
      return (
        <Order
          order={order}
          shippingTrack={order_meta._wc_shipment_tracking_items}
          key={index}
        />
      );
    });
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();

    if (
      searchValue.value.trim() !== "" &&
      searchValue.value.trim().length > 2
    ) {
      async function fetchData() {
        setIsSearching(true);

        const searchReq = {
          value: searchValue.value.trim(),
        };

        const searchResult = await orderSearchService(searchReq);
        if (searchResult.error) {
          setHasSearchError(true);
          setHasResult(false);
        } else {
          setHasSearchError(false);
          setHasResult(true);
          setOrders(searchResult.data);
        }

        setIsSearching(false);
      }
      fetchData();
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();

    setHasSearchError(false);
    setHasResult(false);
  };

  const pagination = () => {
    async function handleNextPage(activePage) {
      setActivePage(activePage);
    }

    return (
      <Pagination
        totalPages={totalPages}
        currentPage={activePage}
        onChange={handleNextPage}
      />
    );
  };

  return (
    <>
      <BreadcrumSection
        breadcrumb={{
          parentPath: "",
          parentLink: "",
          activePath: "Purchase Orders",
          btnLink: "/orders/add",
          btnText: "Add New Order",
        }}
      />

      <Container className="position-relative">
        <h1 className="m-5 text-center">Orders</h1>

        <Row className="mt-4">
          <Col lg={6}>
            <Form>
              <Form.Group as={Row}>
                <Col md="5" className="pl-0 my-auto md-form">
                  <Form.Control
                    type="text"
                    {...searchValue}
                    className="px-2"
                    placeholder="Input at least 3 characters"
                  />
                </Col>

                <Col md="3" className="pl-0">
                  <Button
                    type="submit"
                    variant="outline-info"
                    className="float-left px-2 py-2"
                    disabled={isSearching}
                    onClick={handleSearch}
                  >
                    <FaSearch className="text-danger mx-1" />
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="float-left px-2 py-2"
                    disabled={isSearching}
                    onClick={handleCancel}
                  >
                    <FcCancel className="text-info mx-1" />
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          </Col>
          <Col className="px-0" lg={6}>
            {totalPages > 1 && !hasResult && !hasSearchError && pagination()}
          </Col>
        </Row>

        <Row>
          <Card className="w-100">
            <Table responsive className="m-0">
              <thead style={{ backgroundColor: "rgba(3, 169, 244, 0.6)" }}>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th style={{ width: "200px" }}>Payment Method</th>
                  <th style={{ width: "220px" }}>Shipping Address</th>
                  <th style={{ width: "160px" }}>Shipment Tracking</th>
                  <th style={{ width: "120px" }}>Order Date</th>
                </tr>
              </thead>

              <tbody>{orderList(orders)}</tbody>
            </Table>
          </Card>
        </Row>
      </Container>

      <PageLoading pageLoading={pageLoading || isSearching} />
    </>
  );
}
