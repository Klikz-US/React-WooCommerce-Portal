import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
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
  purchaseProposalsGetListService,
  purchaseProposalsSearchService,
} from "../services/order.service";

import BreadcrumSection from "./sections/breadcrumb.section";
import Pagination from "../utils/pagination.util";
import { useFormInput } from "../utils/form-input.util";

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
    async function fetchData() {
      const orderList = await purchaseProposalsGetListService(activePage);
      if (orderList.error) {
        dispatch(userLogoutAsync());
      } else {
        setTotalPages(parseInt(orderList.data.total.total_count / 20) + 1);
        setOrders(orderList.data.total.entries);
      }
      setPageLoading(false);
    }
    if (!hasResult) {
      setPageLoading(true);
      fetchData();
    }
  }, [dispatch, activePage, hasResult]);

  const Order = (props) => (
    <tr>
      <td>{props.order["1.3"]}</td>
      <td>{props.order["1.6"]}</td>
      <td>{props.order["2"]}</td>
      <td>{props.order["4"]}</td>
      <td>{props.order["7"]}</td>
      <td>
        {props.order["6.1"]}
        {","}
        {props.order["6.3"]}
        {","}
        {props.order["6.4"]} {props.order["6.5"]}
        {","}
        {props.order["6.6"]}
      </td>
      <td>
        {moment(new Date(props.order.date_created)).format("MMM D, YYYY")}
      </td>
    </tr>
  );

  const orderList = (orders) => {
    return orders.map(function (order, index) {
      return <Order order={order} key={index} />;
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

        const searchResult = await purchaseProposalsSearchService(searchReq);
        if (searchResult.error) {
          setHasSearchError(true);
          setHasResult(false);
        } else {
          setHasSearchError(false);
          setHasResult(true);
          setOrders(searchResult.data.total.entries);
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
          activePath: "Purchase Proposals",
        }}
      />

      <Container className="position-relative">
        <h1 className="m-5 text-center">Purchase Proposals</h1>

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
                  <th style={{ width: "120px" }}>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th style={{ width: "150px" }}>Phone Number</th>
                  <th>Comments</th>
                  <th>Address</th>
                  <th style={{ width: "100px" }}>Date</th>
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
