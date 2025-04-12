const express = require("express");
const cartController = require("../controllers/cart");
const isAuth = require("../middleware/isAuthUser");
const router = express.Router();

router.post("/addcart", isAuth, cartController.addToCart);
router.get("/cart", isAuth, cartController.getCart);
router.put("/cart/update", isAuth, cartController.updateQuantity);
router.delete("/remove/:productId", isAuth, cartController.removeItem);
module.exports = router;
