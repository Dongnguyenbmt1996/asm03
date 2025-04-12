const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/isAuthUser");
const ordersController = require("../controllers/order");
const router = express.Router();

router.post(
  "/create",
  isAuth,
  [
    body("fullname").notEmpty().withMessage("Fullname is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("address").notEmpty().withMessage("Address is required"),
  ],
  ordersController.createOrder
);
router.get("/user", isAuth, ordersController.getUserOrders);
router.get("/:id", isAuth, ordersController.getOrderById);
module.exports = router;
