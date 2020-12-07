import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import moment from "moment";

import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";

import { useFormInput } from "../utils/form-input.util";
import { useFormSelect } from "../utils/form-select.util";
import { userRegisterService } from "../services/user.service";
import BreadcrumSection from "./sections/breadcrumb.section";

import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

import logo from "./../assets/images/logo.png";

export default function UserRegister() {
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

  const role = useFormSelect("manager");
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
      <BreadcrumSection
        breadcrumb={{
          parentPath: "Users",
          parentLink: "/users",
          activePath: "Add New",
        }}
      />

      <Container>
        <h1 className="m-5 text-center">Add New User</h1>

        <Form autoComplete="off">
          <Row>
            <Col className="align-self-center text-center py-5">
              <img src={logo} width="auto" height="auto" alt="CleanAir" />
            </Col>
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
                        label="System Administrator"
                        checked={role.selected === "admin"}
                        {...role}
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
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      id="userName"
                      type="text"
                      {...name}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      id="userEmail"
                      type="text"
                      {...email}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      id="userPhone"
                      type="text"
                      {...phone}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      id="userPass"
                      type="password"
                      {...password}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      id="userPassConfirm"
                      type="password"
                      {...password_confirm}
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
