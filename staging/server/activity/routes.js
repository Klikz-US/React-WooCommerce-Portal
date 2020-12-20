const Controller = require("./controller");
const Authentication = require("../services/auth");

exports.routesConfig = function (app) {
  app.get("/admin/activities/total", [
    Authentication.authMiddleware,
    Controller.getTotal,
  ]);
  app.get("/admin/activities/page/:pageId", [
    Authentication.authMiddleware,
    Controller.getByPage,
  ]);
  app.get("/admin/activities/:_id", [
    Authentication.authMiddleware,
    Controller.getById,
  ]);
  app.post("/admin/activities/search", [
    Authentication.authMiddleware,
    Controller.search,
  ]);
};
