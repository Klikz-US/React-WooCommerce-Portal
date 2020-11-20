const mongoose = require("../services/mongoose").mongoose;
const Schema = mongoose.Schema;

const ActivityModel = new Schema(
  {
    userID: {
      type: String,
      default: "",
      required: true,
      trim: true,
      index: true,
    },
    pharmacyID: {
      type: String,
      default: "",
      required: true,
      trim: true,
      index: true,
    },
    drugID: {
      type: String,
      default: "",
      required: true,
      trim: true,
      index: true,
    },
    type: {
      type: Number,
      default: 0,
      required: true,
    },
    time: {
      type: Date,
      default: new Date(),
      required: true,
    },
    action: {
      type: String,
      default: "",
      required: true,
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

module.exports = mongoose.model("ActivityModel", ActivityModel);
