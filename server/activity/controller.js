const Model = require("./model");

exports.getTotal = (req, res) => {
  async function process() {
    try {
      const count = await Model.find().countDocuments();
      if (count) {
        res.json({
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

exports.getByPage = (req, res) => {
  const pageId = req.params.pageId;

  async function process() {
    try {
      const activities = await Model.paginate(
        {},
        {
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

exports.add = (user, type, action) => {
  const newActivity = new Model({ user: user, type: type, action: action });
  newActivity
    .save()
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
};

exports.search = (req, res) => {
  const searchCategory = req.body.field;
  const searchValue = req.body.value;

  async function fetchRelatedData() {
    let activities = [];
    switch (searchCategory) {
      case "user":
        try {
          activities = await Model.find({
            user: searchValue,
          });
        } catch (error) {
          return res.status(500).send(error);
        }

        break;

      case "type":
        try {
          const activities_data = await Model.paginate(
            {
              type: searchValue,
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
        return res.status(404).send("Invalid Filter Category");
    }

    if (activities.length === 0) {
      res.status(404).send("no result");
    } else {
      return res.json(activities);
    }
  }
  fetchRelatedData();
};
