const Controller = require("./controller");
const Authentication = require("../services/auth");

exports.routesConfig = function (app) {
  app.get("/admin/orders/total", [
    Authentication.authMiddleware,
    Controller.getTotal,
  ]);
  app.get("/admin/orders/page/:pageId", [
    Authentication.authMiddleware,
    Controller.getByPage,
  ]);
  app.get("/admin/orders/:_id", [
    Authentication.authMiddleware,
    Controller.getById,
  ]);
  app.put("/admin/orders/update/:_id", [
    Authentication.authMiddleware,
    Controller.editById,
  ]);
  app.delete("/admin/orders/delete/:_id", [
    Authentication.authMiddleware,
    Controller.deleteById,
  ]);
  app.post("/admin/orders/add", [
    Authentication.authMiddleware,
    Controller.add,
  ]);
  app.post("/admin/orders/search", [
    Authentication.authMiddleware,
    Controller.search,
  ]);
};
