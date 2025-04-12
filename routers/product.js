const express = require("express");
const productController = require("../controllers/product");

const router = express.Router();

router.get("/products", productController.getAllProduct);
router.get("/product/:id", productController.getProductDetail);
module.exports = router;
