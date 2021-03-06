import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "./assets/css/App.css";

import { verifyTokenAsync } from "./actions/auth-async.action";
import MainRouter from "./routes/router";

import BarLoader from "react-spinners/BarLoader";
import logo from "./assets/images/logo.png";

export default function App() {
  const auth_obj = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { authLoading } = auth_obj;

  useEffect(() => {
    dispatch(verifyTokenAsync());
  }, [dispatch]);

  if (authLoading) {
    return (
      <>
        <div className="vh-100 vw-100 d-flex justify-content-center">
          <BarLoader
            css="margin: auto;"
            size={100}
            color={"#007cc3"}
            loading={authLoading}
          />

          <div className="vw-100 d-flex justify-content-center position-absolute pt-5">
            <img
              className="mx-auto mt-auto"
              src={logo}
              alt="CleanAir Engineering"
              width="213"
              height="47"
            />
          </div>
        </div>
      </>
    );
  } else {
    return <MainRouter />;
  }
}
