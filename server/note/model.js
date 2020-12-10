const mongoose = require("../services/mongoose").mongoose;
const Schema = mongoose.Schema;

const NoteModel = new Schema(
  {
    productId: {
      type: String,
      default: "",
      required: true,
    },
    userNote: {
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
