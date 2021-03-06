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
  app.get("/admin/products/:_id/variations", [
    Authentication.authMiddleware,
    Controller.getVariants,
  ]);
  app.patch("/admin/products/:_id/variations/update", [
    Authentication.authMiddleware,
    Controller.updateVariants,
  ]);
  app.post("/admin/products/:_id/variations/create", [
    Authentication.authMiddleware,
    Controller.createVariants,
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
  app.get("/admin/products/categories/all", [
    Authentication.authMiddleware,
    Controller.getCategories,
  ]);
  app.get("/admin/products/tags/all", [
    Authentication.authMiddleware,
    Controller.getAllTags,
  ]);
  app.get("/admin/products/attributes/all", [
    Authentication.authMiddleware,
    Controller.getAttributes,
  ]);
};
