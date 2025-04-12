const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Cart = require("../models/cart");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  //console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { fullname, email, phone, password } = req.body;

  try {
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      fullname,
      email,
      phone,
      password: hashedPw,
    });
    const savedUser = await user.save();

    const cart = new Cart({ userId: savedUser._id, items: [], total: 0 });
    await cart.save();

    res.status(201).json({ message: "User created!", userId: savedUser._id });
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res) => {
  const errors = validationResult(req);
  console.log(errors);

  // Trả về lỗi validate (giống Signup)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng." });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng." });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Gửi role trong token
      "yourSecret",
      { expiresIn: "7d" }
    );

    // Gửi cookie xác thực
    res.cookie("user_token", token, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    // Trả user (nên ẩn password)
    const { password: _, ...userData } = user.toObject();
    // Thêm role vào userData
    userData.role = user.role;

    res
      .status(200)
      .json({ message: "Đăng nhập thành công!", token, user: userData });
  } catch (err) {
    console.error("Lỗi server khi đăng nhập:", err);
    res.status(500).json({ message: "Đã xảy ra lỗi máy chủ." });
  }
};

exports.logout = (req, res, next) => {
  // Xóa cookie xác thực (token)
  res.clearCookie("user_token");

  // Trả về phản hồi thành công
  res.status(200).json({ message: "Đăng xuất thành công!" });
};
