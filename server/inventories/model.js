const mongoose = require("../services/mongoose").mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

let InventoryModel = new Schema(
    {
        drugName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        dose: {
            type: String,
            default: "",
            trim: true,
        },
        ndc: {
            type: String,
            default: "",
            trim: true,
            index: true,
        },
        currentCount: {
            type: Number,
            default: 0,
            trim: true,
        },
        lowStock: {
            type: Number,
            default: 0,
            trim: true,
        },
        registered_at: {
            type: String,
            default: new Date(),
            trim: true,
        },
    },
    {
        collection: "inventories",
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
    }
);

InventoryModel.plugin(mongoosePaginate);
module.exports = mongoose.model("InventoryModel", InventoryModel);
