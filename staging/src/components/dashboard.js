import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { verifyTokenAsync } from "../actions/auth-async.action";
import { setAuthToken } from "../services/auth.service";
import moment from "moment";

import {
  reportGetSales,
  reportGetCustomers,
  reportGetProducts,
  reportGetTax,
  reportGetShipping,
} from "../services/report.service";

import AdminCardSection2 from "./sections/card.section";
import TableSection from "./sections/table.section";
import BreadcrumSection from "./sections/breadcrumb.section";
import ChartSection from "./sections/chart.section";
import { Container } from "react-bootstrap";

export default function Dashboard() {
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

  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [tax, setTax] = useState([]);
  const [shipping, setShipping] = useState([]);

  useEffect(() => {
    async function fetchSales() {
      const result = await reportGetSales();
      if (!result.error) {
        setSales(result.data);
      }
    }

    async function fetchCustomers() {
      const result = await reportGetCustomers();
      if (!result.error) {
        setCustomers(result.data);
      }
    }

    async function fetchProducts() {
      const result = await reportGetProducts();
      if (!result.error) {
        setProducts(result.data);
      }
    }

    async function fetchTax() {
      const result = await reportGetTax();
      if (!result.error) {
        setTax(result.data);
      }
    }

    async function fetchShipping() {
      const result = await reportGetShipping();
      if (!result.error) {
        setShipping(result.data);
      }
    }

    fetchSales();
    fetchCustomers();
    fetchProducts();
    fetchTax();
    fetchShipping();
  }, [dispatch]);

  return (
    <>
      <BreadcrumSection
        breadcrumb={{ parentPath: "", parentLink: "", activePath: "" }}
      />
      <Container>
        <AdminCardSection2 sales={sales} />
        <ChartSection sales={sales} products={products} customers={customers} />
        <TableSection tax={tax} shipping={shipping} />
      </Container>
    </>
  );
}
