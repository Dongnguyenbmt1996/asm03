//const formatCurrency = require("./formatCurrency");

module.exports = function generateOrderEmail({
  user,
  products,
  totalPrice,
  orderTime,
}) {
  return `
    <div style="font-family:sans-serif; padding: 16px; background-color: #111; color: #fff;">
      <h2>Xin Chào ${user.fullname}</h2>
      <p><strong>Phone:</strong> ${user.phone}</p>
      <p><strong>Address:</strong> ${user.address}</p>
      <p><strong>Thời gian đặt hàng:</strong> ${orderTime}</p>
      
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
          ${products
            .map(
              (item) => `
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.productName}</td>
              <td style="border: 1px solid #ccc; padding: 8px;"><img src="${item.img}" width="60"/></td>
              <td style="border: 1px solid #ccc; padding: 8px;">
                item.price
              </td>
              <td style="border: 1px solid #ccc; padding: 8px;">${item.quantity}</td>
              <td style="border: 1px solid #ccc; padding: 8px;">
                item.price * item.quantity
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>

      <h3 style="margin-top: 24px;">Tổng Thanh Toán: ${formatCurrency(
        totalPrice
      )}</h3>
      <p style="margin-top: 16px;">Cảm ơn bạn đã đặt hàng!</p>
    </div>
  `;
};
