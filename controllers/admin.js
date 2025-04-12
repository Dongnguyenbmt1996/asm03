// controllers/admin.js
const User = require("../models/user");
const Order = require("../models/order");
const { validationResult } = require("express-validator");
const Product = require("../models/products");
exports.getDashboardStats = async (req, res) => {
  try {
    // Lấy tổng số user (khách hàng)
    const totalUsers = await User.countDocuments({ role: "customer" });

    // Lấy tổng số đơn hàng
    const totalOrders = await Order.countDocuments();

    // Lấy tổng doanh thu từ các đơn hàng đã hoàn thành
    const orders = await Order.find({});
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );
    //console.log("totalRevenue:", totalRevenue);

    res.status(200).json({
      totalUsers,
      totalOrders,
      totalRevenue,
      //avgMonthlyRevenue,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ orderTime: -1 }).limit(10);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  // Kiểm tra có đủ 4 ảnh không
  if (!req.files || req.files.length < 4) {
    const error = new Error("Cần upload ít nhất 4 ảnh cho sản phẩm");
    error.statusCode = 422;
    throw error;
  }

  // Lấy đường dẫn các ảnh
  const images = req.files.map((file) => file.path.replace(/\\/g, "/"));

  const product = new Product({
    category: req.body.category,
    img1: images[0],
    img2: images[1],
    img3: images[2],
    img4: images[3],
    long_desc: req.body.longDesc,
    name: req.body.name,
    price: req.body.price,
    short_desc: req.body.shortDesc,
  });

  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Product created successfully!",
        product: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getProductForEdit = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      const error = new Error("Could not find product");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Product fetched successfully",
      product: {
        _id: product._id,
        name: product.name,
        category: product.category,
        shortDesc: product.short_desc,
        longDesc: product.long_desc,
        price: product.price,
        img1: product.img1,
        img2: product.img2,
        img3: product.img3,
        img4: product.img4,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error;
  }

  const productId = req.params.productId;
  const { name, category, shortDesc, longDesc, price } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      const error = new Error("Could not find product");
      error.statusCode = 404;
      throw error;
    }

    // Cập nhật các trường cơ bản
    product.name = name;
    product.category = category;
    product.short_desc = shortDesc;
    product.long_desc = longDesc;
    product.price = price;

    // Xử lý ảnh nếu có upload ảnh mới
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => file.path.replace(/\\/g, "/"));

      // Cập nhật chỉ những ảnh được upload
      if (images[0]) product.img1 = images[0];
      if (images[1]) product.img2 = images[1];
      if (images[2]) product.img3 = images[2];
      if (images[3]) product.img4 = images[3];
    }

    const result = await product.save();

    res.status(200).json({
      message: "Product updated!",
      product: result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("Could not find product");
      error.statusCode = 404;
      throw error;
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
