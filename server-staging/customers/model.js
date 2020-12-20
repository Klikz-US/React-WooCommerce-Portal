const mongoose = require("../services/mongoose").mongoose;
const Schema = mongoose.Schema;

const CustomerModel = new Schema(
  {
    customerId: {
      type: String,
      default: "",
      required: true,
    },
    shippingPreference: {
      type: String,
      default: "",
    },
    shippingAccount: {
      type: String,
      default: "",
    },
  },
  {
    collection: "customer",
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("CustomerModel", CustomerModel);
