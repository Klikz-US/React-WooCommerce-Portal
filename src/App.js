import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";

import "./assets/css/App.css";

import { verifyTokenAsync } from "./actions/auth-async.action";
import MainRouter from "./routes/router";

export default function App() {
  const auth_obj = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { authLoading } = auth_obj;

  useEffect(() => {
    dispatch(verifyTokenAsync());
  }, [dispatch]);

  if (authLoading) {
    return (
      <div className="vh-100 vw-100 d-flex justify-content-center">
        <ClipLoader
          css="margin: auto;"
          size={100}
          color={"#00ff00"}
          loading={authLoading}
        />
      </div>
    );
  } else {
    return <MainRouter />;
  }
}
