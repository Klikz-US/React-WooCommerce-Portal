const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
const WooCommerce = new WooCommerceRestApi({
  url: "https://cleanairportal.wpengine.com/",
  consumerKey: "ck_86f6086e182c8ac6bf95429b1ee5993b996ffd23",
  consumerSecret: "cs_7624fbf93ff239f08686727adb9b020a066f79e9",
  version: "wc/v3",
});

const axios = require("axios");

const gfConsumerKey = "ck_6ca93104069513d7f3ceebd15dfea88887f9e7fb";
const gfConsumerSecret = "cs_a778fbd85b85fd8613d4a641d63316f2a86d297d";
const gfConfig = {
  method: "get",
  headers: {
    Authorization:
      "Basic " +
      Buffer.from(`${gfConsumerKey}:${gfConsumerSecret}`).toString("base64"),
  },
};

// Purchase Orders
exports.getPurchaseOrdersTotal = (req, res) => {
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

exports.getPurchaseOrdersByPage = (req, res) => {
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

exports.getPurchaseOrderById = (req, res) => {
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

exports.editPurchaseOrderById = (req, res) => {
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

exports.deletePurchaseOrderById = (req, res) => {
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

exports.addPurchaseOrder = (req, res) => {
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

exports.searchPurchaseOrders = (req, res) => {
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
        res.status(500).send(err);
      });
  }
  process();
};

// Rental Quotes
exports.getRentalQuotesByPage = (req, res) => {
  gfConfig.url =
    "https://www.cleanair.com/wp-json/gf/v2/entries?form_ids[0]=1&paging[page_size]=20&paging[current_page]=" +
    req.params.pageId;

  axios(gfConfig)
    .then(function (result) {
      res.json({ total: result.data });
    })
    .catch(function (error) {
      res.status(500).send(error);
    });
};

exports.getRentalQuoteById = (req, res) => {
  gfConfig.url =
    "https://www.cleanair.com/wp-json/gf/v2/entries/" + req.params._id;

  axios(gfConfig)
    .then(function (result) {
      res.json({ total: result.data });
    })
    .catch(function (error) {
      res.status(500).send(error);
    });
};

exports.searchRentalQuotes = (req, res) => {
  gfConfig.url = `https://www.cleanair.com/wp-json/gf/v2/entries?form_ids[0]=1&search={"field_filters":{"mode":"any","0":{"key":1.3,"value":${req.body.value},"operator":"contains"},"1":{"key":1.6,"value":${req.body.value},"operator":"contains"}},"2":{"key":3,"value":${req.body.value},"operator":"contains"}},"3":{"key":2,"value":${req.body.value},"operator":"contains"}}}`;

  axios(gfConfig)
    .then(function (result) {
      res.json({ total: result.data });
    })
    .catch(function (error) {
      res.status(500).send(error);
    });
};

// Purchase Proposals
exports.getPurchaseProposalsByPage = (req, res) => {
  gfConfig.url =
    "https://www.cleanair.com/wp-json/gf/v2/entries?form_ids[0]=2&paging[page_size]=20&paging[current_page]=" +
    req.params.pageId;

  axios(gfConfig)
    .then(function (result) {
      res.json({ total: result.data });
    })
    .catch(function (error) {
      res.status(500).send(error);
    });
};

exports.getPurchaseProposalById = (req, res) => {
  gfConfig.url =
    "https://www.cleanair.com/wp-json/gf/v2/entries/" + req.params._id;

  axios(gfConfig)
    .then(function (result) {
      res.json({ total: result.data });
    })
    .catch(function (error) {
      res.status(500).send(error);
    });
};

exports.searchPurchaseProposals = (req, res) => {
  gfConfig.url = `https://www.cleanair.com/wp-json/gf/v2/entries?form_ids[0]=2&search={"field_filters":{"mode":"any","0":{"key":1.3,"value":${req.body.value},"operator":"contains"},"1":{"key":1.6,"value":${req.body.value},"operator":"contains"}},"2":{"key":2,"value":${req.body.value},"operator":"contains"}},"3":{"key":4,"value":${req.body.value},"operator":"contains"}}}`;

  axios(gfConfig)
    .then(function (result) {
      res.json({ total: result.data });
    })
    .catch(function (error) {
      res.status(500).send(error);
    });
};
