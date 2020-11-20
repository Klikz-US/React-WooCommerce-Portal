const mongoose = require("../services/mongoose").mongoose;
const Schema = mongoose.Schema;

const PharmacyModel = new Schema(
  {
    pharmacyName: {
      type: String,
      default: "",
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      default: "",
      required: true,
      trim: true,
    },
    pharmacyDEA: {
      type: String,
      default: "",
      required: true,
      trim: true,
    },
    deaExp: {
      type: Date,
      default: new Date(),
      trim: true,
    },
    license: {
      type: String,
      default: "",
      trim: true,
    },
    licenseExp: {
      type: Date,
      default: new Date(),
      trim: true,
    },
    subscriptionStatus: {
      type: Boolean,
      default: false,
    },
    subscriptionLevel: {
      type: Number,
      default: 0,
    },
    subscriptionExp: {
      type: Date,
      default: new Date(),
    },
    pharmacyStreet1: {
      type: String,
      default: "",
      trim: true,
    },
    pharmacyStreet2: {
      type: String,
      default: "",
      trim: true,
    },
    pharmacyCity: {
      type: String,
      default: "",
      trim: true,
    },
    pharmacyState: {
      type: String,
      default: "",
      trim: true,
    },
    pharmacyZip: {
      type: String,
      default: "",
      trim: true,
    },
    pharmacyCountry: {
      type: String,
      default: "US",
      trim: true,
    },
  },
  {
    collection: "pharmacy",
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("PharmacyModel", PharmacyModel);
