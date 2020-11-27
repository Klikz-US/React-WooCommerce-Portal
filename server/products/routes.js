const Controller = require("./controller");
const Authentication = require("../services/auth");

exports.routesConfig = function (app) {
  app.get("/admin/products/total", [
    Authentication.authMiddleware,
    Controller.getTotal,
  ]);
  app.get("/admin/products/page/:pageId", [
    Authentication.authMiddleware,
    Controller.getByPage,
  ]);
  app.get("/admin/products/:_id", [
    Authentication.authMiddleware,
    Controller.getById,
  ]);
  app.patch("/admin/products/update/:_id", [
    Authentication.authMiddleware,
    Controller.editById,
  ]);
  app.delete("/admin/products/delete/:_id", [
    Authentication.authMiddleware,
    Controller.deleteById,
  ]);
  app.post("/admin/products/add", [
    Authentication.authMiddleware,
    Controller.add,
  ]);
  app.post("/admin/products/search", [
    Authentication.authMiddleware,
    Controller.search,
  ]);
  app.get("/admin/products/categories", [
    Authentication.authMiddleware,
    Controller.getCategories,
  ]);
  app.get("/admin/products/tags", [
    Authentication.authMiddleware,
    Controller.getTags,
  ]);
  app.get("/admin/products/attributes", [
    Authentication.authMiddleware,
    Controller.getAttributes,
  ]);
};
