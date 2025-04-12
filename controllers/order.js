const { validationResult } = require("express-validator");
const Order = require("../models/order");
const moment = require("moment");
const Cart = require("../models/cart");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);
exports.createOrder = async (req, res) => {
  const errors = validationResult(req);

  //console.log(errors);
  if (!errors.isEmpty()) {
    // Chuyển đổi errors thành object: { fullname: "msg", email: "msg", ... }
    const formattedErrors = {};
    errors.array().forEach((err) => {
      formattedErrors[err.path] = err.msg;
    });

    return res.status(400).json({ errors: formattedErrors });
  }

  const { fullname, email, phone, address } = req.body;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    console.log("CART:", cart);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.productId._id,

      productName: item.productId.name,
      img: item.productId.img1,
      quantity: item.quantity,
      price: item.productId.price,
    }));

    const totalPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const newOrder = new Order({
      user: {
        userId,
        fullname,
        email,
        phone,
        address,
      },
      products: orderItems,
      totalPrice,
      status: "pending",
      createdAt: new Date(),
    });

    await newOrder.save();

    await Cart.findOneAndUpdate({ userId }, { items: [] });

    // Gửi email xác nhận đơn hàng
    const html = `
     <div style="font-family:sans-serif; padding: 16px; background-color: #111; color: #fff;">
       <h2>Xin Chào ${fullname}</h2>
       <p><strong>Phone:</strong> ${phone}</p>
       <p><strong>Address:</strong> ${address}</p>
       <p><strong>Thời gian đặt hàng:</strong> ${new Date().toLocaleString()}</p>
       
       <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
         <thead>
           <tr>
             <th style="border: 1px solid #ccc; padding: 8px;">Tên Sản Phẩm</th>
             <th style="border: 1px solid #ccc; padding: 8px;">Hình Ảnh</th>
             <th style="border: 1px solid #ccc; padding: 8px;">Giá</th>
             <th style="border: 1px solid #ccc; padding: 8px;">Số Lượng</th>
             <th style="border: 1px solid #ccc; padding: 8px;">Thành Tiền</th>
           </tr>
         </thead>
         <tbody>
           ${orderItems
             .map(
               (item) => `
             <tr>
               <td style="border: 1px solid #ccc; padding: 8px;">${
                 item.productName
               }</td>
               <td style="border: 1px solid #ccc; padding: 8px;"><img src="${
                 item.img
               }" width="60"/></td>
               <td style="border: 1px solid #ccc; padding: 8px;">${item.price.toLocaleString()}₫</td>
               <td style="border: 1px solid #ccc; padding: 8px;">${
                 item.quantity
               }</td>
               <td style="border: 1px solid #ccc; padding: 8px;">${(
                 item.price * item.quantity
               ).toLocaleString()}₫</td>
             </tr>
           `
             )
             .join("")}
         </tbody>
       </table>

       <h3 style="margin-top: 24px;">Tổng Thanh Toán: ${totalPrice.toLocaleString()}₫</h3>
       <p style="margin-top: 16px;">Cảm ơn bạn đã đặt hàng!</p>
     </div>
   `;

    await transporter
      .sendMail({
        to: email,
        from: "thuongdongbmt@gmail.com",
        subject: "Xác nhận đơn hàng từ Dong Store",
        html: html,
      })
      .catch((err) => {
        console.error("LỖI GỬI EMAIL:", err);
      });
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "user.userId": req.user._id.toString(),
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(orders);
    //console.log("orders:", orders);
  } catch (err) {
    console.error("Lỗi khi lấy đơn hàng của người dùng:", err);
    res.status(500).json({ message: "Lỗi server." });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log("Nhận ID từ FE:", req.params.id);

    const order = await Order.findById(orderId);
    console.log("order by id:", order);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
    res.status(500).json({ message: "Lỗi server." });
  }
};
