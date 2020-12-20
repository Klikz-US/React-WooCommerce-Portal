require("dotenv").config();

const activity = require("../activity/controller");
const dateformat = require("dateformat");

const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const WooCommerce = new WooCommerceRestApi({
  url: process.env.WOO_SITE_URL,
  consumerKey: process.env.WOO_CONSUMER_KEY,
  consumerSecret: process.env.WOO_CONSUMER_SEC,
  version: "wc/v3",
});

exports.getSales = (req, res) => {
  let today = new Date();
  let start = new Date();
  let ago = today.getDate() - 59;
  start.setDate(ago);

  async function process() {
    WooCommerce.get("reports/sales", {
      date_min: dateformat(start, "yyyy-mm-dd"),
      date_max: dateformat(today, "yyyy-mm-dd"),
    })
      .then((result) => {
        if (!result) {
          res.status(404).send("No Sales Reports");
        } else {
          res.json(result.data);
        }
      })
      .catch((error) => {
        res.status(500).send(error.response);
      });
  }
  process();
};

exports.getSellers = (req, res) => {
  async function process() {
    WooCommerce.get("reports/top_sellers")
      .then((result) => {
        if (!result) {
          res.status(404).send("No Top Sellers Reports");
        } else {
          res.json(result.data);
        }
      })
      .catch((error) => {
        res.status(500).send(error.response);
      });
  }
  process();
};

exports.getCoupons = (req, res) => {
  async function process() {
    WooCommerce.get("reports/coupons/totals")
      .then((result) => {
        if (!result) {
          res.status(404).send("No Coupons Reports");
        } else {
          res.json(result.data);
        }
      })
      .catch((error) => {
        res.status(500).send(error.response);
      });
  }
  process();
};

exports.getCustomers = (req, res) => {
  async function process() {
    WooCommerce.get("reports/customers/totals")
      .then((result) => {
        if (!result) {
          res.status(404).send("No Customers Reports");
        } else {
          res.json(result.data);
        }
      })
      .catch((error) => {
        res.status(500).send(error.response);
      });
  }
  process();
};

exports.getOrders = (req, res) => {
  async function process() {
    WooCommerce.get("reports/orders/totals")
      .then((result) => {
        if (!result) {
          res.status(404).send("No Orders Reports");
        } else {
          res.json(result.data);
        }
      })
      .catch((error) => {
        res.status(500).send(error.response);
      });
  }
  process();
};

exports.getProducts = (req, res) => {
  async function process() {
    WooCommerce.get("reports/products/totals")
      .then((result) => {
        if (!result) {
          res.status(404).send("No Products Reports");
        } else {
          res.json(result.data);
        }
      })
      .catch((error) => {
        res.status(500).send(error.response);
      });
  }
  process();
};

exports.getReviews = (req, res) => {
  async function process() {
    WooCommerce.get("reports/reviews/totals")
      .then((result) => {
        if (!result) {
          res.status(404).send("No Reviews Reports");
        } else {
          res.json(result.data);
        }
      })
      .catch((error) => {
        res.status(500).send(error.response);
      });
  }
  process();
};

exports.getSystem = (req, res) => {
  async function process() {
    WooCommerce.get("system_status")
      .then((result) => {
        if (!result) {
          res.status(404).send("No System Reports");
        } else {
          res.json(result.data);
        }
      })
      .catch((error) => {
        res.status(500).send(error.response);
      });
  }
  process();
};

exports.getTax = (req, res) => {
  async function process() {
    WooCommerce.get("taxes")
      .then((result) => {
        if (!result) {
          res.status(404).send("No Tax Reports");
        } else {
          res.json(result.data);
        }
      })
      .catch((error) => {
        res.status(500).send(error.response);
      });
  }
  process();
};

exports.getShipping = (req, res) => {
  async function process() {
    WooCommerce.get("shipping_methods")
      .then((result) => {
        if (!result) {
          res.status(404).send("No Shipping Reports");
        } else {
          res.json(result.data);
        }
      })
      .catch((error) => {
        res.status(500).send(error.response);
      });
  }
  process();
};
