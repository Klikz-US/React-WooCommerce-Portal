import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";

import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { useFormInput } from "../utils/form-input.util";
import {
  productGetService,
  productUpdateService,
} from "../services/product.service";
import BreadcrumSection from "./sections/breadcrumb.section";
import BarLoader from "react-spinners/BarLoader";

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
    price: "",
    dimensions: {
      height: "",
      length: "",
      width: "",
    },
    weight: "",
  });

  const history = useHistory();
  const [pageError, setPageError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  const sku = useFormInput(product.sku);
  const name = useFormInput(product.name);
  const price = useFormInput(product.price);
  const height = useFormInput(product.dimensions.height);
  const length = useFormInput(product.dimensions.length);
  const width = useFormInput(product.dimensions.width);
  const weight = useFormInput(product.weight);

  useEffect(() => {
    async function getData() {
      const productData = await productGetService(id);
      if (productData.error) {
        setPageError("Server Error! Please retry...");
      } else {
        setProduct((product) => ({ ...product, ...productData.data }));
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
      price: price.value,
      regular_price: price.value,
      dimensions: {
        height: height.value,
        length: length.value,
        width: width.value,
      },
      weight: weight.value,
    };

    async function fetchData() {
      setPageLoading(true);
      const result = await productUpdateService(id, {
        ...product,
        auth_user: auth_obj.user,
      });
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

  const imageList = (images) => {
    if (images !== undefined) {
      return images.map(function (image, index) {
        return (
          <Carousel.Item key={index} className="text-center h-100">
            <div className="h-100 d-flex justify-content-center align-items-center">
              <img
                src={image.src}
                alt={image.alt ? image.alt : image.name}
                width="auto"
                height="auto"
                style={{
                  maxHeight: "400px",
                  maxWidth: "100%",
                }}
              />
            </div>
          </Carousel.Item>
        );
      });
    }
  };

  const categoryList = (categories) => {
    if (categories !== undefined) {
      return categories.map(function (category, index) {
        return <p key={index}>{category.name}</p>;
      });
    }
  };

  const tagList = (tags) => {
    if (tags !== undefined) {
      return tags.map(function (tag, index) {
        return <p key={index}>{tag.name}</p>;
      });
    }
  };

  const attrList = (attributes) => {
    if (attributes !== undefined) {
      return attributes.map(function (attribute, index) {
        return (
          <div key={index}>
            <Row>
              <Col>{attribute.name}</Col>
              <Col>{optionList(attribute.options)}</Col>
            </Row>
          </div>
        );
      });
    }
  };

  const optionList = (options) => {
    if (options !== undefined) {
      return options.map(function (option, index) {
        return (
          <small key={index}>
            {index === 0 ? "" : ", "}
            {option}
          </small>
        );
      });
    }
  };

  return (
    <>
      <BreadcrumSection
        breadcrumb={{
          parentPath: "Products",
          parentLink: "/products",
          activePath: "Edit Product",
        }}
      />

      <Container>
        <h1 className="m-5 text-center">Edit Product</h1>

        <Form autoComplete="off">
          <Container>
            <Card className="h-100 shadow">
              <Card.Header className="bg-danger text-white">
                <h5 className="m-0 text-center">Product Information</h5>
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
                    <Carousel
                      style={{
                        height: "400px",
                        border: "1px solid #ccc",
                        boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.15)",
                        padding: "10px",
                      }}
                      interval={null}
                    >
                      {imageList(product.images)}
                    </Carousel>

                    <hr />

                    <Form.Label>Product Categories</Form.Label>
                    <div>{categoryList(product.categories)}</div>

                    <hr />

                    <Form.Label>Product Tags</Form.Label>
                    <div>{tagList(product.tags)}</div>
                  </Col>

                  <Col>
                    <Form.Label>Product Type</Form.Label>
                    <div>
                      <p className="text-capitalize">{product.type}</p>
                    </div>

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
                      <Form.Label>Price</Form.Label>
                      <Form.Control
                        id="price"
                        name="price"
                        type="text"
                        {...price}
                      />
                    </Form.Group>

                    <hr />

                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Label>Height</Form.Label>
                        <Form.Control
                          id="height"
                          name="height"
                          type="text"
                          {...height}
                        />
                      </Form.Group>

                      <Form.Group as={Col}>
                        <Form.Label>Length</Form.Label>
                        <Form.Control
                          id="length"
                          name="length"
                          type="text"
                          {...length}
                        />
                      </Form.Group>

                      <Form.Group as={Col}>
                        <Form.Label>Width</Form.Label>
                        <Form.Control
                          id="width"
                          name="width"
                          type="text"
                          {...width}
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Group>
                      <Form.Label>Weight</Form.Label>
                      <Form.Control
                        id="weight"
                        name="weight"
                        type="text"
                        {...weight}
                      />
                    </Form.Group>

                    <Form.Label>Product Options</Form.Label>
                    <div>{attrList(product.attributes)}</div>
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
