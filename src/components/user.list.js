import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import { userGetListService } from "../services/user.service";
import {
  verifyTokenAsync,
  userLogoutAsync,
} from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { userDeleteService } from "../services/user.service";

import BreadcrumSection from "./sections/breadcrumb.section";

import { MdPhoneForwarded } from "react-icons/md";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

import { Container, Row, Card } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

export default function UserList() {
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

  const { userId } = auth_obj.user;
  const { username } = auth_obj.user;
  const [users, setUsers] = useState([]);
  const [deleteError, setDeleteError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await userGetListService();
      if (result.error) {
        dispatch(userLogoutAsync());
      } else {
        setUsers(result.data);
      }
      setPageLoading(false);
    }
    setPageLoading(true);
    fetchData();
  }, [dispatch]);

  const handleDelete = (_id) => {
    async function fetchData() {
      const result = await userDeleteService(_id);
      if (result.error) {
        setDeleteError(result.errMsg);
        setTimeout(() => {
          setDeleteError("");
        }, 3000);
      } else {
        setUsers(result.data);
      }
    }
    fetchData();
  };

  const User = (props) => (
    <tr>
      <td>
        <Link to={"/users/edit/" + props.user._id}>{props.user.name}</Link>
      </td>
      <td>{props.user.email}</td>
      <td>{props.user.phone}</td>
      <td>{props.user.role}</td>
      <td>
        {username !== props.user.email && (
          <>
            <a href={"tel:" + props.user.phone}>
              <MdPhoneForwarded className="text-info mx-1" />
            </a>{" "}
            <a href={"mailto:" + props.user.email}>
              <FaEnvelopeOpenText className="text-primary mx-1" />
            </a>
          </>
        )}
        {!props.user.isAdmin && (
          <>
            <span onClick={() => handleDelete(props.user._id)}>
              {" "}
              <FaTrashAlt
                style={{ cursor: "pointer" }}
                className="text-danger mx-1"
              />
            </span>
          </>
        )}
      </td>
    </tr>
  );

  const userList = (users) => {
    if (pageLoading) {
      return (
        <tr>
          <td>
            <Container
              className="py-5 text-center"
              style={{ position: "absolute" }}
            >
              <ClipLoader
                css="margin: auto;"
                size={100}
                color={"#ff0000"}
                loading={pageLoading}
              />
            </Container>
          </td>
        </tr>
      );
    } else {
      return users.map(function (user, index) {
        if (user._id === userId) return null;
        const replace_obj = {};

        switch (user.role) {
          case "admin":
            replace_obj.role = "Administrator";
            break;
          default:
            replace_obj.role = "Manager";
            break;
        }

        return <User user={{ ...user, ...replace_obj }} key={index} />;
      });
    }
  };

  return (
    <>
      <BreadcrumSection
        breadcrumb={{
          parentPath: "",
          parentLink: "",
          activePath: "Users",
          btnLink: "/users/add",
          btnText: "Add New User",
        }}
      />

      <Container className="position-relative">
        <h1 className="m-5 text-center">All Users</h1>

        <Row>
          <Card className="w-100">
            <Table responsive className="m-0">
              <thead className="bg-success text-white">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Access</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>{userList(users)}</tbody>
            </Table>
          </Card>
        </Row>

        {deleteError !== "" && (
          <p className="float-right text-danger mx-4">{deleteError}</p>
        )}
      </Container>
    </>
  );
}
