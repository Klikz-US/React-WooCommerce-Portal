const Model = require("./model");

exports.getByPage = (req, res) => {
  const pageId = req.params.pageId;

  async function process() {
    try {
      const count = await Model.find().countDocuments();
      const pharmacies = await Model.paginate(
        {},
        {
          select:
            "name deaId deaExp license licenseExp subscriptionStatus subscriptionLevel subscriptionExp pharmacyAddress1 pharmacyAddress2 pharmacyCity pharmacyState pharmacyZip pharmacyCountry registered_at",
          page: pageId,
          limit: 20,
          sort: {
            _id: -1,
          },
        }
      );
      if (pharmacies) {
        res.json({
          pharmacies: pharmacies.docs,
          count: count,
        });
      } else {
        res.status(404).send("Pharmacy not found");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
  process();
};

exports.getById = (req, res) => {
  const _id = req.params._id;
  Model.findOne({ _id: _id }, function (err, pharmacy) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (!pharmacy) {
        res.status(404).send("No Pharmacy found");
      } else {
        res.json(pharmacy);
      }
    }
  });
};

exports.editById = (req, res) => {
  const _id = req.params._id;
  const data = req.body;

  async function process() {
    try {
      const pharmacy = await Model.findByIdAndUpdate(_id, data);
      if (pharmacy) {
        res.json(pharmacy);
      } else {
        res.status(404).send("Pharmacy not found");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
  process();
};

exports.deleteById = (req, res) => {
  const _id = req.params._id;

  Model.findOneAndDelete({ _id: _id }, function (err, pharmacy) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (!pharmacy) {
        res.status(404).send("No Pharmacy found");
      } else {
        res.json(pharmacy);
      }
    }
  });
};

exports.register = (req, res) => {
  const ndc = req.body.ndc;
  Model.findOne({ ndc: ndc }, function (err, pharmacy) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (pharmacy) {
        res.status(403).send("NDC already exist");
      } else {
        const newPharmacy = new Model(req.body);
        newPharmacy
          .save()
          .then((pharmacy) => {
            res.json(pharmacy);
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
    let pharmacies = [];
    switch (searchCategory) {
      case "ndc":
        try {
          pharmacies = await Model.find({
            ndc: searchValue,
          });
        } catch (error) {
          return res.status(500).send(error);
        }

        break;

      case "drugName":
        try {
          const pharmacies_data = await Model.paginate(
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
          pharmacies = pharmacies_data.docs;
        } catch (error) {
          return res.status(500).send(error);
        }

        break;

      default:
        return res.status(404).send("Invalid Search Category");
    }

    if (pharmacies.length === 0) {
      res.status(404).send("no result");
    } else {
      return res.json(pharmacies);
    }
  }
  fetchRelatedData();
};
