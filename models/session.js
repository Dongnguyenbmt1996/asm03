// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const sessionSchema = new Schema({
//   userID: {
//     type: mongoose.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   chatRoomID: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "ChatRoom",
//     required: true,
//   },
//   chatMessage: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "chatMessage",
//     },
//   ],
//   lastActiveTime: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Session", sessionSchema);

const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Session", sessionSchema);
