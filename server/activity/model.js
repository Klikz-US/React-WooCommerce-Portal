const mongoose = require("../services/mongoose").mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const ActivityModel = new Schema(
  {
    user: {
      type: Object,
      default: {},
      required: true,
    },
    type: {
      type: String,
      default: "",
      required: true,
    },
    action: {
      type: Object,
      default: {},
    },
  },
  {
    collection: "activity",
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

ActivityModel.plugin(mongoosePaginate);
module.exports = mongoose.model("ActivityModel", ActivityModel);
