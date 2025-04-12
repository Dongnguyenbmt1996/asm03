const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth");
const User = require("../models/user");
const checkRole = require("../middleware/checkRole");
const isAuthUser = require("../middleware/isAuthUser");
const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Email không hợp lệ.")
      .custom(async (value) => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          return Promise.reject("Email đã được đăng ký.");
        }
      }),
    body("fullname").trim().not().isEmpty().withMessage("Vui lòng nhập tên."),
    body("phone")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập số điện thoại."),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Mật khẩu phải dài ít nhất 8 ký tự."),
  ],
  authController.signup
);

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email không hợp lệ."),
    body("password").notEmpty().withMessage("Vui lòng nhập mật khẩu."),
  ],
  authController.signin
);

router.post("/logout", authController.logout);

module.exports = router;
