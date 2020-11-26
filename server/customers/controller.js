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
    WooCommerce.get("reports/customers/totals")
      .then((result) => {
        if (!result) {
          res.status(404).send("No Customer");
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
    WooCommerce.get(
      "customers?page=" +
        pageId +
        "&per_page=20&status=publish&orderby=registered_date&order=desc"
    )
      .then((customers) => {
        if (!customers) {
          res.status(404).send("No Customer");
        } else {
          res.json(customers.data);
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
    WooCommerce.get("customers/" + _id)
      .then((customer) => {
        if (!customer) {
          res.status(404).send("No Data");
        } else {
          res.json(customer.data);
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
    WooCommerce.put("customers/" + _id, data)
      .then((customer) => {
        if (!customer) {
          res.status(404).send("Update failed");
        } else {
          res.json(customer.data);
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
    WooCommerce.delete("customers/" + _id, {
      force: true,
    })
      .then((customer) => {
        if (!customer) {
          res.status(404).send("Delete failed");
        } else {
          res.json(customer.data);
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
    WooCommerce.post("customers", data)
      .then((customer) => {
        if (!customer) {
          res.status(404).send("Create failed");
        } else {
          res.json(customer.data);
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
    WooCommerce.get("customers?per_page=100&search=" + search)
      .then((customers) => {
        if (!customers) {
          res.status(404).send("No Customer");
        } else {
          res.json(customers.data);
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
    WooCommerce.get("customers/categories?per_page=99")
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
    WooCommerce.get("customers/tags")
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
    WooCommerce.get("customers/attributes")
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
