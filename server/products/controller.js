const activity = require("../activity/controller");
const note = require("../note/controller");

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
    WooCommerce.get("products?page=" + pageId + "&per_page=20&status=publish")
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

exports.getVariants = (req, res) => {
  const _id = req.params._id;
  async function process() {
    WooCommerce.get("products/" + _id + "/variations?page=1&per_page=99")
      .then((variations) => {
        if (!variations) {
          res.status(404).send("No Data");
        } else {
          console.log(variations.data);
          res.json(variations.data);
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send(err);
      });
  }
  process();
};

exports.updateVariants = (req, res) => {
  const _id = req.params._id;
  const variants = req.body;
  async function process() {
    try {
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        await WooCommerce.put(
          "products/" + _id + "/variations/" + variant.id,
          variant.data
        );
      }
    } catch (error) {
      res.status(500).send(error);
    }

    res.json("success");
  }
  process();
};

exports.createVariants = (req, res) => {
  const _id = req.params._id;
  const variants = req.body;
  async function process() {
    try {
      for (let i = 0; i < variants.length; i++) {
        const variant = variants[i];
        await WooCommerce.post("products/" + _id + "/variations", variant.data);
      }
    } catch (error) {
      res.status(500).send(error);
    }

    res.json("success");
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
          activity.add(req.body.auth_user, "product updated", {
            name: product.data.name,
            link: "/products/edit/" + product.data.id,
          });
        }
      })
      .catch((err) => {
        res.status(500).send(err);
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
          activity.add({ username: req.user.name }, "product deleted", {
            name: product.data.name,
            link: "/products/edit/" + product.data.id,
          });
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
    WooCommerce.post("products", data)
      .then((product) => {
        if (!product) {
          res.status(404).send("Create failed");
        } else {
          res.json(product.data);
          activity.add(req.body.auth_user, "product created", {
            name: product.data.name,
            link: "/products/edit/" + product.data.id,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Server Error");
      });
  }
  process();
};

exports.search = (req, res) => {
  const search = req.body.value;
  async function process() {
    WooCommerce.get("products?per_page=100&search=" + search)
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

exports.getCategories = (req, res) => {
  async function process() {
    WooCommerce.get("products/categories?per_page=99")
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

exports.getAllTags = (req, res) => {
  async function process() {
    WooCommerce.get("products/tags?per_page=99")
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
    WooCommerce.get("products/attributes")
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
