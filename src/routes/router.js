import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";

import PrivateRoute from "./private.route";
import PublicRoute from "./public.route";
import Navigation from "../components/navigation";
import Header from "../components/header";
import Footer from "../components/footer";
import Settings from "../components/settings.page";
import Login from "../components/login.page";
import UserAdd from "../components/user.add";
import UserList from "../components/user.list";
import UserEdit from "../components/user.edit";
import {
  InventoryEdit,
  InventoryList,
  InventoryRegister,
} from "../components/activity.module";
import Dashboard from "../components/dashboard.page";

export default function MainRouter() {
  const auth_obj = useSelector((state) => state.auth);

  const { isAuthenticated } = auth_obj;
  const { isAdmin } = auth_obj.user !== null ? auth_obj.user : false;

  return (
    <div id="content" className="d-flex flex-row">
      <Router>
        {isAuthenticated && (
          <div
            className="page-left shadow vh-100 bg-white navigation"
            style={{ width: "270px", position: "fixed", top: "0" }}
          >
            <Navigation />
          </div>
        )}

        <div
          className="page-right w-100"
          style={{ paddingLeft: isAuthenticated ? "270px" : "0" }}
        >
          {isAuthenticated && <Header />}
          <main className={isAuthenticated && "p-5"}>
            <Switch>
              <PrivateRoute
                path="/"
                exact
                component={Dashboard}
                isAuthenticated={isAuthenticated}
              />

              <PrivateRoute
                path="/users"
                exact
                component={UserList}
                isAuthenticated={isAuthenticated}
                isAdmin={isAdmin}
              />
              <PrivateRoute
                path="/users/add"
                exact
                component={UserAdd}
                isAuthenticated={isAuthenticated}
                isAdmin={isAdmin}
              />
              <PrivateRoute
                path="/users/edit/:id"
                exact
                component={UserEdit}
                isAuthenticated={isAuthenticated}
                isAdmin={isAdmin}
              />

              <PrivateRoute
                path="/inventories"
                exact
                component={InventoryList}
                isAuthenticated={isAuthenticated}
              />
              <PrivateRoute
                path="/inventories/add"
                exact
                component={InventoryRegister}
                isAuthenticated={isAuthenticated}
              />
              <PrivateRoute
                path="/inventories/edit/:id"
                exact
                component={InventoryEdit}
                isAuthenticated={isAuthenticated}
              />
              <PrivateRoute
                path="/inventories/dispense/:id"
                exact
                component={InventoryEdit}
                isAuthenticated={isAuthenticated}
              />
              <PrivateRoute
                path="/inventories/amend/:id"
                exact
                component={InventoryEdit}
                isAuthenticated={isAuthenticated}
              />

              <PrivateRoute
                path="/setting"
                exact
                component={Settings}
                isAuthenticated={isAuthenticated}
              />

              <PublicRoute
                path="/login"
                component={Login}
                isAuthenticated={isAuthenticated}
              />

              <Redirect to={isAuthenticated ? "/" : "/login"} />
            </Switch>
          </main>
          {isAuthenticated && <Footer />}
        </div>
      </Router>
    </div>
  );
}
