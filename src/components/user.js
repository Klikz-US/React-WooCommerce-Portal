import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";

import {
  userGetListService,
  userGetService,
  userUpdateService,
} from "../services/user.service";
import {
  verifyTokenAsync,
  userLogoutAsync,
} from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { userDeleteService } from "../services/user.service";

import { useFormInput } from "../utils/form-input.util";
import { useFormCheck } from "../utils/form-check.util";
import { userRegisterService } from "../services/user.service";

import { MdPhoneForwarded } from "react-icons/md";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

export function UserRegister() {
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

  const role = useFormCheck("vet");
  const name = useFormInput("");
  const email = useFormInput("");
  const phone = useFormInput("");
  const password = useFormInput("");
  const password_confirm = useFormInput("");

  const history = useHistory();
  const [formError, setFormError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.value === password_confirm.value) {
      async function fetchData() {
        const newUser = {
          role: role.selected,
          email: email.value,
          phone: phone.value,
          name: name.value,
          password: password.value,
        };
        newUser.isAdmin = newUser.role === "admin" ? true : false;
        const result = await userRegisterService(newUser);
        if (result.error) {
          setFormError(result.errMsg);
        } else {
          history.push("/users");
        }
      }
      fetchData();
    } else {
      setFormError("Password do not match");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.push("/users");
  };

  return (
    <>
      <Container>
        <h1 className="m-5 text-center">Add New User</h1>

        <Form autoComplete="off">
          <Row>
            <Col className="align-self-center"></Col>
            <Col>
              <Card className="shadow">
                <Card.Header className="bg-success text-white">
                  <h5 className="m-0">User Information</h5>
                </Card.Header>

                <Card.Body>
                  <Form.Group>
                    <Form.Label>Role</Form.Label>
                    <Col className="p-0">
                      <Form.Check
                        inline
                        className="mr-5"
                        type="radio"
                        name="role"
                        value="admin"
                        label="Administrator"
                        checked={role.selected === "admin"}
                        {...role}
                      />
                      <Form.Check
                        inline
                        className="mr-5"
                        type="radio"
                        name="role"
                        value="stuff"
                        checked={role.selected === "stuff"}
                        label="Stuff"
                        {...role}
                      />
                      <Form.Check
                        inline
                        className="mr-5"
                        type="radio"
                        name="role"
                        value="employee"
                        label="Employee"
                        checked={role.selected === "employee"}
                        {...role}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      id="userName"
                      type="text"
                      {...name}
                      placeholder="Enter Full Name"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      id="userEmail"
                      type="email"
                      {...email}
                      placeholder="Enter Email Address"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      id="userPhone"
                      type="text"
                      {...phone}
                      placeholder="Enter Phone Number"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      id="userPass"
                      type="password"
                      {...password}
                      placeholder="Enter Password"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      id="userPassConfirm"
                      type="password"
                      {...password_confirm}
                      placeholder="Enter Password Again"
                    />
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Button
                className="float-right mt-5"
                variant="outline-secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                className="float-right mr-2 mt-5"
                variant="primary"
                onClick={handleSubmit}
              >
                Add User
              </Button>

              {formError && (
                <Form.Text className="text-danger float-right mr-4">
                  {formError}
                </Form.Text>
              )}
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}

export function UserList() {
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
          case "stuff":
            replace_obj.role = "Stuff";
            break;
          default:
            replace_obj.role = "Employee";
            break;
        }

        return <User user={{ ...user, ...replace_obj }} key={index} />;
      });
    }
  };

  return (
    <>
      <Container>
        <h1 className="m-5 text-center">All Users</h1>

        <Row>
          <Table responsive>
            <thead className="bg-success text-white">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Manage</th>
              </tr>
            </thead>

            <tbody>{userList(users)}</tbody>
          </Table>
        </Row>

        {deleteError !== "" && (
          <p className="float-right text-danger mx-4">{deleteError}</p>
        )}
      </Container>
    </>
  );
}

export function UserEdit() {
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

  const { id } = useParams();
  const { userId } = auth_obj.user;
  const history = useHistory();
  const [formError, setFormError] = useState("");
  const [user, setUser] = useState({
    role: "",
    name: "",
    email: "",
    phone: "",
  });

  const role = useFormCheck(user.role);
  const name = useFormInput(user.name);
  const email = useFormInput(user.email);
  const phone = useFormInput(user.phone);
  const pass = useFormInput("");
  const pass_confirm = useFormInput("");

  useEffect(() => {
    async function getData() {
      const result = await userGetService(id);
      if (result.error) {
        dispatch(userLogoutAsync());
      } else {
        setUser(result.data);
      }
    }
    getData();
  }, [dispatch, id, setUser]);

  const handleSubmit = (e) => {
    e.preventDefault();

    async function fetchData() {
      let updateUser = {};
      if (pass.value !== pass_confirm.value) {
        setFormError("Re-enter the passwords!");
      } else {
        if (id === userId) {
          updateUser = {
            role: user.role,
            email: email.value,
            phone: phone.value,
            name: name.value,
            password: pass.value,
          };
        } else {
          updateUser = {
            role: role.selected,
            email: email.value,
            phone: phone.value,
            name: name.value,
            password: pass.value,
          };
        }
      }

      updateUser.isAdmin = updateUser.role === "admin" ? true : false;
      const result = await userUpdateService(id, updateUser);
      if (result.error) {
        setFormError(result.errMsg);
      } else {
        history.push("/users");
      }
    }
    fetchData();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.push("/users");
  };

  return (
    <>
      <Container>
        {userId === id && <h1 className="m-5 text-center">My Profile</h1>}
        {userId !== id && <h1 className="m-5 text-center">Edit User</h1>}

        <Form autoComplete="off">
          <Row>
            <Col className="align-self-center"></Col>
            <Col>
              <Card className="shadow">
                <Card.Header className="bg-success text-white">
                  <h5 className="m-0">User Information</h5>
                </Card.Header>

                <Card.Body>
                  <Form.Group>
                    <Form.Label>Role</Form.Label>
                    <Col className="p-0">
                      <Form.Check
                        inline
                        className="mr-5"
                        type="radio"
                        name="role"
                        value="admin"
                        label="STL Admin"
                        checked={role.selected === "admin"}
                        {...role}
                        disabled={userId === id}
                      />
                      <Form.Check
                        inline
                        className="mr-5"
                        type="radio"
                        name="role"
                        value="rep"
                        checked={role.selected === "rep"}
                        label="STL Representation"
                        {...role}
                        disabled={userId === id}
                      />
                      <Form.Check
                        inline
                        className="mr-5"
                        type="radio"
                        name="role"
                        value="vet"
                        label="Vet Practice"
                        checked={role.selected === "vet"}
                        {...role}
                        disabled={userId === id}
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      {...name}
                      placeholder="Enter Full Name"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      {...email}
                      placeholder="Enter Email Address"
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      {...phone}
                      placeholder="Enter Phone Number"
                    />
                  </Form.Group>

                  {id === userId && (
                    <>
                      <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          {...pass}
                          placeholder="Enter Password"
                        />
                      </Form.Group>

                      <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          {...pass_confirm}
                          placeholder="Enter Password Again"
                        />
                      </Form.Group>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Button
                className="float-right mt-5"
                variant="outline-secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                className="float-right mr-2 mt-5"
                variant="primary"
                onClick={handleSubmit}
              >
                Update
              </Button>

              {formError && (
                <Form.Text className="text-danger float-right mr-4">
                  {formError}
                </Form.Text>
              )}
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}
