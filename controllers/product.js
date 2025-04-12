const Product = require("../models/products");

exports.getAllProduct = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    return next(new Error(error));
  }
};

exports.getProductDetail = async (req, res, next) => {
  try {
    const prodId = req.params.id;
    //console.log("id:", prodId);
    const product = await Product.findById(prodId);
    if (!product) {
      res.send({ msg: "Không tìm thấy sản phẩm" });
    } else {
      res.json(product);
    }
  } catch (error) {
    return next(new Error(error));
  }
};

exports.getAllProductAdmin = async (req, res, next) => {
  const search = req.query.search || "";
  try {
    const query = {
      name: { $regex: search, $options: "i" }, // Tìm theo tên (không phân biệt hoa thường)
    };

    const products = await Product.find(query);
    res.status(200).json(products);
    //console.log("products:", products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm." });
  }
};
