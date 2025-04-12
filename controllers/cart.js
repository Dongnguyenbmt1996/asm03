const Cart = require("../models/cart");
const Product = require("../models/products");

exports.addToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = req.userId; // bạn cần middleware xác thực để lấy userId từ cookie

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ userId });

    const existingItem = cart.items.find(
      (item) => item.productId === productId
    );

    if (existingItem) {
      // Nếu sản phẩm đã có trong giỏ → cập nhật số lượng
      existingItem.quantity += quantity;
    } else {
      // Nếu chưa có → thêm vào giỏ
      cart.items.push({
        productId,
        quantity,
        price: product.price,
      });
    }

    await cart.save();
    res.status(200).json({ message: "Added to cart successfully", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

// Lấy giỏ hàng của user
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate({
      path: "items.productId",
      select: "name price img1 _id", // chọn các trường cần trả về
    });
    //console.log("cart:", cart);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const formattedItems = cart.items.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
    }));

    res.json({ items: formattedItems });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Cập nhật số lượng sản phẩm
exports.updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.productId.toString() === productId);

    if (item) {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.productId");

    const updatedItems = cart.items.map((i) => ({
      product: i.productId,
      quantity: i.quantity,
    }));

    res.json({ items: updatedItems });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Xoá sản phẩm khỏi cart
exports.removeItem = async (req, res) => {
  const productId = req.params.productId;
  //console.log(productId);
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.productId");

    const updatedItems = cart.items.map((i) => ({
      product: i.productId,
      quantity: i.quantity,
    }));

    res.json({ items: updatedItems });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
