// middleware/isAuthUser.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isAuthUser = async (req, res, next) => {
  const token = req.cookies.user_token;

  if (!token) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập." });
  }

  try {
    const decodedToken = jwt.verify(token, "yourSecret");
    const user = await User.findById(decodedToken.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại." });
    }

    req.user = user; // Gắn user vào req để dùng trong các controller
    req.userId = user._id;

    next();
  } catch (err) {
    console.error("Lỗi xác thực người dùng:", err);
    res.status(500).json({ message: "Lỗi xác thực người dùng." });
  }
};

module.exports = isAuthUser;
