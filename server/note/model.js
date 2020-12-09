const mongoose = require("../services/mongoose").mongoose;
const Schema = mongoose.Schema;

const NoteModel = new Schema(
  {
    product: {
      type: String,
      default: "",
      required: true,
    },
    data: {
      type: String,
      default: "",
    },
  },
  {
    collection: "note",
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("NoteModel", NoteModel);
