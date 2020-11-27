import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import csc from "country-state-city";

import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { useFormInput } from "../utils/form-input.util";
import { customerAddService } from "../services/customer.service";
import BreadcrumSection from "./sections/breadcrumb.section";
import BarLoader from "react-spinners/BarLoader";

export default function CustomerEdit() {
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

  const history = useHistory();
  const [pageError, setPageError] = useState("");
  const [pageLoading, setPageLoading] = useState(false);

  const email = useFormInput("");
  const first_name = useFormInput("");
  const last_name = useFormInput("");
  const billing_address_1 = useFormInput("");
  const billing_address_2 = useFormInput("");
  const billing_city = useFormInput("");
  const billing_state = useFormInput("");
  const billing_postcode = useFormInput("");
  const billing_country = useFormInput("");
  const shipping_address_1 = useFormInput("");
  const shipping_address_2 = useFormInput("");
  const shipping_city = useFormInput("");
  const shipping_state = useFormInput("");
  const shipping_postcode = useFormInput("");
  const shipping_country = useFormInput("");

  const customer = {
    email: email.value,
    first_name: first_name.value,
    last_name: last_name.value,
    billing: {
      address_1: billing_address_1.value,
      address_2: billing_address_2.value,
      city: billing_city.value,
      state: billing_state.value,
      postcode: billing_postcode.value,
      country: billing_country.value,
    },
    shipping: {
      address_1: shipping_address_1.value,
      address_2: shipping_address_2.value,
      city: shipping_city.value,
      state: shipping_state.value,
      postcode: shipping_postcode.value,
      country: shipping_country.value,
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    async function fetchData() {
      setPageLoading(true);
      const result = await customerAddService({
        ...customer,
        auth_user: auth_obj.user,
      });
      if (result.error) {
        setPageError("Server Error! Please retry...");
      } else {
        history.push("/customers");
      }
      setPageLoading(false);
    }
    fetchData();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.goBack();
  };

  const CountryOptions = (props) => (
    <option value={props.sortname}>{props.name}</option>
  );

  const listCountries = () => {
    return csc.getAllCountries().map(function (country, index) {
      return (
        <CountryOptions
          name={country.name}
          sortname={country.sortname}
          key={index}
        ></CountryOptions>
      );
    });
  };

  return (
    <>
      <BreadcrumSection
        breadcrumb={{
          parentPath: "Customers",
          parentLink: "/customers",
          activePath: "Edit Customer",
        }}
      />

      <Container>
        <h1 className="m-5 text-center">Edit Customer</h1>

        <Form autoComplete="off">
          <Container>
            <Card className="h-100 shadow">
              <Card.Header className="bg-danger text-white">
                <h5 className="m-0 text-center">Customer Information</h5>
              </Card.Header>
              <Card.Body>
                {pageLoading && (
                  <div
                    className="d-flex flex-column justify-content-center position-absolute w-100 h-100"
                    style={{
                      top: "0",
                      left: "0",
                      backgroundColor: "rgba(255, 255, 255, .7)",
                      zIndex: "1",
                    }}
                  >
                    <BarLoader
                      css="margin: auto;"
                      size={100}
                      color={"#007cc3"}
                      loading={pageLoading}
                    />
                  </div>
                )}

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
                    <p className="mt-5 pt-5 text-danger text-center">
                      {pageError}
                    </p>
                  </div>
                )}

                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Customer Email</Form.Label>
                      <Form.Control
                        id="email"
                        name="email"
                        type="email"
                        {...email}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        id="first_name"
                        name="first_name"
                        type="text"
                        {...first_name}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        id="last_name"
                        name="last_name"
                        type="text"
                        {...last_name}
                      />
                    </Form.Group>
                  </Col>

                  <Col>
                    <Form.Label>Shipping Address</Form.Label>
                    <Form.Group>
                      <Form.Control
                        id="shipping_address_1"
                        name="shipping_address_1"
                        type="text"
                        {...shipping_address_1}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Control
                        id="shipping_address_2"
                        name="shipping_address_2"
                        type="text"
                        {...shipping_address_2}
                      />
                    </Form.Group>

                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Control
                          id="shipping_city"
                          name="shipping_city"
                          type="text"
                          {...shipping_city}
                        />
                      </Form.Group>

                      <Form.Group as={Col}>
                        <Form.Control
                          id="shipping_state"
                          name="shipping_state"
                          type="text"
                          {...shipping_state}
                          placeholder="State"
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Control
                          id="shipping_postcode"
                          name="shipping_postcode"
                          type="text"
                          {...shipping_postcode}
                        />
                      </Form.Group>

                      <Form.Group as={Col}>
                        <Form.Control
                          id="shipping_country"
                          name="shipping_country"
                          as="select"
                          {...shipping_country}
                        >
                          {listCountries(shipping_country.value)}
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>

                    <Form.Label>Billing Address</Form.Label>
                    <Form.Group>
                      <Form.Control
                        id="billing_address_1"
                        name="billing_address_1"
                        type="text"
                        {...billing_address_1}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Control
                        id="billing_address_2"
                        name="billing_address_2"
                        type="text"
                        {...billing_address_2}
                      />
                    </Form.Group>

                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Control
                          id="billing_city"
                          name="billing_city"
                          type="text"
                          {...billing_city}
                        />
                      </Form.Group>

                      <Form.Group as={Col}>
                        <Form.Control
                          id="billing_state"
                          name="billing_state"
                          type="text"
                          {...billing_state}
                          placeholder="State"
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Control
                          id="billing_postcode"
                          name="billing_postcode"
                          type="text"
                          {...billing_postcode}
                        />
                      </Form.Group>

                      <Form.Group as={Col}>
                        <Form.Control
                          id="billing_country"
                          name="billing_country"
                          as="select"
                          {...billing_country}
                        >
                          {listCountries(billing_country.value)}
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

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
                  Update Customer
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </Container>
    </>
  );
}
