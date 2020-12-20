import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { Form, Button } from "react-bootstrap";

import { userLoginAsync } from "../actions/auth-async.action";
import { useFormInput } from "../utils/form-input.util";

import logo from "./../assets/images/logo.png";

export default function AccountLogin() {
  const auth_obj = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { loginLoading, loginError } = auth_obj;

  const email = useFormInput("");
  const password = useFormInput("");

  const handleLogin = () => {
    if (email.value !== "" && password.value !== "") {
      dispatch(userLoginAsync(email.value, password.value));
    }
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
      <div className="col"></div>

      <div className="col d-flex justify-content-center">
        <div className="card" style={{ width: "400px", margin: "auto" }}>
          <div className="card-header text-center">
            <Link to="/">
              <img src={logo} width="220" height="auto" alt="C2 Keep" />
            </Link>
          </div>
          <div className="card-body">
            <h3>Login</h3>
            <p className="pb-3">Continue to your portal account</p>

            <Form autoComplete="off">
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  autoComplete="off"
                  id="email"
                  type="email"
                  icon="envelope"
                  {...email}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  autoComplete="off"
                  id="password"
                  type="password"
                  {...password}
                />
              </Form.Group>

              <Button
                variant="primary"
                color="outline-info"
                onClick={handleLogin}
                disabled={loginLoading}
              >
                {loginLoading ? "Loading..." : "Login"}
              </Button>
              <a href="/pw-reset" className="ml-3">
                Forgot password?
              </a>
              {loginError && (
                <p className="text-danger">
                  Invalid username or password. Try again.
                </p>
              )}
            </Form>
          </div>
          <div className="card-footer text-right">
            <a
              href="https://www.cleanair.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mx-2"
            >
              www.cleanair.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
