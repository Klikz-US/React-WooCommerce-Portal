import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

import {
  verifyTokenAsync,
  userLogoutAsync,
} from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import {
  productGetListService,
  productDeleteService,
} from "../services/product.service";

import BreadcrumSection from "./sections/BreadcrumSection";
import { MdPhoneForwarded } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";

import { Container, Row, Card } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

import BarLoader from "react-spinners/BarLoader";
import { FcPlus } from "react-icons/fc";

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
  const [deleteError, setDeleteError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await productGetListService();
      if (result.error) {
        dispatch(userLogoutAsync());
      } else {
        setProducts(result.data);
      }
      setPageLoading(false);
    }
    setPageLoading(true);
    fetchData();
  }, [dispatch]);

  const handleDelete = (_id) => {
    async function fetchData() {
      const result = await productDeleteService(_id);
      if (result.error) {
        setDeleteError(result.errMsg);
        setTimeout(() => {
          setDeleteError("");
        }, 3000);
      } else {
        setProducts(result.data);
      }
    }
    fetchData();
  };

  const Product = (props) => (
    <tr>
      <td>{props.product.image}</td>
      <td>
        <Link to={"/products/edit/" + props.product._id}>
          {props.product.sku}
        </Link>
      </td>
      <td>{props.product.name}</td>
      <td>{props.product.price}</td>
      <td>{props.product.tags}</td>
      <td>
        <Link to={props.product.link}>
          <MdPhoneForwarded className="text-info mx-1" />
        </Link>
        <Link to={"products/edit/" + props.product._id}>
          <MdPhoneForwarded className="text-info mx-1" />
        </Link>
        <span onClick={() => handleDelete(props.user._id)}>
          {" "}
          <FaTrashAlt
            style={{ cursor: "pointer" }}
            className="text-danger mx-1"
          />
        </span>
      </td>
    </tr>
  );

  const productList = (products) => {
    if (pageLoading) {
      return (
        <tr>
          <td>
            <Container
              className="py-5 text-center"
              style={{ position: "absolute" }}
            >
              <BarLoader
                css="margin: auto;"
                size={100}
                color={"#007cc3"}
                loading={pageLoading}
              />
            </Container>
          </td>
        </tr>
      );
    } else {
      return products.map(function (product, index) {
        return <Product product={product} key={index} />;
      });
    }
  };

  return (
    <>
      <BreadcrumSection
        breadcrumb={{ parentPath: "", parentLink: "", activePath: "Products" }}
      />

      <Container className="position-relative">
        <h1 className="m-5 text-center">Products</h1>
        <div
          className="position-absolute"
          style={{ top: "10px", right: "20px" }}
        >
          <Link
            to="/products/add"
            className="btn p-0 m-0"
            style={{ borderRadius: "50%" }}
          >
            <FcPlus size="48" />
          </Link>
        </div>

        <Row>
          <Card className="w-100">
            <Table responsive className="m-0">
              <thead className="bg-success text-white">
                <tr>
                  <th>Image</th>
                  <th>SKU</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Tags</th>
                </tr>
              </thead>

              <tbody>{productList(products)}</tbody>
            </Table>
          </Card>
        </Row>

        {deleteError !== "" && (
          <p className="float-right text-danger mx-4">{deleteError}</p>
        )}
      </Container>
    </>
  );
}
