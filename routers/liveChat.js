// // routes/livechat.js
// const express = require("express");
// const router = express.Router();
// const livechatController = require("../controllers/LiveChat");
// const checkRole = require("../middleware/checkRole");
// const isAuthJwt = require("../middleware/is-auth");

// // Consultant và Admin đều truy cập được
// router.get(
//   "/conversations",
//   isAuthJwt,
//   checkRole("consultant", "admin"),
//   livechatController.getAllConversations
// );

// router.post(
//   "/send-message",
//   isAuthJwt,
//   checkRole("consultant", "admin"),
//   livechatController.sendMessage
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

router.get("/active", async (req, res) => {
  const rooms = await Room.find({ ended: false }).populate("userId");
  res.json(rooms);
});

module.exports = router;
