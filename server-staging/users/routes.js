const Controller = require("./controller");
const Authentication = require("../services/auth");

exports.routesConfig = function (app) {
    app.get("/admin/users/", [
        Authentication.authMiddleware,
        Controller.getAll,
    ]);
    app.get("/admin/users/:_id", [
        Authentication.authMiddleware,
        Controller.getById,
    ]);
    app.post("/admin/users/add", [
        Authentication.authMiddleware,
        Controller.add,
    ]);
    app.patch("/admin/users/edit/:_id", [
        Authentication.authMiddleware,
        Controller.editById,
    ]);
    app.delete("/admin/users/delete/:_id", [
        Authentication.authMiddleware,
        Controller.deleteById,
    ]);

    app.post("/admin/login", [Controller.login]);
    app.post("/admin/logout", [Controller.logout]);
    app.post("/admin/verifyToken", [Controller.verifyToken]);
};
