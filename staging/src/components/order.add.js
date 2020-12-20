import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import csc from "country-state-city";

import { useFormSelect } from "../utils/form-select.util";
import { useFormSwitch } from "../utils/form-switch.util";
import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { useFormInput } from "../utils/form-input.util";
import { orderAddService } from "../services/order.service";
import BreadcrumSection from "./sections/breadcrumb.section";
import { PageLoading } from "../utils/page-status.util";

export default function OrderAdd() {
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
  const [showThankyou, setShowThankyou] = useState(false);
  const [validated, setValidated] = useState(false);

  const payment_method = useFormSelect("helcimjs");
  const status = useFormSelect("pending");
  const billing_first_name = useFormInput("");
  const billing_last_name = useFormInput("");
  const billing_address_1 = useFormInput("");
  const billing_address_2 = useFormInput("");
  const billing_city = useFormInput("");
  const billing_state = useFormInput("");
  const billing_postcode = useFormInput("");
  const billing_country = useFormInput("US");
  const shipping_first_name = useFormInput("");
  const shipping_last_name = useFormInput("");
  const shipping_address_1 = useFormInput("");
  const shipping_address_2 = useFormInput("");
  const shipping_city = useFormInput("");
  const shipping_state = useFormInput("");
  const shipping_postcode = useFormInput("");
  const shipping_country = useFormInput("US");

  const sameAsShipping = useFormSwitch(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      const order = {
        payment_method: payment_method.selected,
        payment_method_title:
          payment_method.selected === "paypal"
            ? "PayPal"
            : payment_method.selected === "helcimjs"
            ? "Credit Card"
            : payment_method.selected === "gazchap_wc_purchaseordergateway"
            ? "Purchase Order"
            : "Net 30",
        status: status.selected,
        set_paid: true,
        shipping: {
          first_name: shipping_first_name.value,
          last_name: shipping_last_name.value,
          address_1: shipping_address_1.value,
          address_2: shipping_address_2.value,
          city: shipping_city.value,
          state: shipping_state.value,
          postcode: shipping_postcode.value,
          country: shipping_country.value,
        },
        billing: {
          first_name: sameAsShipping.checked
            ? shipping_first_name.value
            : billing_first_name.value,
          last_name: sameAsShipping.checked
            ? shipping_last_name.value
            : billing_last_name.value,
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
        line_items: [],
      };

      async function fetchData() {
        setPageLoading(true);
        await orderAddService({
          ...order,
          auth_user: auth_obj.user,
        });

        setShowThankyou(true);
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
            style={{
              zIndex: "1000",
              top: "0",
              left: "0",
              minHeight: "100vh",
            }}
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
                    The order has been created successfully.
                  </p>
                  <Link className="btn btn-primary" to="/orders">
                    Order List
                  </Link>

                  <Button
                    variant="white"
                    onClick={() => setShowThankyou(false)}
                  >
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

  const PageError = (props) => {
    return (
      <>
        {pageError && (
          <div
            className="position-absolute w-100 h-100"
            style={{
              zIndex: "1000",
              top: "0",
              left: "0",
              minHeight: "100vh",
            }}
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
    history.push("/orders");
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
          parentPath: "Orders",
          parentLink: "/orders",
          activePath: "New Order",
        }}
      />

      <Container>
        <h1 className="m-5 text-center">New Order</h1>

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
                <h5 className="m-0 text-center">Order Information</h5>
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
                      <Form.Label>Payment Method</Form.Label>
                      <Form.Check
                        className="mb-2"
                        type="radio"
                        name="helcimjs"
                        value="helcimjs"
                        label="Credit Card"
                        checked={payment_method.selected === "helcimjs"}
                        {...payment_method}
                      />
                      <Form.Check
                        className="mb-2"
                        type="radio"
                        name="paypal"
                        value="paypal"
                        label="PayPal"
                        checked={payment_method.selected === "paypal"}
                        {...payment_method}
                      />
                      <Form.Check
                        className="mb-2"
                        type="radio"
                        name="gazchap_wc_purchaseordergateway"
                        value="gazchap_wc_purchaseordergateway"
                        label="Purchase Order"
                        checked={
                          payment_method.selected ===
                          "gazchap_wc_purchaseordergateway"
                        }
                        {...payment_method}
                      />
                      <Form.Check
                        className="mb-2"
                        type="radio"
                        name="net30"
                        value="net30"
                        label="Net 30"
                        checked={payment_method.selected === "net30"}
                        {...payment_method}
                      />
                    </Form.Group>

                    <hr />

                    <Form.Group>
                      <Form.Label>Order Status</Form.Label>
                      <Form.Check
                        className="mb-2"
                        type="radio"
                        name="status"
                        value="pending"
                        label="Pending"
                        checked={status.selected === "pending"}
                        {...status}
                      />
                      <Form.Check
                        className="mb-2"
                        type="radio"
                        name="status"
                        value="on-hold"
                        label="On Hold"
                        checked={status.selected === "on-hold"}
                        {...status}
                      />
                      <Form.Check
                        className="mb-2"
                        type="radio"
                        name="status"
                        value="completed"
                        label="Completed"
                        checked={status.selected === "completed"}
                        {...status}
                      />
                      <Form.Check
                        className="mb-2"
                        type="radio"
                        name="status"
                        value="cancelled"
                        label="Cancelled"
                        checked={status.selected === "cancelled"}
                        {...status}
                      />
                      <Form.Check
                        className="mb-2"
                        type="radio"
                        name="status"
                        value="refunded"
                        label="Refunded"
                        checked={status.selected === "refunded"}
                        {...status}
                      />
                      <Form.Check
                        className="mb-2"
                        type="radio"
                        name="status"
                        value="failed"
                        label="Failed"
                        checked={status.selected === "failed"}
                        {...status}
                      />
                      <Form.Check
                        className="mb-2"
                        type="radio"
                        name="status"
                        value="trash"
                        label="Trash"
                        checked={status.selected === "trash"}
                        {...status}
                      />
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Label>Shipping Address</Form.Label>

                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Control
                          required
                          id="shipping_first_name"
                          name="shipping_first_name"
                          type="text"
                          {...shipping_first_name}
                          placeholder="First Name"
                        />
                        <Form.Control.Feedback type="invalid">
                          Please provide a valid first name
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group as={Col}>
                        <Form.Control
                          id="shipping_last_name"
                          name="shipping_last_name"
                          type="text"
                          {...shipping_last_name}
                          placeholder="Last Name"
                        />
                      </Form.Group>
                    </Form.Row>

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
                        <Form.Row>
                          <Form.Group as={Col}>
                            <Form.Control
                              required
                              id="billing_first_name"
                              name="billing_first_name"
                              type="text"
                              {...billing_first_name}
                              placeholder="First Name"
                            />
                            <Form.Control.Feedback type="invalid">
                              Please provide a valid first name.
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group as={Col}>
                            <Form.Control
                              id="billing_last_name"
                              name="billing_last_name"
                              type="text"
                              {...billing_last_name}
                              placeholder="Last Name"
                            />
                          </Form.Group>
                        </Form.Row>

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
                  Create Order
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
