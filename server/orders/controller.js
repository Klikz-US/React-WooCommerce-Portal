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
    WooCommerce.get("reports/orders/totals")
      .then((result) => {
        if (!result) {
          res.status(404).send("No Order");
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
    WooCommerce.get("orders?page=" + pageId + "&per_page=20")
      .then((orders) => {
        if (!orders) {
          res.status(404).send("No Order");
        } else {
          res.json(orders.data);
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
    WooCommerce.get("orders/" + _id)
      .then((order) => {
        if (!order) {
          res.status(404).send("No Data");
        } else {
          res.json(order.data);
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
    WooCommerce.put("orders/" + _id, data)
      .then((order) => {
        if (!order) {
          res.status(404).send("Update failed");
        } else {
          res.json(order.data);
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
    WooCommerce.delete("orders/" + _id)
      .then((order) => {
        if (!order) {
          res.status(404).send("Delete failed");
        } else {
          res.json(order.data);
        }
      })
      .catch((err) => {
        res.status(500).send("Server Error");
      });
  }
  process();
};

exports.add = (req, res) => {
  const data = req.body;

  async function process() {
    WooCommerce.post("orders", data)
      .then((order) => {
        if (!order) {
          res.status(404).send("Create failed");
        } else {
          res.json(order.data);
        }
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
  process();
};

exports.search = (req, res) => {
  const search = req.body.value;
  async function process() {
    WooCommerce.get("orders?per_page=100&search=" + search)
      .then((orders) => {
        if (!orders) {
          res.status(404).send("No Order");
        } else {
          res.json(orders.data);
        }
      })
      .catch((err) => {
        res.status(500).send("Server Error");
      });
  }
  process();
};

exports.getCategories = (req, res) => {
  async function process() {
    WooCommerce.get("orders/categories?per_page=99")
      .then((categories) => {
        if (!categories) {
          res.status(404).send("No Category");
        } else {
          res.json(categories.data);
        }
      })
      .catch((err) => {
        res.status(500).send("Server Error");
      });
  }
  process();
};

exports.getTags = (req, res) => {
  async function process() {
    WooCommerce.get("orders/tags")
      .then((tags) => {
        if (!tags) {
          res.status(404).send("No Tag");
        } else {
          res.json(tags.data);
        }
      })
      .catch((err) => {
        res.status(500).send("Server Error");
      });
  }
  process();
};

exports.getAttributes = (req, res) => {
  async function process() {
    WooCommerce.get("orders/attributes")
      .then((attributes) => {
        if (!attributes) {
          res.status(404).send("No Attributes");
        } else {
          res.json(attributes.data);
        }
      })
      .catch((err) => {
        res.status(500).send("Server Error");
      });
  }
  process();
};
