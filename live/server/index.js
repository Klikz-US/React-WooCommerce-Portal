require("dotenv").config();

const http_port = process.env.HTTP_PORT;
const https_port = process.env.HTTPS_PORT;
const allowed_domains = [
  "http://localhost:3000",
  "https://*.klikz.us",
  "https://cleanairportal.klikz.us",
];

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowed_domains.indexOf(origin) === -1) {
        var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

const fs = require("fs");
const http = require("http");
const https = require("https");
const credentials = {
  key: fs.readFileSync("./ssl/private.key"),
  cert: fs.readFileSync("./ssl/public.crt"),
  ca: [
    fs.readFileSync("./ssl/CA_root.crt"),
    fs.readFileSync("./ssl/alphasslrootcabundle.crt"),
  ],
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
httpServer.keepAliveTimeout = 61 * 1000;
httpsServer.keepAliveTimeout = 61 * 1000;
httpServer.listen(http_port, () => {
  console.log("HTTP Server running on port " + http_port);
});
httpsServer.listen(https_port, () => {
  console.log("HTTPS Server running on port " + https_port);
});

const UsersRouter = require("./users/routes");
UsersRouter.routesConfig(app);

const ProductsRouter = require("./products/routes");
ProductsRouter.routesConfig(app);

const CustomersRouter = require("./customers/routes");
CustomersRouter.routesConfig(app);

const OrdersRouter = require("./orders/routes");
OrdersRouter.routesConfig(app);

const ActivityRouter = require("./activity/routes");
ActivityRouter.routesConfig(app);

const ReportRouter = require("./reports/routes");
ReportRouter.routesConfig(app);

const PhotoRouter = require("./photos/routes");
PhotoRouter.routesConfig(app);
