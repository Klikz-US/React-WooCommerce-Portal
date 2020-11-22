import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { useFormInput } from "../utils/form-input.util";
import {
  productGetService,
  productUpdateService,
} from "../services/product.service";
import BreadcrumSection from "./sections/BreadcrumSection";
import BarLoader from "react-spinners/BarLoader";
import { useFormCheck } from "../utils/form-check.util";

export default function ProductEdit() {
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
  const [product, setProduct] = useState({
    sku: "",
    name: "",
    regular_price: "",
    sale_price: "",
    images: [],
    height: "",
    length: "",
    width: "",
    weight: "",
  });

  const history = useHistory();
  const [pageError, setPageError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  const sku = useFormInput(product.sku);
  const name = useFormInput(product.name);
  const regular_price = useFormInput(product.regular_price);
  const sale_price = useFormInput(product.sale_price);
  const height = useFormInput(product.height);
  const length = useFormInput(product.length);
  const width = useFormInput(product.width);
  const weight = useFormInput(product.weight);

  useEffect(() => {
    async function getData() {
      const productData = await productGetService(id);
      if (productData.error) {
        setPageError("Server Error! Please retry...");
      } else {
        setProduct((product) => ({ ...product, ...productData.data }));
        console.log(productData.data);
      }
      setPageLoading(false);
    }
    getData();
  }, [dispatch, id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const product = {
      sku: sku.value,
      name: name.value,
      regular_price: regular_price.value,
    };

    async function fetchData() {
      setPageLoading(true);
      const result = await productUpdateService(id, product);
      if (result.error) {
        setPageError("Server Error! Please retry...");
      } else {
        setProduct((product) => ({ ...product, ...result.data }));
      }
      setPageLoading(false);
    }
    fetchData();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.goBack();
  };

  return (
    <>
      <BreadcrumSection
        breadcrumb={{
          parentPath: "Products",
          parentLink: "/products",
          activePath: "Add New Product",
        }}
      />

      <Container>
        <h1 className="m-5 text-center">Update Product Information</h1>

        <Form autoComplete="off">
          <Container>
            <Row>
              <Col>
                <Card className="h-100 shadow">
                  <Card.Header className="bg-danger text-white">
                    <h5 className="m-0">Product Information</h5>
                  </Card.Header>
                  <Card.Body>
                    {pageLoading && (
                      <div
                        className="d-flex flex-column justify-content-center position-absolute w-100 h-100"
                        style={{
                          top: "0",
                          left: "0",
                          backgroundColor: "rgba(255, 255, 255, .7)",
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
                        }}
                      >
                        <p className="mt-5 pt-5 text-danger text-center">
                          {pageError}
                        </p>
                      </div>
                    )}

                    <Form.Group>
                      <Form.Label>Product SKU</Form.Label>
                      <Form.Control id="sku" name="sku" type="text" {...sku} />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Product Name</Form.Label>
                      <Form.Control
                        id="name"
                        name="name"
                        type="text"
                        {...name}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Product Price</Form.Label>
                      <Form.Control
                        id="price"
                        name="price"
                        type="text"
                        {...regular_price}
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
                  Update Product
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </Container>
    </>
  );
}
