import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
// import Image from "react-bootstrap/Image";

import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import { useFormInput } from "../utils/form-input.util";
import {
  productGetService,
  productUpdateService,
  productAllCategoriesService,
  productAllTagsService,
  productAllAttributesService,
  productPhotoAddService,
} from "../services/product.service";
import BreadcrumSection from "./sections/breadcrumb.section";
import BarLoader from "react-spinners/BarLoader";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FaEdit, FaRegSave, FaRegTrashAlt } from "react-icons/fa";

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
    tags: [],
    categories: [],
    attributes: [],
    images: [],
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

  const [currentTags, setCurrentTags] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [currentAttributes, setCurrentAttributes] = useState([]);

  const [allTags, setAllTags] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allAttributes, setAllAttributes] = useState([]);

  const [showTagsForm, setShowTagsForm] = useState(false);
  const [showCategoriesForm, setShowCategoriesForm] = useState(false);
  const [showAttributesForm, setShowAttributesForm] = useState(false);

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
        setCurrentAttributes(productData.data.attributes);
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

    async function fetchAllAttributes() {
      const attributes = await productAllAttributesService();
      if (!attributes.error) {
        setAllAttributes(attributes.data);
      }
    }

    fetchProductData();
    fetchAllTags();
    fetchAllCategories();
    fetchAllAttributes();
  }, [dispatch, id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    productImages.forEach((productImage) => {});

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
      tags: currentTags,
      categories: currentCategories,
      attributes: currentAttributes,
      images: productImages,
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
          console.log(result);
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
      console.log(allCategories);
      console.log(checkedCheckbox);
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
          <Form.Check
            className="mr-5"
            type="checkbox"
            name="tag"
            value={allTag.id}
            label={allTag.name}
            checked={!!checked}
            onChange={handleTagUpdate}
            key={index}
          />
        );
      });
    } else {
      return currentTags.map((currentTag, index) => {
        return (
          <div className="mb-2">
            <p key={index} className="mb-0">
              {currentTag.name}
            </p>
            <small className="text-muted">
              {currentTag.name === "beyond-product"
                ? 'Add notification "Call 888-212-0890 for Inquiries."'
                : currentTag.name === "buy-only"
                ? "Tag to make a product to buy only"
                : currentTag.name === "buy-or-rent"
                ? "Tag to make a product to buy or rent"
                : currentTag.name === "call-for-po"
                ? 'Add notification "Call 847-654-4680 Now for Purchase Options."'
                : currentTag.name === "dont-sell"
                ? "For products that listed on sale but doesn't show the price."
                : currentTag.name === "rental-only"
                ? "Tag to make a product to rental only"
                : ""}
            </small>
          </div>
        );
      });
    }
  };

  const handleAttributeUpdate = (e) => {
    var checkedAttributes = [];
    var checkedCheckboxes = document.getElementsByName("attribute");
    checkedCheckboxes.forEach((checkedCheckbox) => {
      if (checkedCheckbox.checked) {
        for (let i = 0; i < allAttributes.length; i++) {
          if (
            allAttributes[i].id.toString() === checkedCheckbox.value.toString()
          ) {
            checkedAttributes.push(allAttributes[i]);
            break;
          }
        }
      }
    });
    setCurrentAttributes(checkedAttributes);
  };

  const attrList = () => {
    if (showAttributesForm) {
      return allAttributes.map(function (allAttribute, index) {
        let checked = false;
        currentAttributes.forEach((currentAttribute) => {
          if (parseInt(allAttribute.id) === parseInt(currentAttribute.id)) {
            checked = true;
          }
        });

        return (
          <Form.Check
            className="mr-5"
            type="checkbox"
            name="attribute"
            value={allAttribute.id}
            label={allAttribute.name}
            checked={!!checked}
            onChange={handleAttributeUpdate}
            key={index}
          />
        );
      });
    } else {
      return currentAttributes.map(function (currentAttribute, index) {
        return (
          <div key={index} className="mb-2">
            <Row>
              <Col>
                <small style={{ backgroundColor: "#eeeeee" }}>
                  {currentAttribute.name}
                </small>
              </Col>
              <Col>{optionList(currentAttribute.options)}</Col>
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
              <Card.Header className="bg-info text-white">
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
                    <div>{categoryList(product.categories)}</div>

                    <hr />

                    <Form.Label className="w-100 d-flex">
                      <span>Product Tags</span>
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
                              <Tooltip id="tooltip-editTags">Edit Tags</Tooltip>
                            }
                          >
                            <FaEdit color="#FF3547" />
                          </OverlayTrigger>
                        )}
                      </span>
                    </Form.Label>
                    {tagList()}
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

                    <Form.Label>Product Type</Form.Label>
                    <div>
                      <p className="text-capitalize">{product.type}</p>
                    </div>

                    <Form.Label className="w-100 d-flex">
                      <span>Product Attributes</span>
                      <span
                        className="ml-auto"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setShowAttributesForm(!showAttributesForm)
                        }
                      >
                        {showAttributesForm ? (
                          <OverlayTrigger
                            key="saveAttr"
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-saveAttr">
                                Save Changes
                              </Tooltip>
                            }
                          >
                            <FaRegSave color="#33B5E5" />
                          </OverlayTrigger>
                        ) : (
                          <OverlayTrigger
                            key="editAttr"
                            placement="top"
                            overlay={
                              <Tooltip id="tooltip-editAttr">
                                Edit Attributes
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
                      {attrList()}
                    </div>
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
