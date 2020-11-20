import React from "react";
import { useHistory, Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Button } from "react-bootstrap";
import { FiLogOut, FiSettings } from "react-icons/fi";

import { userLogoutAsync } from "../actions/auth-async.action";

export default function Header() {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    dispatch(userLogoutAsync());
    history.push("/");
  };

  return (
    <header>
      <div className="ml-auto d-flex flex-row justify-content-end pr-4 bg-info">
        <Link to="/setting" className="d-block">
          <Button className="px-2" variant="info">
            <FiSettings size={24} className="text-white" />
          </Button>
        </Link>

        <Button className="px-2" variant="info" onClick={handleLogout}>
          <FiLogOut size={24} className="text-white" />
        </Button>
      </div>
    </header>
  );
}
