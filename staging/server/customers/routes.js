const Controller = require("./controller");
const Authentication = require("../services/auth");

exports.routesConfig = function (app) {
  app.get("/admin/customers/total", [
    Authentication.authMiddleware,
    Controller.getTotal,
  ]);
  app.get("/admin/customers/page/:pageId", [
    Authentication.authMiddleware,
    Controller.getByPage,
  ]);
  app.get("/admin/customers/:_id", [
    Authentication.authMiddleware,
    Controller.getById,
  ]);
  app.get("/admin/customers/orders/:_id", [
    Authentication.authMiddleware,
    Controller.getOrdersById,
  ]);
  app.patch("/admin/customers/update/:_id", [
    Authentication.authMiddleware,
    Controller.editById,
  ]);
  app.delete("/admin/customers/delete/:_id", [
    Authentication.authMiddleware,
    Controller.deleteById,
  ]);
  app.post("/admin/customers/add", [
    Authentication.authMiddleware,
    Controller.add,
  ]);
  app.post("/admin/customers/search", [
    Authentication.authMiddleware,
    Controller.search,
  ]);
  app.get("/admin/customers/categories", [
    Authentication.authMiddleware,
    Controller.getCategories,
  ]);
  app.get("/admin/customers/tags", [
    Authentication.authMiddleware,
    Controller.getTags,
  ]);
  app.get("/admin/customers/attributes", [
    Authentication.authMiddleware,
    Controller.getTags,
  ]);
};
