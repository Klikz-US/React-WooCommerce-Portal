const Controller = require("./controller");
const Authentication = require("../services/auth");

exports.routesConfig = function (app) {
  app.get("/admin/reports/sales", [
    Authentication.authMiddleware,
    Controller.getSales,
  ]);

  app.get("/admin/reports/sellers", [
    Authentication.authMiddleware,
    Controller.getSellers,
  ]);

  app.get("/admin/reports/coupons", [
    Authentication.authMiddleware,
    Controller.getCoupons,
  ]);

  app.get("/admin/reports/customers", [
    Authentication.authMiddleware,
    Controller.getCustomers,
  ]);

  app.get("/admin/reports/orders", [
    Authentication.authMiddleware,
    Controller.getOrders,
  ]);

  app.get("/admin/reports/products", [
    Authentication.authMiddleware,
    Controller.getProducts,
  ]);

  app.get("/admin/reports/reviews", [
    Authentication.authMiddleware,
    Controller.getReviews,
  ]);

  app.get("/admin/reports/system", [
    Authentication.authMiddleware,
    Controller.getSystem,
  ]);

  app.get("/admin/reports/tax", [
    Authentication.authMiddleware,
    Controller.getTax,
  ]);

  app.get("/admin/reports/shipping", [
    Authentication.authMiddleware,
    Controller.getShipping,
  ]);
};
