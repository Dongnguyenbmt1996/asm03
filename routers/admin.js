const express = require("express");
const router = express.Router();
const productController = require("../controllers/product");
const isAuth = require("../middleware/isAuthUser");
const isAdmin = require("../middleware/is-auth");
const checkRole = require("../middleware/checkRole");
const adminController = require("../controllers/admin");
const { body, validationResult } = require("express-validator");
const Product = require("../models/products");
const multer = require("multer");
const path = require("path");
router.get(
  "/productsadmin",
  isAuth,
  checkRole("admin"),
  productController.getAllProductAdmin
);

// Chỉ cho tư vấn viên & admin
router.get(
  "/livechat",
  isAuth,
  checkRole("consultant", "admin"),
  (req, res) => {
    res.json({ message: "Truy cập livechat thành công." });
  }
);

// Chỉ admin mới vào được admin-dashboard
router.get(
  "/admin-dashboard",
  isAuth,
  checkRole("admin"),
  adminController.getDashboardStats
);
router.get(
  "/orders",
  isAuth,
  checkRole("admin"),
  adminController.getOrdersAdmin
);

router.post(
  "/post-product",
  isAuth,
  checkRole("admin"),
  [
    body("name").trim().notEmpty().withMessage("Không để trống trường name"),
    body("category")
      .trim()
      .notEmpty()
      .withMessage("Không để trống trường category"),
    body("shortDesc")
      .trim()
      .notEmpty()
      .withMessage("Không để trống trường shortDesc"),
    body("longDesc")
      .trim()
      .notEmpty()
      .withMessage("Không để trống trường longDesc"),
    body("price").trim().notEmpty().withMessage("Không để trống trường price"),
  ],
  adminController.createProduct
);

router.put(
  "/update-product/:productId",
  isAuth,
  checkRole("admin"),
  [
    body("name").trim().notEmpty(),
    body("category").trim().notEmpty(),
    body("shortDesc").trim().notEmpty(),
    body("longDesc").trim().notEmpty(),
    body("price").trim().notEmpty(),
  ],
  adminController.updateProduct
);

router.get(
  "/edit-product/:productId",
  isAuth,
  checkRole("admin"),
  adminController.getProductForEdit
);

router.delete(
  "/delete-product/:productId",
  isAuth,
  checkRole("admin"),
  adminController.deleteProduct
);

module.exports = router;
