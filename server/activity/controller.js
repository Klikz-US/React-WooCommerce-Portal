const Model = require("./model");

exports.getByPage = (req, res) => {
  const pageId = req.params.pageId;

  async function process() {
    try {
      const count = await Model.find().countDocuments();
      const activities = await Model.paginate(
        {},
        {
          select:
            "name deaId deaExp license licenseExp subscriptionStatus subscriptionLevel subscriptionExp activityAddress1 activityAddress2 activityCity activityState activityZip activityCountry registered_at",
          page: pageId,
          limit: 20,
          sort: {
            _id: -1,
          },
        }
      );
      if (activities) {
        res.json({
          activities: activities.docs,
          count: count,
        });
      } else {
        res.status(404).send("Activity not found");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
  process();
};

exports.getById = (req, res) => {
  const _id = req.params._id;
  Model.findOne({ _id: _id }, function (err, activity) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (!activity) {
        res.status(404).send("No Activity found");
      } else {
        res.json(activity);
      }
    }
  });
};

exports.editById = (req, res) => {
  const _id = req.params._id;
  const data = req.body;

  async function process() {
    try {
      const activity = await Model.findByIdAndUpdate(_id, data);
      if (activity) {
        res.json(activity);
      } else {
        res.status(404).send("Activity not found");
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
  process();
};

exports.deleteById = (req, res) => {
  const _id = req.params._id;

  Model.findOneAndDelete({ _id: _id }, function (err, activity) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (!activity) {
        res.status(404).send("No Activity found");
      } else {
        res.json(activity);
      }
    }
  });
};

exports.register = (req, res) => {
  const ndc = req.body.ndc;
  Model.findOne({ ndc: ndc }, function (err, activity) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (activity) {
        res.status(403).send("NDC already exist");
      } else {
        const newActivity = new Model(req.body);
        newActivity
          .save()
          .then((activity) => {
            res.json(activity);
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
    let activities = [];
    switch (searchCategory) {
      case "ndc":
        try {
          activities = await Model.find({
            ndc: searchValue,
          });
        } catch (error) {
          return res.status(500).send(error);
        }

        break;

      case "drugName":
        try {
          const activities_data = await Model.paginate(
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
          activities = activities_data.docs;
        } catch (error) {
          return res.status(500).send(error);
        }

        break;

      default:
        return res.status(404).send("Invalid Search Category");
    }

    if (activities.length === 0) {
      res.status(404).send("no result");
    } else {
      return res.json(activities);
    }
  }
  fetchRelatedData();
};
