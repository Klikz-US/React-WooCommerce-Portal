import React from "react";
import { Link } from "react-router-dom";

import { Card } from "react-bootstrap";
import BarLoader from "react-spinners/BarLoader";

export const ThankyouPopup = (props) => {
  return (
    <>
      {props.showThankyou && (
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
                <p className="text-muted">{props.thankyouText}</p>
                {props.okLink !== "" && (
                  <Link className="btn btn-primary" to={props.okLink}>
                    {props.okText}
                  </Link>
                )}

                {props.cancelLink !== "" && (
                  <a className="btn btn-white" href={props.cancelLink}>
                    {props.cancelText}
                  </a>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export const PageLoading = (props) => {
  return (
    <>
      {props.pageLoading && (
        <div
          className="position-absolute w-100 h-100"
          style={{ zIndex: "1000", top: "0", left: "0", minHeight: "100vh" }}
        >
          <div
            className="d-flex flex-column justify-content-center w-100 h-100"
            style={{
              backgroundColor: "rgba(255, 255, 255, .8)",
            }}
          >
            <BarLoader
              css="margin: auto;"
              size={100}
              color={"#007cc3"}
              loading={props.pageLoading}
            />
          </div>
        </div>
      )}
    </>
  );
};
