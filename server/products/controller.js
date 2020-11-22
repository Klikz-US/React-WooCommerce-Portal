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
        res.status(500).send(error.response);
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
        res.status(500).send(err.response);
      });
  }
  process();
};

exports.getById = (req, res) => {
  const _id = req.params._id;
  Model.findOne({ _id: _id }, function (err, inventory) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (!inventory) {
        res.status(404).send("No Inventory found");
      } else {
        res.json(inventory);
      }
    }
  });
};

exports.editById = (req, res) => {
  const _id = req.params._id;
  const data = req.body;

  async function process() {
    try {
      const inventory = await Model.findByIdAndUpdate(_id, data);
      if (inventory) {
        res.json(inventory);
      } else {
        res.status(404).send("Inventory not found");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
  process();
};

exports.deleteById = (req, res) => {
  const _id = req.params._id;

  Model.findOneAndDelete({ _id: _id }, function (err, inventory) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (!inventory) {
        res.status(404).send("No Inventory found");
      } else {
        res.json(inventory);
      }
    }
  });
};

exports.register = (req, res) => {
  const ndc = req.body.ndc;
  Model.findOne({ ndc: ndc }, function (err, inventory) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (inventory) {
        res.status(403).send("NDC already exist");
      } else {
        const newInventory = new Model(req.body);
        newInventory
          .save()
          .then((inventory) => {
            res.json(inventory);
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      }
    }
  });
};

exports.search = (req, res) => {
  const searchCategory = req.body.field;
  const searchValue = req.body.value;

  async function fetchRelatedData() {
    let inventories = [];
    switch (searchCategory) {
      case "ndc":
        try {
          inventories = await Model.find({
            ndc: searchValue,
          });
        } catch (error) {
          return res.status(500).send(error);
        }

        break;

      case "drugName":
        try {
          const inventories_data = await Model.paginate(
            {
              drugName: searchValue,
            },
            {
              page: 1,
              limit: 20,
              sort: {
                _id: -1,
              },
            }
          );
          inventories = inventories_data.docs;
        } catch (error) {
          return res.status(500).send(error);
        }

        break;

      default:
        return res.status(404).send("Invalid Search Category");
    }

    if (inventories.length === 0) {
      res.status(404).send("no result");
    } else {
      return res.json(inventories);
    }
  }
  fetchRelatedData();
};
