const jwt = require("jsonwebtoken");
const User = require("../models/user");

const isAuthJwt = async (req, res, next) => {
  const token = req.cookies.user_token;

  if (!token) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập." });
  }

  try {
    // Giải mã token và kiểm tra role
    const decodedToken = jwt.verify(token, "yourSecret");
    const user = await User.findById(decodedToken.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại." });
    }

    req.user = user; // Gắn user vào req để các API sau dùng

    // Kiểm tra quyền admin
    if (user.role !== "admin" || "consultant") {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }

    next();
  } catch (err) {
    console.error("Lỗi kiểm tra đăng nhập:", err);
    res.status(500).json({ message: "Lỗi máy chủ." });
  }
};

module.exports = isAuthJwt;

//ví dụ dùng để app vào admin:

// const express = require("express");
// const requireAuth = require("../middleware/requireAuth");

// const router = express.Router();

// router.post("/admin-api", requireAuth, (req, res) => {
//   // Chỉ những user có quyền admin mới có thể truy cập API này
//   res.status(200).json({ message: "Admin API đã được truy cập thành công!" });
// });

// module.exports = router;

//gửi token vào các request fe:

// const token = localStorage.getItem("authToken");

// const res = await fetch("http://localhost:5000/protected-endpoint", {
//   method: "GET",
//   headers: {
//     "Content-Type": "application/json",
//     "Authorization": `Bearer ${token}`,  // Gửi token trong header
//   },
//   credentials: "include", // Để cookie được gửi nếu cần
// });

// const data = await res.json();
