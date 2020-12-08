import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";

import { userGetService, userUpdateService } from "../services/user.service";
import {
  verifyTokenAsync,
  userLogoutAsync,
} from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";

import { useFormInput } from "../utils/form-input.util";
import { useFormSelect } from "../utils/form-select.util";

import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

import logo from "./../assets/images/logo.png";

export default function UserEdit() {
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

  const role = useFormSelect(user.role);
  const name = useFormInput(user.name);
  const email = useFormInput(user.email);
  const phone = useFormInput(user.phone);

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

      if (id === userId) {
        updateUser = {
          role: user.role,
          email: email.value,
          phone: phone.value,
          name: name.value,
        };
      } else {
        updateUser = {
          role: role.selected,
          email: email.value,
          phone: phone.value,
          name: name.value,
        };
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
            <Col className="align-self-center text-center py-5">
              <img src={logo} width="auto" height="auto" alt="CleanAir" />
            </Col>
            <Col>
              <Card className="shadow">
                <Card.Header
                  style={{ backgroundColor: "rgba(3, 169, 244, 0.6)" }}
                >
                  <h5 className="m-0">User Information</h5>
                </Card.Header>

                <Card.Body>
                  <Form.Group>
                    <Form.Label>Access</Form.Label>
                    <Col className="p-0">
                      <Form.Check
                        inline
                        className="mr-5"
                        type="radio"
                        name="role"
                        value="admin"
                        label="System Administrator"
                        checked={role.selected === "admin"}
                        {...role}
                        disabled={userId === id}
                      />
                      <Form.Check
                        inline
                        className="mr-5"
                        type="radio"
                        name="role"
                        value="manager"
                        checked={role.selected === "manager"}
                        label="Store Manager"
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
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" {...email} />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" {...phone} />
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
