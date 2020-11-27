import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import BarLoader from "react-spinners/BarLoader";

import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import {
  activityGetTotal,
  activityGetListService,
  activitySearchService,
} from "../services/activity.service";

import BreadcrumSection from "./sections/breadcrumb.section";
import Pagination from "../utils/pagination.util";
import { useFormInput } from "../utils/form-input.util";

export default function ActivityList() {
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

  const [activities, setActivities] = useState([]);
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
      const activityTotal = await activityGetTotal();
      if (activityTotal.error) {
        setPageError("Server Error! Please retry...");
      } else {
        setTotalPages(parseInt(activityTotal.data.count / 20) + 1);
      }
    }
    async function fetchData() {
      const activityList = await activityGetListService(activePage);
      if (activityList.error) {
        setPageError("Server Error! Please retry...");
      } else {
        setActivities(activityList.data);
      }
      setPageLoading(false);
    }
    if (!hasResult) {
      setPageLoading(true);
      fetchTotal();
      fetchData();
    }
  }, [dispatch, activePage, hasResult]);

  const Activity = (props) => (
    <tr>
      <td>
        {props.activity.user.username
          ? props.activity.user.username
          : props.activity.user.name
          ? props.activity.user.name
          : ""}
      </td>
      <td className="text-capitalize">{props.activity.type}</td>
      <td>
        {props.activity.action !== undefined && (
          <Link to={props.activity.action.link}>
            {props.activity.action.name}
          </Link>
        )}
      </td>
      <td>
        {moment(new Date(props.activity.created_at)).format(
          "MMM DD, YYYY, hh:mm"
        )}
      </td>
    </tr>
  );

  const activityList = (props) => {
    if (pageLoading || isSearching) {
      return (
        <tr>
          <td>
            <Container
              className="py-5 text-center"
              style={{ position: "absolute" }}
            >
              <BarLoader
                css="margin: auto;"
                size={100}
                color={"#007cc3"}
                loading={pageLoading || isSearching}
              />
            </Container>
          </td>
        </tr>
      );
    } else {
      return props.activities.map(function (activity, index) {
        return <Activity activity={activity} key={index} />;
      });
    }
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

        const searchResult = await activitySearchService(searchReq);
        if (searchResult.error) {
          setHasSearchError(true);
          setHasResult(false);
        } else {
          setHasSearchError(false);
          setHasResult(true);
          setActivities(searchResult.data);
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
          activePath: "Activities",
          btnLink: "/activities/add",
          btnText: "Add New Activity",
        }}
      />

      <Container className="position-relative">
        <h1 className="m-5 text-center">Activities</h1>

        <Row className="mt-4">
          <Col>
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
          <Col className="px-0">
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
                  <th>User</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>{activityList(activities)}</tbody>
            </Table>
          </Card>
        </Row>
      </Container>
    </>
  );
}
