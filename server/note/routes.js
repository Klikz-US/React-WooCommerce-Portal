const Controller = require("./controller");
const Authentication = require("../services/auth");

exports.routesConfig = function (app) {
  app.get("/admin/notes/:_id", [
    Authentication.authMiddleware,
    Controller.getById,
  ]);
};
