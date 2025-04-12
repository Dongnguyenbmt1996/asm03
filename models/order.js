const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user: {
    userId: String,
    fullname: String,
    email: String,
    phone: String,
    address: String,
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      productName: String,
      price: Number,
      quantity: Number,
      img: String,
    },
  ],
  orderTime: {
    type: Date,
    default: Date.now,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "shipping", "completed", "canceled"],
    default: "pending",
  },
});

module.exports = mongoose.model("Order", orderSchema);
