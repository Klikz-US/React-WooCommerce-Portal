import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { useFormInput } from "../utils/form-input.util";
import {
  productAddService,
  productAllCategoriesService,
  productAllTagsService,
  productAllAttributesService,
} from "../services/product.service";
import BreadcrumSection from "./sections/BreadcrumSection";
import BarLoader from "react-spinners/BarLoader";

export default function ProductAdd() {
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

  const [allCategories, setAllCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allAttributes, setAllAttributes] = useState([]);
  useEffect(() => {
    async function fetchData() {
      setPageLoading(true);
      const categories = await productAllCategoriesService();
      if (!categories.error) {
        setAllCategories(categories.data);
      }

      const tags = await productAllTagsService();
      if (!tags.error) {
        setAllTags(tags.data);
      }

      const attributes = await productAllAttributesService();
      if (!attributes.error) {
        setAllAttributes(attributes.data);
      }
      setPageLoading(false);
    }
    fetchData();
  }, [dispatch]);

  const [currentCategories, setCurrentCategories] = useState([]);
  const [currentTags, setCurrentTags] = useState([]);
  const [currentAttributes, setCurrentAttributes] = useState([]);
  const [hasOptions, setHasOptions] = useState(false);

  const history = useHistory();
  const [pageError, setPageError] = useState("");
  const [pageLoading, setPageLoading] = useState(false);
  const [productSuccess, setProductSuccess] = useState(false);

  const [productId, setProductId] = useState("");
  const sku = useFormInput("");
  const name = useFormInput("");
  const price = useFormInput("");
  const height = useFormInput("");
  const length = useFormInput("");
  const width = useFormInput("");
  const weight = useFormInput("");

  const product = {
    id: productId,
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
    status: "draft",
    categories: currentCategories,
    tags: currentTags,
    attributes: currentAttributes,
    type: hasOptions ? "variable" : "simple",
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    async function fetchData() {
      setPageLoading(true);
      const result = await productAddService(product);
      if (result.error) {
        setPageError("Server Error! Please retry...");
      } else {
        setProductId(result.data.id);
        setCurrentCategories(result.data.categories);
        setCurrentTags(result.data.tags);
        setCurrentAttributes(result.data.attributes);
        setProductSuccess(true);
      }
      setPageLoading(false);
    }
    fetchData();
  };

  const handleCategoryUpdate = (e) => {
    var checkedCategories = [];
    var checkedCheckboxes = document.getElementsByName("category");
    checkedCheckboxes.forEach((checkedCheckbox) => {
      if (checkedCheckbox.checked) {
        checkedCategories.push({ id: checkedCheckbox.value });
      }
    });
    setCurrentCategories(checkedCategories);
  };

  const handleTagUpdate = (e) => {
    var checkedTags = [];
    var checkedCheckboxes = document.getElementsByName("tag");
    checkedCheckboxes.forEach((checkedCheckbox) => {
      if (checkedCheckbox.checked) {
        checkedTags.push({ id: checkedCheckbox.value });
      }
    });
    setCurrentTags(checkedTags);
  };

  const handleAttributeUpdate = (e) => {
    var checkedAttributes = [];
    var checkedCheckboxes = document.getElementsByName("attribute");
    checkedCheckboxes.forEach((checkedCheckbox) => {
      if (checkedCheckbox.checked) {
        checkedAttributes.push({ id: checkedCheckbox.value });
      }
    });
    setCurrentAttributes(checkedAttributes);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.goBack();
  };

  const categoryList = (allCategories, categories) => {
    if (allCategories !== undefined) {
      return allCategories.map(function (category, index) {
        let checked = false;
        if (categories !== undefined) {
          categories.forEach((current_category) => {
            if (parseInt(category.id) === parseInt(current_category.id)) {
              checked = true;
            }
          });
        }
        return (
          <Form.Check
            className="mr-5 category"
            type="checkbox"
            name="category"
            value={category.id}
            label={category.name}
            checked={!!checked}
            onChange={handleCategoryUpdate}
            key={index}
          />
        );
      });
    }
  };

  const tagList = (allTags, tags) => {
    if (allTags !== undefined) {
      return allTags.map(function (tag, index) {
        let checked = false;
        if (tags !== undefined) {
          tags.forEach((current_tag) => {
            if (parseInt(tag.id) === parseInt(current_tag.id)) {
              checked = true;
            }
          });
        }
        return (
          <Form.Check
            className="mr-5 category"
            type="checkbox"
            name="tag"
            value={tag.id}
            label={tag.name}
            checked={!!checked}
            onChange={handleTagUpdate}
            key={index}
          />
        );
      });
    }
  };

  const attributeList = (allAttributes, attributes) => {
    if (allAttributes !== undefined) {
      return allAttributes.map(function (attribute, index) {
        let checked = false;
        if (attributes !== undefined) {
          attributes.forEach((current_attribute) => {
            if (parseInt(attribute.id) === parseInt(current_attribute.id)) {
              checked = true;
            }
          });
        }
        return (
          <div key={index}>
            <Form.Check
              className="mr-5 category"
              type="checkbox"
              name="attribute"
              value={attribute.id}
              label={attribute.name}
              checked={!!checked}
              onChange={handleAttributeUpdate}
            />
            {checked && <>{optionList(attribute.options)}</>}
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

  const handleHasOptionsChange = () => {
    setHasOptions(!hasOptions);
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
        <h1 className="m-5 text-center">Add Product</h1>

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

                {productSuccess && (
                  <div
                    className="d-flex flex-column position-absolute w-100 h-100"
                    style={{
                      top: "0",
                      left: "0",
                      backgroundColor: "rgba(255, 255, 255, .7)",
                      zIndex: "1",
                    }}
                  >
                    <div
                      className="mt-5 p-4 text-center bg-white shadow-lg"
                      style={{ width: "640px", margin: "auto" }}
                    >
                      <p>
                        The product has been created as a draft mode
                        successfully.
                      </p>
                      <Link
                        to={`/products/edit/${product.id}`}
                        className="btn bg-success text-white"
                      >
                        View Product
                      </Link>
                      <Button
                        onClick={() => setProductSuccess(false)}
                        className="btn"
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                )}

                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Product Categories</Form.Label>
                      {categoryList(allCategories, currentCategories)}
                    </Form.Group>

                    <hr />

                    <Form.Group>
                      <Form.Label>Product Tags</Form.Label>
                      {tagList(allTags, currentTags)}
                    </Form.Group>
                  </Col>

                  <Col>
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

                    <Form.Check
                      type="switch"
                      id="option"
                      label="Additional Product Options"
                      checked={hasOptions}
                      onChange={handleHasOptionsChange}
                    />

                    {hasOptions && (
                      <Form.Group>
                        {attributeList(allAttributes, currentAttributes)}
                      </Form.Group>
                    )}
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
                  Add Product
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      </Container>
    </>
  );
}
