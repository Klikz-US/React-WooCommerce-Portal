import React from "react";
import BarLoader from "react-spinners/BarLoader";

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
