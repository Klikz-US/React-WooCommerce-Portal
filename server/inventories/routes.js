const Controller = require("./controller");
const Authentication = require("../services/auth");

exports.routesConfig = function (app) {
    app.get("/admin/inventories/page/:pageId", [
        Authentication.authMiddleware,
        Controller.getByPage,
    ]);
    app.get("/admin/inventories/:_id", [
        Authentication.authMiddleware,
        Controller.getById,
    ]);
    app.patch("/admin/inventories/update/:_id", [
        Authentication.authMiddleware,
        Controller.editById,
    ]);
    app.delete("/admin/inventories/delete/:_id", [
        Authentication.authMiddleware,
        Controller.deleteById,
    ]);
    app.post("/admin/inventories/add", [
        Authentication.authMiddleware,
        Controller.register,
    ]);
    app.post("/admin/inventories/search", [
        Authentication.authMiddleware,
        Controller.search,
    ]);
};
