const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  sender: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: String, // 'customer' | 'consultant' | 'system'
  },
  content: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
