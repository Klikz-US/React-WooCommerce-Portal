const Model = require("./model");

exports.getById = (req, res) => {
  const product = req.body.product;
  Model.findOne({ product: product }, function (err, note) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (!note) {
        res.status(404).send("No Note found");
      } else {
        res.json(note);
      }
    }
  });
};

exports.add = (user, type, action) => {
  const newNote = new Model({ user: user, type: type, action: action });
  newNote
    .save()
    .then(() => {})
    .catch((err) => {
      console.log(err);
    });
};
