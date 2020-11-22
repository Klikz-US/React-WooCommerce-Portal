var log4js = require("log4js");
var logger = log4js.getLogger();
logger.level = "debug";
logger.type = "file";
logger.filename = "cleanair.log";

const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const WooCommerce = new WooCommerceRestApi({
  url: "https://cleanairportal.wpengine.com/",
  consumerKey: "ck_86f6086e182c8ac6bf95429b1ee5993b996ffd23",
  consumerSecret: "cs_7624fbf93ff239f08686727adb9b020a066f79e9",
  version: "wc/v3",
});

exports.getTotal = (req, res) => {
  const pageId = req.params.pageId;
  async function process() {
    WooCommerce.get("reports/products/totals")
      .then((result) => {
        console.log(result.data);
        if (!result) {
          res.status(404).send("No Product");
        } else {
          res.json(result.data);
        }
      })
      .catch((error) => {
        res.status(500).send("Server Error");
      });
  }
  process();
};

exports.getByPage = (req, res) => {
  const pageId = req.params.pageId;
  async function process() {
    WooCommerce.get("products?status=publish&page=" + pageId + "&per_page=20")
      .then((products) => {
        if (!products) {
          res.status(404).send("No Product");
        } else {
          res.json(products.data);
        }
      })
      .catch((err) => {
        res.status(500).send("Server Error");
      });
  }
  process();
};

exports.getById = (req, res) => {
  const _id = req.params._id;
  async function process() {
    WooCommerce.get("products/" + _id)
      .then((product) => {
        if (!product) {
          res.status(404).send("No Data");
        } else {
          res.json(product.data);
        }
      })
      .catch((err) => {
        res.status(500).send("Server Error");
      });
  }
  process();
};

exports.editById = (req, res) => {
  const _id = req.params._id;
  const data = req.body;

  async function process() {
    WooCommerce.put("products/" + _id, data)
      .then((product) => {
        if (!product) {
          res.status(404).send("Update failed");
        } else {
          res.json(product.data);
        }
      })
      .catch((err) => {
        res.status(500).send("Server Error");
      });
  }
  process();
};

exports.deleteById = (req, res) => {
  const _id = req.params._id;

  async function process() {
    WooCommerce.delete("products/" + _id)
      .then((product) => {
        if (!product) {
          res.status(404).send("Delete failed");
        } else {
          res.json(product.data);
        }
      })
      .catch((err) => {
        res.status(500).send("Server Error");
      });
  }
  process();
};

exports.register = (req, res) => {
  const data = req.body;

  async function process() {
    WooCommerce.post("products", data)
      .then((product) => {
        if (!product) {
          res.status(404).send("Create failed");
        } else {
          res.json(product.data);
        }
      })
      .catch((err) => {
        res.status(500).send("Server Error");
      });
  }
  process();
};

exports.search = (req, res) => {
  const search = req.body.value;
  async function process() {
    WooCommerce.get("products?search=" + search)
      .then((products) => {
        if (!products) {
          res.status(404).send("No Product");
        } else {
          res.json(products.data);
        }
      })
      .catch((err) => {
        res.status(500).send("Server Error");
      });
  }
  process();
};
