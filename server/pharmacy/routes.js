const Controller = require("./controller");
const Authentication = require("../services/auth");

exports.routesConfig = function (app) {
  app.get("/admin/pharmacy/page/:pageId", [
    Authentication.authMiddleware,
    Controller.getByPage,
  ]);
  app.get("/admin/pharmacy/:_id", [
    Authentication.authMiddleware,
    Controller.getById,
  ]);
  app.patch("/admin/pharmacy/update/:_id", [
    Authentication.authMiddleware,
    Controller.editById,
  ]);
  app.delete("/admin/pharmacy/delete/:_id", [
    Authentication.authMiddleware,
    Controller.deleteById,
  ]);
  app.post("/admin/pharmacy/add", [
    Authentication.authMiddleware,
    Controller.register,
  ]);
  app.post("/admin/pharmacy/search", [
    Authentication.authMiddleware,
    Controller.search,
  ]);
};
