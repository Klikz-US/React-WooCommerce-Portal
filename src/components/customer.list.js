import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Tooltip from "react-bootstrap/Tooltip";
import { FaSearch, FaTrashAlt, FaEdit } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import { PageLoading } from "../utils/page-status.util";

import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import {
  customerGetTotal,
  customerGetListService,
  customerDeleteService,
  customerSearchService,
} from "../services/customer.service";

import BreadcrumSection from "./sections/breadcrumb.section";
import Pagination from "../utils/pagination.util";
import { useFormInput } from "../utils/form-input.util";

export default function CustomerList() {
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

  const [customers, setCustomers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchValue = useFormInput("");
  const [hasResult, setHasResult] = useState(false);
  const [hasSearchError, setHasSearchError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function fetchTotal() {
      const customerTotal = await customerGetTotal();
      if (customerTotal.error) {
        setPageError("Server Error! Please retry...");
      } else {
        let customerTotalNum = 0;
        customerTotal.data.forEach((total) => {
          customerTotalNum += total.total;
        });
        setTotalPages(parseInt(customerTotalNum / 20) + 1);
      }
    }
    async function fetchData() {
      const customerList = await customerGetListService(activePage);
      if (customerList.error) {
        setPageError("Server Error! Please retry...");
      } else {
        setCustomers(customerList.data);
      }
      setPageLoading(false);
    }
    if (!hasResult) {
      setPageLoading(true);
      fetchTotal();
      fetchData();
    }
  }, [dispatch, activePage, hasResult]);

  const handleDelete = (_id) => {
    async function funcDelete() {
      setPageLoading(true);
      const result = await customerDeleteService(_id);
      if (result.error) {
        setPageError("Delete Error! Please retry...");
        setTimeout(() => {
          setPageError("");
        }, 3000);
      } else {
        async function fetchTotal() {
          const customerTotal = await customerGetTotal();
          if (customerTotal.error) {
            setPageError("Server Error! Please retry...");
          } else {
            let customerTotalNum = 0;
            customerTotal.data.forEach((total) => {
              customerTotalNum += total.total;
            });
            setTotalPages(parseInt(customerTotalNum / 20) + 1);
          }
        }
        async function fetchData() {
          const customerList = await customerGetListService(activePage);
          if (customerList.error) {
            setPageError("Server Error! Please retry...");
          } else {
            setCustomers(customerList.data);
          }
          setPageLoading(false);
        }
        if (!hasResult) {
          fetchTotal();
          fetchData();
        }
      }
    }
    funcDelete();
  };

  const Customer = (props) => (
    <tr>
      <td>
        <Link to={"/customers/edit/" + props.customer.id}>
          {props.customer.email}
        </Link>
      </td>
      <td>
        {props.customer.first_name ? (
          props.customer.first_name
        ) : (
          <span className="text-muted text-light">Unset</span>
        )}
      </td>
      <td>
        {props.customer.last_name ? (
          props.customer.last_name
        ) : (
          <span className="text-muted text-light">Unset</span>
        )}
      </td>
      <td>
        {props.customer.billing.address_1} {props.customer.billing.address_2}
        {", "} {props.customer.billing.city}
        {", "}
        {props.customer.billing.state} {props.customer.billing.postcode}
        {", "}
        {props.customer.billing.country}
      </td>
      <td>
        {props.customer.shipping.address_1} {props.customer.shipping.address_2}
        {", "} {props.customer.shipping.city}
        {", "}
        {props.customer.shipping.state} {props.customer.shipping.postcode}
        {", "}
        {props.customer.shipping.country}
      </td>
      <td>
        {moment(new Date(props.customer.date_created)).format(
          "MMM DD, YYYY, hh:mm"
        )}
      </td>
      <td>
        <div className="d-flex flex-wrap">
          <Link
            to={"customers/edit/" + props.customer.id}
            className="mr-3 mb-3"
          >
            <OverlayTrigger
              key="edit"
              placement="top"
              overlay={<Tooltip id="tooltip-edit">Edit customer</Tooltip>}
            >
              <FaEdit size="24" />
            </OverlayTrigger>
          </Link>

          <OverlayTrigger
            key="delete"
            trigger="click"
            placement="left"
            overlay={
              <Popover id="popover-basic">
                <Popover.Title
                  as="h3"
                  className="text-danger font-weight-bold text-center"
                >
                  Are you sure?
                </Popover.Title>
                <Popover.Content className="text-center">
                  <Button
                    size="sm"
                    variant="primary"
                    className="text-center"
                    onClick={() => handleDelete(props.customer.id)}
                  >
                    Yes!
                  </Button>
                </Popover.Content>
              </Popover>
            }
          >
            <FaTrashAlt
              size="24"
              className="text-danger"
              style={{ cursor: "pointer" }}
            />
          </OverlayTrigger>
        </div>
      </td>
    </tr>
  );

  const customerList = (customers) => {
    return customers.map(function (customer, index) {
      return <Customer customer={customer} key={index} />;
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

        const searchResult = await customerSearchService(searchReq);
        if (searchResult.error) {
          setHasSearchError(true);
          setHasResult(false);
        } else {
          setHasSearchError(false);
          setHasResult(true);
          setCustomers(searchResult.data);
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
          activePath: "Customers",
          btnLink: "/customers/add",
          btnText: "Add New Customer",
        }}
      />

      <Container className="position-relative">
        <h1 className="m-5 text-center">Customers</h1>

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
            {pageError && (
              <div
                className="d-flex flex-column position-absolute w-100 h-100"
                style={{
                  top: "0",
                  left: "0",
                  backgroundColor: "rgba(255, 255, 255, .7)",
                  zIndex: "1",
                }}
              >
                <p className="mt-5 pt-5 text-danger text-center">{pageError}</p>
              </div>
            )}
            <Table responsive className="m-0">
              <thead className="bg-success text-white">
                <tr>
                  <th>Email</th>
                  <th style={{ width: "110px" }}>First Name</th>
                  <th style={{ width: "110px" }}>Last Name</th>
                  <th style={{ width: "220px" }}>Billing Address</th>
                  <th style={{ width: "220px" }}>Shipping Address</th>
                  <th style={{ width: "110px" }}>Created At</th>
                  <th style={{ width: "100px" }}>Action</th>
                </tr>
              </thead>

              <tbody>{customerList(customers)}</tbody>
            </Table>
          </Card>
        </Row>
      </Container>

      <PageLoading pageLoading={pageLoading || isSearching} />
    </>
  );
}
