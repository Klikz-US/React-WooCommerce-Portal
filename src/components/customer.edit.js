import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import csc from "country-state-city";

import {
  verifyTokenAsync,
  userLogoutAsync,
} from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { useFormInput } from "../utils/form-input.util";
import { useFormSwitch } from "../utils/form-switch.util";
import {
  customerGetService,
  customerUpdateService,
} from "../services/customer.service";
import BreadcrumSection from "./sections/breadcrumb.section";
import { PageLoading } from "../utils/page-status.util";

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

  const { id } = useParams();
  const [customer, setCustomer] = useState({
    email: "",
    first_name: "",
    last_name: "",
    billing: {
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      postcode: "",
      country: "US",
    },
    shipping: {
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      postcode: "",
      country: "US",
    },
    shippingPreference: "fedex",
    shippingAccount: "",
  });

  const history = useHistory();
  const [pageError, setPageError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [showThankyou, setShowThankyou] = useState(false);
  const [validated, setValidated] = useState(false);

  const first_name = useFormInput(customer.first_name);
  const last_name = useFormInput(customer.last_name);
  const billing_address_1 = useFormInput(customer.billing.address_1);
  const billing_address_2 = useFormInput(customer.billing.address_2);
  const billing_city = useFormInput(customer.billing.city);
  const billing_state = useFormInput(customer.billing.state);
  const billing_postcode = useFormInput(customer.billing.postcode);
  const billing_country = useFormInput(customer.billing.country);
  const shipping_address_1 = useFormInput(customer.shipping.address_1);
  const shipping_address_2 = useFormInput(customer.shipping.address_2);
  const shipping_city = useFormInput(customer.shipping.city);
  const shipping_state = useFormInput(customer.shipping.state);
  const shipping_postcode = useFormInput(customer.shipping.postcode);
  const shipping_country = useFormInput(customer.shipping.country);

  const sameAsShipping = useFormSwitch(false);

  const shippingPreference = useFormInput(customer.shippingPreference);
  const shippingAccount = useFormInput(customer.shippingAccount);

  useEffect(() => {
    async function getData() {
      const customerData = await customerGetService(id);
      if (customerData.error) {
        dispatch(userLogoutAsync());
      } else {
        setCustomer((customer) => ({ ...customer, ...customerData.data }));
      }
      setPageLoading(false);
    }
    getData();
  }, [dispatch, id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      const customer = {
        first_name: first_name.value,
        last_name: last_name.value,
        shipping: {
          address_1: shipping_address_1.value,
          address_2: shipping_address_2.value,
          city: shipping_city.value,
          state: shipping_state.value,
          postcode: shipping_postcode.value,
          country: shipping_country.value,
        },
        billing: {
          address_1: sameAsShipping.checked
            ? shipping_address_1.value
            : billing_address_1.value,
          address_2: sameAsShipping.checked
            ? shipping_address_2.value
            : billing_address_2.value,
          city: sameAsShipping.checked
            ? shipping_city.value
            : billing_city.value,
          state: sameAsShipping.checked
            ? shipping_state.value
            : billing_state.value,
          postcode: sameAsShipping.checked
            ? shipping_postcode.value
            : billing_postcode.value,
          country: sameAsShipping.checked
            ? shipping_country.value
            : billing_country.value,
        },
        shippingPreference: shippingPreference.value,
        shippingAccount: shippingAccount.value,
      };

      async function fetchData() {
        setPageLoading(true);
        const result = await customerUpdateService(id, {
          ...customer,
          auth_user: auth_obj.user,
        });
        if (result.error) {
          setPageError("Server Error! Please retry...");
        } else {
          setCustomer((customer) => ({ ...customer, ...result.data }));
          setShowThankyou(true);
        }
        setPageLoading(false);
      }
      fetchData();
    }

    setValidated(true);
  };

  const ThankyouPopup = () => {
    return (
      <>
        {showThankyou && (
          <div
            className="position-absolute w-100 h-100"
            style={{ zIndex: "1000", top: "0", left: "0", minHeight: "100vh" }}
          >
            <div
              className="d-flex flex-column justify-content-center align-items-center w-100 h-100 px-3"
              style={{
                backgroundColor: "rgba(255, 255, 255, .8)",
              }}
            >
              <Card className="shadow" style={{ maxWidth: "500px" }}>
                <Card.Header className="bg-info text-white">
                  <h5 className="m-0 text-center">Sucess</h5>
                </Card.Header>

                <Card.Body>
                  <p className="text-muted">
                    The customer has been updated successfully.
                  </p>
                  <Link className="btn btn-primary" to="/customers">
                    Customer List
                  </Link>

                  <Button
                    variant="white"
                    onClick={() => setShowThankyou(false)}
                  >
                    Continue Editing
                  </Button>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}
      </>
    );
  };

  const PageError = (props) => {
    return (
      <>
        {pageError && (
          <div
            className="position-absolute w-100 h-100"
            style={{ zIndex: "1000", top: "0", left: "0", minHeight: "100vh" }}
          >
            <div
              className="d-flex flex-column justify-content-center align-items-center w-100 h-100 px-3"
              style={{
                backgroundColor: "rgba(255, 255, 255, .8)",
              }}
            >
              <Card className="shadow" style={{ maxWidth: "500px" }}>
                <Card.Header
                  style={{ backgroundColor: "rgba(3, 169, 244, 0.6)" }}
                >
                  <h5 className="m-0 text-center">Error</h5>
                </Card.Header>

                <Card.Body>
                  <p className="text-muted">{pageError}</p>

                  <Button variant="white" onClick={() => setPageError("")}>
                    Close
                  </Button>
                </Card.Body>
              </Card>
            </div>
          </div>
        )}
      </>
    );
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.push("/customers");
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

        <Form
          autoComplete="off"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <Container>
            <Card className="h-100 shadow">
              <Card.Header
                style={{ backgroundColor: "rgba(3, 169, 244, 0.6)" }}
              >
                <h5 className="m-0 text-center">Customer Information</h5>
              </Card.Header>
              <Card.Body>
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
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label>Customer Email</Form.Label>
                      <Form.Control
                        disabled={true}
                        id="email"
                        name="email"
                        type="email"
                        value={customer.email}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        required
                        id="first_name"
                        name="first_name"
                        type="text"
                        {...first_name}
                      />
                      <Form.Control.Feedback type="invalid">
                        Invalid first name.
                      </Form.Control.Feedback>
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

                    <hr />

                    <Form.Group>
                      <Form.Label>Shipping Method Preference</Form.Label>
                      <Form.Control
                        as="select"
                        id="shippingPreference"
                        name="shippingPreference"
                        {...shippingPreference}
                      >
                        <option value="fedex">Fedex</option>
                        <option value="ups">UPS</option>
                        <option value="local">Ship on account Number</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Shipping Account #</Form.Label>
                      <Form.Control
                        type="text"
                        id="shippingAccount"
                        name="shippingAccount"
                        {...shippingAccount}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Label>Shipping Address</Form.Label>

                    <Form.Group>
                      <Form.Control
                        required
                        id="shipping_address_1"
                        name="shipping_address_1"
                        type="text"
                        {...shipping_address_1}
                        placeholder="Street Address 1"
                      />
                      <Form.Control.Feedback type="invalid">
                        Invalid street address.
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                      <Form.Control
                        id="shipping_address_2"
                        name="shipping_address_2"
                        type="text"
                        {...shipping_address_2}
                        placeholder="Street Address 2"
                      />
                    </Form.Group>

                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Control
                          required
                          id="shipping_city"
                          name="shipping_city"
                          type="text"
                          {...shipping_city}
                          placeholder="City"
                        />
                        <Form.Control.Feedback type="invalid">
                          Invalid city name.
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col}>
                        <Form.Control
                          required
                          id="shipping_state"
                          name="shipping_state"
                          type="text"
                          {...shipping_state}
                          placeholder="State"
                        />
                        <Form.Control.Feedback type="invalid">
                          Invalid state name.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Form.Row>

                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Control
                          required
                          id="shipping_postcode"
                          name="shipping_postcode"
                          type="text"
                          {...shipping_postcode}
                          placeholder="Zip Code"
                        />
                        <Form.Control.Feedback type="invalid">
                          Invalid Zipcode.
                        </Form.Control.Feedback>
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

                    <hr />

                    <Form.Label>Billing Address</Form.Label>

                    <Form.Group>
                      <Form.Check
                        type="switch"
                        id="same-shipping"
                        label="Same as shipping address?"
                        {...sameAsShipping}
                      />
                    </Form.Group>

                    {!sameAsShipping.checked && (
                      <>
                        <Form.Group>
                          <Form.Control
                            required
                            id="billing_address_1"
                            name="billing_address_1"
                            type="text"
                            {...billing_address_1}
                            placeholder="Stree Address 1"
                          />
                          <Form.Control.Feedback type="invalid">
                            Invalid street address.
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                          <Form.Control
                            id="billing_address_2"
                            name="billing_address_2"
                            type="text"
                            {...billing_address_2}
                            placeholder="Stree Address 2"
                          />
                        </Form.Group>

                        <Form.Row>
                          <Form.Group as={Col}>
                            <Form.Control
                              required
                              id="billing_city"
                              name="billing_city"
                              type="text"
                              {...billing_city}
                              placeholder="City"
                            />
                            <Form.Control.Feedback type="invalid">
                              Invalid city name.
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group as={Col}>
                            <Form.Control
                              required
                              id="billing_state"
                              name="billing_state"
                              type="text"
                              {...billing_state}
                              placeholder="State"
                            />
                          </Form.Group>
                          <Form.Control.Feedback type="invalid">
                            Invalid state name.
                          </Form.Control.Feedback>
                        </Form.Row>

                        <Form.Row>
                          <Form.Group as={Col}>
                            <Form.Control
                              required
                              id="billing_postcode"
                              name="billing_postcode"
                              type="text"
                              {...billing_postcode}
                              placeholder="Zip Code"
                            />
                            <Form.Control.Feedback type="invalid">
                              Invalid Zipcode.
                            </Form.Control.Feedback>
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
                      </>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Row>
              <Col className="d-flex pt-5">
                <Button className="m-0 mr-2" variant="primary" type="submit">
                  Update
                </Button>

                <Button className="m-0" variant="white" onClick={handleCancel}>
                  Cancel
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </Container>

      <PageLoading pageLoading={pageLoading} />
      <PageError />
      <ThankyouPopup />
    </>
  );
}
