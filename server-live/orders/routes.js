const Controller = require("./controller");
const Authentication = require("../services/auth");

exports.routesConfig = function (app) {
  app.get("/admin/orders/total", [
    Authentication.authMiddleware,
    Controller.getPurchaseOrdersTotal,
  ]);
  app.get("/admin/orders/page/:pageId", [
    Authentication.authMiddleware,
    Controller.getPurchaseOrdersByPage,
  ]);
  app.get("/admin/orders/:_id", [
    Authentication.authMiddleware,
    Controller.getPurchaseOrderById,
  ]);
  app.put("/admin/orders/update/:_id", [
    Authentication.authMiddleware,
    Controller.editPurchaseOrderById,
  ]);
  app.delete("/admin/orders/delete/:_id", [
    Authentication.authMiddleware,
    Controller.deletePurchaseOrderById,
  ]);
  app.post("/admin/orders/add", [
    Authentication.authMiddleware,
    Controller.addPurchaseOrder,
  ]);
  app.post("/admin/orders/search", [
    Authentication.authMiddleware,
    Controller.searchPurchaseOrders,
  ]);

  // Rental Quotes
  app.get("/admin/orders/rentals/page/:pageId", [
    Authentication.authMiddleware,
    Controller.getRentalQuotesByPage,
  ]);
  app.get("/admin/orders/rentals/:_id", [
    Authentication.authMiddleware,
    Controller.getRentalQuoteById,
  ]);
  app.post("/admin/orders/rentals/search", [
    Authentication.authMiddleware,
    Controller.searchRentalQuotes,
  ]);

  // Purchase Proposals
  app.get("/admin/orders/proposals/page/:pageId", [
    Authentication.authMiddleware,
    Controller.getPurchaseProposalsByPage,
  ]);
  app.get("/admin/orders/proposals/:_id", [
    Authentication.authMiddleware,
    Controller.getPurchaseProposalById,
  ]);
  app.post("/admin/orders/proposals/search", [
    Authentication.authMiddleware,
    Controller.searchPurchaseProposals,
  ]);
};
