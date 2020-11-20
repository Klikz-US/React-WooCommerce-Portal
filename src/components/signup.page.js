import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import moment from "moment";

import { userLoginAsync, verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";

import { useFormInput } from "../utils/form-input.util";
import { userRegisterService } from "../services/user.service";

import { Form, Button, Col } from "react-bootstrap";
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

  const name = useFormInput("");
  const email = useFormInput("");
  const phone = useFormInput("");
  const password = useFormInput("");
  const password_confirm = useFormInput("");

  const pharmacyName = useFormInput("");
  const pharmacyStreet1 = useFormInput("");
  const pharmacyStreet2 = useFormInput("");
  const pharmacyCity = useFormInput("");
  const pharmacyZip = useFormInput("");
  const pharmacyState = useFormInput("");

  const userNPI = useFormInput("");
  const pharmacyDEA = useFormInput("");

  const history = useHistory();
  const [formError, setFormError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.value === password_confirm.value) {
      async function fetchData() {
        const newUser = {
          role: "owner",
          email: email.value,
          phone: phone.value,
          name: name.value,
          password: password.value,
          pharmacyName: pharmacyName.value,
          pharmacyStreet1: pharmacyStreet1.value,
          pharmacyStreet2: pharmacyStreet2.value,
          pharmacyCity: pharmacyCity.value,
          pharmacyZip: pharmacyZip.value,
          pharmacyState: pharmacyState.value,
          userNPI: userNPI.value,
          pharmacyDEA: pharmacyDEA.value,
        };
        const result = await userRegisterService(newUser);
        if (result.error) {
          setFormError(result.errMsg);
        } else {
          dispatch(userLoginAsync(email.value, password.value));
        }
      }
      fetchData();
    } else {
      setFormError("Password do not match");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.push("/");
  };

  return (
    <div
      className="row vh-100 vw-100 m-0"
      style={{
        backgroundColor: "rgb(0, 128, 96)",
        backgroundImage: `url(
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='88' y1='88' x2='0' y2='0'%3E%3Cstop offset='0' stop-color='%23064e77'/%3E%3Cstop offset='1' stop-color='%230a7dbe'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='75' y1='76' x2='168' y2='160'%3E%3Cstop offset='0' stop-color='%238f8f8f'/%3E%3Cstop offset='0.09' stop-color='%23b3b3b3'/%3E%3Cstop offset='0.18' stop-color='%23c9c9c9'/%3E%3Cstop offset='0.31' stop-color='%23dbdbdb'/%3E%3Cstop offset='0.44' stop-color='%23e8e8e8'/%3E%3Cstop offset='0.59' stop-color='%23f2f2f2'/%3E%3Cstop offset='0.75' stop-color='%23fafafa'/%3E%3Cstop offset='1' stop-color='%23FFFFFF'/%3E%3C/linearGradient%3E%3Cfilter id='c' x='0' y='0' width='200%25' height='200%25'%3E%3CfeGaussianBlur in='SourceGraphic' stdDeviation='12' /%3E%3C/filter%3E%3C/defs%3E%3Cpolygon fill='url(%23a)' points='0 174 0 0 174 0'/%3E%3Cpath fill='%23000' fill-opacity='.5' filter='url(%23c)' d='M121.8 174C59.2 153.1 0 174 0 174s63.5-73.8 87-94c24.4-20.9 87-80 87-80S107.9 104.4 121.8 174z'/%3E%3Cpath fill='url(%23b)' d='M142.7 142.7C59.2 142.7 0 174 0 174s42-66.3 74.9-99.3S174 0 174 0S142.7 62.6 142.7 142.7z'/%3E%3C/svg%3E"
        )`,
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top left",
      }}
    >
      <div className="col-4"></div>

      <div className="col-8 d-flex justify-content-center">
        <div
          className="card"
          style={{ width: "800px", maxWidth: "100%", margin: "auto" }}
        >
          <Form autoComplete="off">
            <div className="card shadow">
              <div className="card-header text-center">
                <Link to="/">
                  <img src={logo} width="150" height="auto" alt="C2 Keep" />
                </Link>
              </div>

              <div className="card-body">
                <div className="row">
                  <div className="col">
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        autoComplete="off"
                        id="userEmail"
                        name="userEmail"
                        type="email"
                        {...email}
                        required
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        autoComplete="off"
                        id="userName"
                        name="userName"
                        type="text"
                        {...name}
                        placeholder="Enter Full Name"
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        autoComplete="off"
                        id="userPhone"
                        name="userPhone"
                        type="text"
                        {...phone}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        autoComplete="off"
                        id="userPass"
                        name="userPass"
                        type="password"
                        {...password}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        id="userPassConfirm"
                        name="userPassConfirm"
                        type="password"
                        {...password_confirm}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>NPI</Form.Label>
                      <Form.Control
                        autoComplete="off"
                        id="userNPI"
                        name="userNPI"
                        type="text"
                        {...userNPI}
                        placeholder="Input 10 digit of your NPI number"
                      />
                    </Form.Group>
                  </div>

                  <div className="col border-left">
                    <Form.Group>
                      <Form.Label>Pharmacy Name</Form.Label>
                      <Form.Control
                        autoComplete="off"
                        id="pharmacyName"
                        name="pharmacyName"
                        type="text"
                        {...pharmacyName}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Street Address</Form.Label>
                      <Form.Control
                        autoComplete="off"
                        id="pharmacyStreet1"
                        name="pharmacyStreet1"
                        type="text"
                        {...pharmacyStreet1}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Apartment, studio, or floor</Form.Label>
                      <Form.Control
                        autoComplete="off"
                        id="pharmacyStreet2"
                        name="pharmacyStreet2"
                        type="text"
                        {...pharmacyStreet2}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        autoComplete="off"
                        id="pharmacyCity"
                        name="pharmacyCity"
                        type="text"
                        {...pharmacyCity}
                      />{" "}
                    </Form.Group>

                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          autoComplete="off"
                          id="pharmacyState"
                          name="pharmacyState"
                          type="text"
                          {...pharmacyState}
                        />
                      </Form.Group>

                      <Form.Group as={Col}>
                        <Form.Label>Zip Code</Form.Label>
                        <Form.Control
                          autoComplete="off"
                          id="pharmacyZip"
                          name="pharmacyZip"
                          type="text"
                          {...pharmacyZip}
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Group>
                      <Form.Label>Pharmacy DEA ID</Form.Label>
                      <Form.Control
                        autoComplete="off"
                        id="pharmacyDEA"
                        name="pharmacyDEA"
                        type="text"
                        placeholder="FN5623740"
                        {...pharmacyDEA}
                      />
                    </Form.Group>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <Button variant="primary" onClick={handleSubmit}>
                  Register Now
                </Button>

                <Button
                  className="mr-2"
                  variant="outline-secondary"
                  onClick={handleCancel}
                >
                  Back to Home
                </Button>

                <span className="float-right mt-3 mr-4">
                  Already have a Shopify account? <Link to="/login">Login</Link>
                </span>

                {formError && <p className="text-danger mr-4">{formError}</p>}
              </div>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
