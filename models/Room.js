const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    ended: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
