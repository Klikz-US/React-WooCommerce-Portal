const Controller = require("./controller");
const Authentication = require("../services/auth");

exports.routesConfig = function (app) {
  app.get("/admin/activity/page/:pageId", [
    Authentication.authMiddleware,
    Controller.getByPage,
  ]);
  app.get("/admin/activity/:_id", [
    Authentication.authMiddleware,
    Controller.getById,
  ]);
  app.patch("/admin/activity/update/:_id", [
    Authentication.authMiddleware,
    Controller.editById,
  ]);
  app.delete("/admin/activity/delete/:_id", [
    Authentication.authMiddleware,
    Controller.deleteById,
  ]);
  app.post("/admin/activity/add", [
    Authentication.authMiddleware,
    Controller.register,
  ]);
  app.post("/admin/activity/search", [
    Authentication.authMiddleware,
    Controller.search,
  ]);
};
