import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import csc from "country-state-city";

import { useFormSelect } from "../utils/form-select.util";
import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { useFormInput } from "../utils/form-input.util";
import { orderGetService, orderUpdateService } from "../services/order.service";
import BreadcrumSection from "./sections/breadcrumb.section";
import BarLoader from "react-spinners/BarLoader";

export default function OrderEdit() {
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
  const [order, setOrder] = useState({
    number: "",
  });

  const history = useHistory();
  const [pageError, setPageError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  const billing_address_1 = useFormInput(
    order.billing === undefined ? "" : order.billing.address_1
  );
  const billing_address_2 = useFormInput(
    order.billing === undefined ? "" : order.billing.address_2
  );
  const billing_city = useFormInput(
    order.billing === undefined ? "" : order.billing.city
  );
  const billing_state = useFormInput(
    order.billing === undefined ? "" : order.billing.state
  );
  const billing_postcode = useFormInput(
    order.billing === undefined ? "" : order.billing.postcode
  );
  const billing_country = useFormInput(
    order.billing === undefined ? "" : order.billing.country
  );
  const shipping_address_1 = useFormInput(
    order.shipping === undefined ? "" : order.shipping.address_1
  );
  const shipping_address_2 = useFormInput(
    order.shipping === undefined ? "" : order.shipping.address_2
  );
  const shipping_city = useFormInput(
    order.shipping === undefined ? "" : order.shipping.city
  );
  const shipping_state = useFormInput(
    order.shipping === undefined ? "" : order.shipping.state
  );
  const shipping_postcode = useFormInput(
    order.shipping === undefined ? "" : order.shipping.postcode
  );
  const shipping_country = useFormInput(
    order.shipping === undefined ? "" : order.shipping.country
  );

  const status = useFormSelect(
    order.status === undefined ? "processing" : order.status
  );

  useEffect(() => {
    async function getData() {
      const orderData = await orderGetService(id);
      if (orderData.error) {
        setPageError("Server Error! Please retry...");
      } else {
        setOrder(orderData.data);
        console.log(orderData.data);
      }
      setPageLoading(false);
    }
    getData();
  }, [dispatch, id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const order = {
      status: status.selected,
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

    async function fetchData() {
      setPageLoading(true);
      const result = await orderUpdateService(id, {
        ...order,
        auth_user: auth_obj.user,
      });
      if (result.error) {
        setPageError("Unable to update this order. Internal Server Error.");
      } else {
        setOrder((order) => ({ ...order, ...result.data }));
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
          parentPath: "Orders",
          parentLink: "/orders",
          activePath: "Edit Order",
        }}
      />

      <Container>
        <h1 className="m-5 text-center">Edit Order</h1>

        <Form autoComplete="off">
          <Container>
            <Card className="h-100 shadow">
              <Card.Header className="bg-danger text-white">
                <h5 className="m-0 text-center">Order Information</h5>
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
                  <Col lg={6}>
                    <Form.Group>
                      <Form.Label>Order Number</Form.Label>
                      <p>{order.number}</p>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Payment Method</Form.Label>
                      <p>{order.payment_method_title}</p>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Tax</Form.Label>
                      <p>{order.total_tax}</p>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Shipping</Form.Label>
                      <p>{order.shipping_total}</p>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Order Total</Form.Label>
                      <p>{order.total}</p>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Order Status</Form.Label>
                      <Form.Check
                        className="mr-5"
                        type="radio"
                        name="status"
                        value="pending"
                        label="Pending"
                        checked={status.selected === "pending"}
                        {...status}
                      />
                      <Form.Check
                        className="mr-5"
                        type="radio"
                        name="status"
                        value="on-hold"
                        label="On Hold"
                        checked={status.selected === "on-hold"}
                        {...status}
                      />
                      <Form.Check
                        className="mr-5"
                        type="radio"
                        name="status"
                        value="completed"
                        label="Completed"
                        checked={status.selected === "completed"}
                        {...status}
                      />
                      <Form.Check
                        className="mr-5"
                        type="radio"
                        name="status"
                        value="cancelled"
                        label="Cancelled"
                        checked={status.selected === "cancelled"}
                        {...status}
                      />
                      <Form.Check
                        className="mr-5"
                        type="radio"
                        name="status"
                        value="refunded"
                        label="Refunded"
                        checked={status.selected === "refunded"}
                        {...status}
                      />
                      <Form.Check
                        className="mr-5"
                        type="radio"
                        name="status"
                        value="failed"
                        label="Failed"
                        checked={status.selected === "failed"}
                        {...status}
                      />
                      <Form.Check
                        className="mr-5"
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

                    <hr />

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
              <Col className="d-flex pt-5">
                <Button
                  className="m-0 mr-2"
                  variant="primary"
                  onClick={handleSubmit}
                >
                  Update
                </Button>

                <Button
                  className="m-0"
                  variant="outline-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </Container>
    </>
  );
}