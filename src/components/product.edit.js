import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { FaEdit, FaRegSave, FaRegTrashAlt } from "react-icons/fa";
import { MdLiveHelp } from "react-icons/md";

import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";

import {
  productGetService,
  productUpdateService,
  productAllCategoriesService,
  productAllTagsService,
  productPhotoAddService,
} from "../services/product.service";

import BreadcrumSection from "./sections/breadcrumb.section";
import { useFormInput } from "../utils/form-input.util";
import { useFormSwitch } from "../utils/form-switch.util";
import { PageLoading } from "../utils/page-status.util";

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
    manage_stock: false,
    stock_status: "instock",
    stock_quantity: 0,
    dimensions: {
      height: "",
      length: "",
      width: "",
    },
    weight: "",
    tags: [],
    categories: [],
    attributes: [],
    images: [],
    description: "",
    noteToErin: "",
  });

  const history = useHistory();
  const [pageError, setPageError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [showThankyou, setShowThankyou] = useState(false);

  const sku = useFormInput(product.sku);
  const name = useFormInput(product.name);
  const price = useFormInput(product.price);
  const manage_stock = useFormSwitch(product.manage_stock);
  const stock_quantity = useFormInput(
    product.stock_quantity === null ? 0 : product.stock_quantity
  );
  const height = useFormInput(product.dimensions.height);
  const length = useFormInput(product.dimensions.length);
  const width = useFormInput(product.dimensions.width);
  const weight = useFormInput(product.weight);
  const description = useFormInput(product.description);
  const noteToErin = useFormInput(product.noteToErin);

  const [currentTags, setCurrentTags] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);

  const [allTags, setAllTags] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  const [showTagsForm, setShowTagsForm] = useState(false);
  const [showCategoriesForm, setShowCategoriesForm] = useState(false);

  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    async function fetchProductData() {
      setPageLoading(true);

      const productData = await productGetService(id);
      if (productData.error) {
        setPageError("Server Error! Please retry...");
      } else {
        console.log(productData.data);
        setProduct((product) => ({ ...product, ...productData.data }));
        setCurrentTags(productData.data.tags);
        setCurrentCategories(productData.data.categories);
        setProductImages(productData.data.images);
      }

      setPageLoading(false);
    }

    async function fetchAllTags() {
      const tags = await productAllTagsService();
      if (!tags.error) {
        setAllTags(tags.data);
      }
    }

    async function fetchAllCategories() {
      const categories = await productAllCategoriesService();
      if (!categories.error) {
        setAllCategories(categories.data);
      }
    }

    fetchProductData();
    fetchAllTags();
    fetchAllCategories();
  }, [dispatch, id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const product = {
      sku: sku.value,
      name: name.value,
      price: price.value,
      regular_price: price.value,
      manage_stock: manage_stock.checked,
      stock_status: manage_stock.checked
        ? stock_quantity.value > 0
          ? "instock"
          : "outofstock"
        : "onbackorder",
      stock_quantity: manage_stock.checked ? stock_quantity.value : null,
      dimensions: {
        height: height.value,
        length: length.value,
        width: width.value,
      },
      weight: weight.value,
      description: description.value,
      noteToErin: noteToErin.value,
      tags: currentTags,
      categories: currentCategories,
      images: productImages,
    };

    async function fetchData() {
      setPageLoading(true);
      console.log(product);
      const result = await productUpdateService(id, {
        ...product,
        auth_user: auth_obj.user,
      });
      if (result.error) {
        setPageError("Server Error! Please retry...");
      } else {
        setProduct((product) => ({ ...product, ...result.data }));
        setShowThankyou(true);
      }
      setPageLoading(false);
    }
    fetchData();
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
                    The product has been updated successfully.
                  </p>
                  <Link className="btn btn-primary" to="/products">
                    Product List
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
    history.push("/products");
  };

  const imageTrash = (index) => {
    let updatedImages = [];
    for (let i = 0; i < productImages.length; i++) {
      if (i !== index) {
        updatedImages.push(productImages[i]);
      }
    }

    setProductImages(updatedImages);
  };

  const imageList = (images) => {
    if (images !== undefined) {
      return images.map(function (image, index) {
        return (
          <Carousel.Item key={index} className="text-center h-100">
            <div className="h-100 d-flex justify-content-center align-items-center position-relative">
              <img
                src={image.preview ? image.preview : image.src}
                alt={image.alt ? image.alt : image.name}
                width="auto"
                height="auto"
                style={{
                  maxHeight: "400px",
                  maxWidth: "100%",
                }}
              />
            </div>
            <span
              className="position-absolute"
              style={{
                top: "10px",
                right: "10px",
                zIndex: "999",
                cursor: "pointer",
              }}
              onClick={() => imageTrash(index)}
            >
              <OverlayTrigger
                key="trashImage"
                placement="top"
                overlay={
                  <Tooltip id="tooltip-trashImage">Delete Image</Tooltip>
                }
              >
                <FaRegTrashAlt color="#FF3547" />
              </OverlayTrigger>
            </span>
          </Carousel.Item>
        );
      });
    }
  };

  const photoUpdate = (e) => {
    e.preventDefault();
    const today = new Date();

    let newUploadedImages = [];
    for (let i = 0; i < e.target.files.length; i++) {
      newUploadedImages.push(e.target.files[i]);
    }

    newUploadedImages.forEach((newUploadedImage) => {
      async function process() {
        const photoData = new FormData();
        photoData.append(
          "name",
          moment(today).format("HHmmss") + newUploadedImage.name
        );
        photoData.append("productPhotoData", newUploadedImage);

        setPageLoading(true);
        const result = await productPhotoAddService(photoData);
        if (result.error) {
          setPageError("Image Upload Error!");
        } else {
          setPageLoading(false);
        }
      }
      process();
    });

    let array = [];
    for (let i = 0; i < e.target.files.length; i++) {
      const photo = e.target.files[i];
      const photoPreviewURL = URL.createObjectURL(photo);
      const photoUploadURL =
        "https://cleanairportal.wpengine.com/wp-content/uploads/products/" +
        moment(today).format("HHmmss") +
        photo.name;
      array.push({
        name: moment(today).format("HHmmss") + photo.name,
        src: photoUploadURL,
        preview: photoPreviewURL,
      });
    }

    setProductImages([...array, ...productImages]);
  };

  const handleCategoryUpdate = (e) => {
    var checkedCategories = [];
    var checkedCheckboxes = document.getElementsByName("category");
    checkedCheckboxes.forEach((checkedCheckbox) => {
      if (checkedCheckbox.checked) {
        for (let i = 0; i < allCategories.length; i++) {
          if (
            allCategories[i].id.toString() === checkedCheckbox.value.toString()
          ) {
            checkedCategories.push(allCategories[i]);
            break;
          }
        }
      }
    });
    setCurrentCategories(checkedCategories);
  };

  const categoryList = () => {
    if (showCategoriesForm) {
      return allCategories.map(function (allCategory, index) {
        let checked = false;
        currentCategories.forEach((currentCategory) => {
          if (parseInt(allCategory.id) === parseInt(currentCategory.id)) {
            checked = true;
          }
        });

        return (
          <Form.Check
            className="mr-5"
            type="checkbox"
            name="category"
            value={allCategory.id}
            label={allCategory.name}
            checked={!!checked}
            onChange={handleCategoryUpdate}
            key={index}
          />
        );
      });
    } else {
      return currentCategories.map((currentCategory, index) => {
        return (
          <p className="mb-1" key={index}>
            {currentCategory.name}
          </p>
        );
      });
    }
  };

  const handleTagUpdate = (e) => {
    var checkedTags = [];
    var checkedCheckboxes = document.getElementsByName("tag");
    checkedCheckboxes.forEach((checkedCheckbox) => {
      if (checkedCheckbox.checked) {
        for (let i = 0; i < allTags.length; i++) {
          if (allTags[i].id.toString() === checkedCheckbox.value.toString()) {
            checkedTags.push(allTags[i]);
            break;
          }
        }
      }
    });
    setCurrentTags(checkedTags);
  };

  const tagList = () => {
    if (showTagsForm) {
      return allTags.map(function (allTag, index) {
        let checked = false;
        currentTags.forEach((currentTag) => {
          if (parseInt(allTag.id) === parseInt(currentTag.id)) {
            checked = true;
          }
        });

        return (
          <div
            className="mb-2"
            key={index}
            style={{
              order:
                allTag.name === "beyond-product"
                  ? "5"
                  : allTag.name === "buy-only"
                  ? "0"
                  : allTag.name === "buy-or-rent"
                  ? "2"
                  : allTag.name === "call-for-po"
                  ? "4"
                  : allTag.name === "dont-sell"
                  ? "3"
                  : allTag.name === "rental-only"
                  ? "1"
                  : "6",
            }}
          >
            <Form.Check
              className="mr-5"
              type="checkbox"
              name="tag"
              value={allTag.id}
              label={
                allTag.name === "beyond-product"
                  ? 'Add notification "Call 888-212-0890 for Inquiries."'
                  : allTag.name === "buy-only"
                  ? "Make a product to buy only"
                  : allTag.name === "buy-or-rent"
                  ? "Make a product to buy or rent"
                  : allTag.name === "call-for-po"
                  ? 'Add notification "Call 847-654-4680 Now for Purchase Options."'
                  : allTag.name === "dont-sell"
                  ? "Listed in sales but doesn't show the price."
                  : allTag.name === "rental-only"
                  ? "Make a product to rental only"
                  : ""
              }
              checked={!!checked}
              onChange={handleTagUpdate}
            />
          </div>
        );
      });
    } else {
      return currentTags.map((currentTag, index) => {
        return (
          <div
            className="mb-2"
            key={index}
            style={{
              order:
                currentTag.name === "beyond-product"
                  ? "5"
                  : currentTag.name === "buy-only"
                  ? "0"
                  : currentTag.name === "buy-or-rent"
                  ? "2"
                  : currentTag.name === "call-for-po"
                  ? "4"
                  : currentTag.name === "dont-sell"
                  ? "3"
                  : currentTag.name === "rental-only"
                  ? "1"
                  : "6",
            }}
          >
            <p className="mb-0">
              {currentTag.name === "beyond-product"
                ? 'Add notification "Call 888-212-0890 for Inquiries."'
                : currentTag.name === "buy-only"
                ? "Make a product to buy only"
                : currentTag.name === "buy-or-rent"
                ? "Make a product to buy or rent"
                : currentTag.name === "call-for-po"
                ? 'Add notification "Call 847-654-4680 Now for Purchase Options."'
                : currentTag.name === "dont-sell"
                ? "Listed in sales but doesn't show the price."
                : currentTag.name === "rental-only"
                ? "Make a product to rental only"
                : ""}
            </p>
          </div>
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
              <Card.Header className="bg-info text-white">
                <h5 className="m-0 text-center">Product Information</h5>
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
                    <Carousel
                      style={{
                        height: "400px",
                        border: "1px solid #ccc",
                        boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.15)",
                        padding: "10px",
                      }}
                      interval={null}
                    >
                      {imageList(productImages)}
                    </Carousel>

                    <Form.File custom>
                      <Form.File.Input
                        name="productPhoto"
                        onChange={photoUpdate}
                        multiple
                      />
                      <Form.File.Label data-browse="Upload">
                        Max. 512mb. Type: .jpg / .jpeg / .png / .gif
                      </Form.File.Label>
                    </Form.File>

                    <hr />

                    <Form.Label className="w-100 d-flex">
                      <span>Product Categories</span>
                      <span
                        className="ml-auto"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setShowCategoriesForm(!showCategoriesForm)
                        }
                      >
                        {showCategoriesForm ? (
                          <OverlayTrigger
                            key="saveCategories"
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-saveCategories">
                                Save Changes
                              </Tooltip>
                            }
                          >
                            <FaRegSave color="#33B5E5" />
                          </OverlayTrigger>
                        ) : (
                          <OverlayTrigger
                            key="editCategories"
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-editCategories">
                                Edit Categories
                              </Tooltip>
                            }
                          >
                            <FaEdit color="#FF3547" />
                          </OverlayTrigger>
                        )}
                      </span>
                    </Form.Label>
                    <div
                      style={{
                        overflowX: "hidden",
                        overflowY: "auto",
                        maxHeight: "500px",
                      }}
                    >
                      {categoryList()}
                    </div>

                    <hr />

                    <Form.Label className="w-100 d-flex">
                      <span>Product Types</span>

                      <span className="ml-2 mr-auto">
                        <OverlayTrigger
                          key="saveTags"
                          placement="top"
                          overlay={
                            <Tooltip id="tooltip-saveTags">
                              The option to make a product rental only, buy
                              only, or both. And to remove price from a product
                              or to add phone number below the add to cart
                              button.
                            </Tooltip>
                          }
                        >
                          <MdLiveHelp color="#33B5E5" />
                        </OverlayTrigger>
                      </span>

                      <span
                        className="ml-auto"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowTagsForm(!showTagsForm)}
                      >
                        {showTagsForm ? (
                          <OverlayTrigger
                            key="saveTags"
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-saveTags">
                                Save Changes
                              </Tooltip>
                            }
                          >
                            <FaRegSave color="#33B5E5" />
                          </OverlayTrigger>
                        ) : (
                          <OverlayTrigger
                            key="editTags"
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-editTags">
                                Edit Product Types
                              </Tooltip>
                            }
                          >
                            <FaEdit color="#FF3547" />
                          </OverlayTrigger>
                        )}
                      </span>
                    </Form.Label>

                    <div
                      className="d-flex flex-column"
                      style={{
                        overflowX: "hidden",
                        overflowY: "auto",
                        maxHeight: "500px",
                      }}
                    >
                      {tagList()}
                    </div>
                  </Col>

                  <Col lg={6}>
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
                        type="number"
                        {...price}
                      />
                    </Form.Group>

                    <hr />

                    <Form.Group>
                      <Form.Label>Inventory</Form.Label>
                      <Form.Check
                        type="switch"
                        id="track-inventory"
                        label="Manage Stock?"
                        {...manage_stock}
                      />
                    </Form.Group>

                    {manage_stock.checked && (
                      <Form.Group>
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                          id="stock_quantity"
                          name="stock_quantity"
                          type="number"
                          {...stock_quantity}
                        />
                      </Form.Group>
                    )}

                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Label>Height (cm)</Form.Label>
                        <Form.Control
                          id="height"
                          name="height"
                          type="number"
                          {...height}
                        />
                      </Form.Group>

                      <Form.Group as={Col}>
                        <Form.Label>Length (cm)</Form.Label>
                        <Form.Control
                          id="length"
                          name="length"
                          type="number"
                          {...length}
                        />
                      </Form.Group>

                      <Form.Group as={Col}>
                        <Form.Label>Width (cm)</Form.Label>
                        <Form.Control
                          id="width"
                          name="width"
                          type="number"
                          {...width}
                        />
                      </Form.Group>
                    </Form.Row>

                    <Form.Group>
                      <Form.Label>Weight (kg)</Form.Label>
                      <Form.Control
                        id="weight"
                        name="weight"
                        type="number"
                        {...weight}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        id="description"
                        name="description"
                        {...description}
                        style={{ height: "240px" }}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Note to Erin</Form.Label>
                      <Form.Control
                        as="textarea"
                        id="noteToErin"
                        name="noteToErin"
                        {...noteToErin}
                      />
                    </Form.Group>
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
