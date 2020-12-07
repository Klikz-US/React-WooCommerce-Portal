import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Tooltip from "react-bootstrap/Tooltip";
import { FaSearch, FaTrashAlt, FaEye, FaEdit } from "react-icons/fa";
import { FcCancel } from "react-icons/fc";
import noImage from "../assets/images/no-image.png";

import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import {
  productGetTotal,
  productGetListService,
  productDeleteService,
  productSearchService,
} from "../services/product.service";

import BreadcrumSection from "./sections/breadcrumb.section";
import Pagination from "../utils/pagination.util";
import { useFormInput } from "../utils/form-input.util";
import { PageLoading } from "../utils/pop-up.util";

export default function ProductList() {
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

  const [products, setProducts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchValue = useFormInput("");
  const [hasResult, setHasResult] = useState(false);
  const [hasSearchError, setHasSearchError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function fetchTotal() {
      const productTotal = await productGetTotal();
      if (productTotal.error) {
        setPageError("Server Error! Please retry...");
      } else {
        let productTotalNum = 0;
        productTotal.data.forEach((total) => {
          productTotalNum += total.total;
        });
        setTotalPages(parseInt(productTotalNum / 20) + 1);
      }
    }
    async function fetchData() {
      const productList = await productGetListService(activePage);
      if (productList.error) {
        setPageError("Server Error! Please retry...");
      } else {
        setProducts(productList.data);
      }
      setPageLoading(false);
    }
    if (!hasResult) {
      setPageLoading(true);
      fetchTotal();
      fetchData();
    }
  }, [dispatch, activePage, hasResult]);

  const handleDelete = (_id) => {
    async function funcDelete() {
      setPageLoading(true);
      const result = await productDeleteService(_id);
      if (result.error) {
        setPageError("Delete Error! Please retry...");
        setTimeout(() => {
          setPageError("");
        }, 3000);
      } else {
        async function fetchTotal() {
          const productTotal = await productGetTotal();
          if (productTotal.error) {
            setPageError("Server Error! Please retry...");
          } else {
            let productTotalNum = 0;
            productTotal.data.forEach((total) => {
              productTotalNum += total.total;
            });
            setTotalPages(parseInt(productTotalNum / 20) + 1);
          }
        }
        async function fetchData() {
          const productList = await productGetListService(activePage);
          if (productList.error) {
            setPageError("Server Error! Please retry...");
          } else {
            setProducts(productList.data);
          }
          setPageLoading(false);
        }
        if (!hasResult) {
          fetchTotal();
          fetchData();
        }
      }
    }
    funcDelete();
  };

  const renderPhotoPopover = (product) => {
    return (
      <Popover id={product.sku} className="shadow">
        <Popover.Title as="h2" className="text-center text-dark bg-white">
          {product.name}
        </Popover.Title>
        <Popover.Content>
          <img
            src={product.images.length === 0 ? noImage : product.images[0].src}
            width="100%"
            height="auto"
            alt={product.name}
          />
        </Popover.Content>
      </Popover>
    );
  };

  const Product = (props) => (
    <tr>
      <td>
        <OverlayTrigger
          placement="left"
          delay={{ show: 250, hide: 400 }}
          overlay={renderPhotoPopover(props.product)}
        >
          <img
            src={
              props.product.images.length === 0
                ? noImage
                : props.product.images[0].src
            }
            width="80"
            height="auto"
            alt={props.product.name}
          />
        </OverlayTrigger>
      </td>
      <td>
        <Link to={"/products/edit/" + props.product.id}>
          {props.product.sku}
        </Link>
      </td>
      <td>{props.product.name}</td>
      <td>
        {props.product.price === "0" ? "Quote Only" : "$" + props.product.price}
      </td>
      <td>{props.product.type}</td>
      <td>
        {moment(new Date(props.product.date_modified)).format(
          "MMM DD, YYYY, hh:mm"
        )}
      </td>
      <td>
        <div className="d-flex flex-wrap">
          <a
            href={props.product.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="mr-3 mb-3"
            style={{ marginTop: "2px" }}
          >
            <OverlayTrigger
              key="preview"
              placement="top"
              overlay={<Tooltip id="tooltip-preview">Preview on Store</Tooltip>}
            >
              <FaEye size="26" />
            </OverlayTrigger>
          </a>

          <Link to={"products/edit/" + props.product.id} className="mr-3 mb-3">
            <OverlayTrigger
              key="edit"
              placement="top"
              overlay={<Tooltip id="tooltip-edit">Edit Product</Tooltip>}
            >
              <FaEdit size="24" />
            </OverlayTrigger>
          </Link>

          <OverlayTrigger
            key="delete"
            trigger="click"
            placement="left"
            overlay={
              <Popover id="popover-basic">
                <Popover.Title
                  as="h3"
                  className="text-danger font-weight-bold text-center"
                >
                  Are you sure?
                </Popover.Title>
                <Popover.Content className="text-center">
                  <Button
                    size="sm"
                    variant="primary"
                    className="text-center"
                    onClick={() => handleDelete(props.product.id)}
                  >
                    Yes!
                  </Button>
                </Popover.Content>
              </Popover>
            }
          >
            <FaTrashAlt
              size="24"
              className="text-danger"
              style={{ cursor: "pointer" }}
            />
          </OverlayTrigger>
        </div>
      </td>
    </tr>
  );

  const productList = (products) => {
    return products.map(function (product, index) {
      product.type = "";
      if (product.tags.length === 0) {
        product.type = "Sell";
      } else {
        product.tags.forEach((tag) => {
          switch (tag.slug) {
            case "rental-only":
              product.type === ""
                ? (product.type += "Rental")
                : (product.type += ", Rental");
              break;

            case "buy-only":
              product.type === ""
                ? (product.type += "Sell")
                : (product.type += ", Sell");
              break;

            case "buy-or-rent":
              product.type === ""
                ? (product.type += "Sell and Rent")
                : (product.type += ", Sell and Rent");
              break;

            case "dont-sell":
              product.type === ""
                ? (product.type += "Don't List Price")
                : (product.type += ", Don't List Price");
              break;

            case "call-for-po":
              product.type === ""
                ? (product.type += "Call for PO")
                : (product.type += ", Call for PO");
              break;

            case "beyond-product":
              product.type === ""
                ? (product.type += "Call for Inqueries")
                : (product.type += ", Call for Inqueries");
              break;

            default:
              break;
          }
        });
      }

      return <Product product={product} key={index} />;
    });
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();

    if (
      searchValue.value.trim() !== "" &&
      searchValue.value.trim().length > 2
    ) {
      async function fetchData() {
        setIsSearching(true);

        const searchReq = {
          value: searchValue.value.trim(),
        };

        const searchResult = await productSearchService(searchReq);
        if (searchResult.error) {
          setHasSearchError(true);
          setHasResult(false);
        } else {
          setHasSearchError(false);
          setHasResult(true);
          setProducts(searchResult.data);
        }

        setIsSearching(false);
      }
      fetchData();
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();

    setHasSearchError(false);
    setHasResult(false);
  };

  const pagination = () => {
    async function handleNextPage(activePage) {
      setActivePage(activePage);
    }

    return (
      <Pagination
        totalPages={totalPages}
        currentPage={activePage}
        onChange={handleNextPage}
      />
    );
  };

  return (
    <>
      <BreadcrumSection
        breadcrumb={{
          parentPath: "",
          parentLink: "",
          activePath: "Products",
          btnLink: "/products/add",
          btnText: "Add New Product",
        }}
      />

      <Container className="position-relative">
        <h1 className="m-5 text-center">Products</h1>

        <Row className="mt-4">
          <Col lg={6}>
            <Form>
              <Form.Group as={Row}>
                <Col md="5" className="pl-0 my-auto md-form">
                  <Form.Control
                    type="text"
                    {...searchValue}
                    className="px-2"
                    placeholder="Input at least 3 characters"
                  />
                </Col>

                <Col md="3" className="pl-0">
                  <Button
                    type="submit"
                    variant="outline-info"
                    className="float-left px-2 py-2"
                    disabled={isSearching}
                    onClick={handleSearch}
                  >
                    <FaSearch className="text-danger mx-1" />
                  </Button>
                  <Button
                    variant="outline-danger"
                    className="float-left px-2 py-2"
                    disabled={isSearching}
                    onClick={handleCancel}
                  >
                    <FcCancel className="text-info mx-1" />
                  </Button>
                </Col>
              </Form.Group>
            </Form>
          </Col>
          <Col className="px-0" lg={6}>
            {totalPages > 1 && !hasResult && !hasSearchError && pagination()}
          </Col>
        </Row>

        <Row>
          <Card className="w-100">
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
                <p className="mt-5 pt-5 text-danger text-center">{pageError}</p>
              </div>
            )}
            <Table responsive className="m-0">
              <thead className="bg-success text-white">
                <tr>
                  <th>Image</th>
                  <th>SKU</th>
                  <th style={{ width: "320px" }}>Product Name</th>
                  <th style={{ width: "140px" }}>Price</th>
                  <th style={{ width: "175px" }}>Product Type</th>
                  <th>Last Modified</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>{productList(products)}</tbody>
            </Table>
          </Card>
        </Row>
      </Container>

      <PageLoading pageLoading={pageLoading || isSearching} />
    </>
  );
}
