// require("dotenv").config();
// const jwt = require("jsonwebtoken");
// const express = require("express");
// const cors = require("cors");
// const authRouters = require("./routers/auth");
// const productRouters = require("./routers/product");
// const cartRouters = require("./routers/cart");
// const orderRouters = require("./routers/order");
// const adminRouters = require("./routers/admin");
// const liveChatRouter = require("./routers/liveChat");
// const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
// const socketio = require("socket.io");
// const { initSocket } = require("./socket");
// const fs = require("fs");
// const path = require("path");
// const multer = require("multer");
// const app = express();
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:3001",
//       "http://localhost:3002",
//     ], // Cho phép frontend truy cập
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"], // Cho phép GET và POST
//     allowedHeaders: ["Content-Type"], // Cho phép gửi JSON
//   })
// );

// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
//     );
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false); // Không ném lỗi, chỉ từ chối file
//   }
// };

// app.use(
//   multer({ storage: fileStorage, fileFilter: fileFilter }).array("images", 4)
// );

// app.use("/images", express.static(path.join(__dirname, "images")));

// //app.use(bodyParser()); // Đảm bảo đọc JSON từ request body
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use("/auth", authRouters);
// app.use(productRouters);
// app.use(cartRouters);
// app.use("/order", orderRouters);
// app.use("/admin", adminRouters);
// app.use(liveChatRouter);
// const PORT = process.env.PORT || 5000;
// app.get("/", (req, res) => {
//   res.send("Hello from Render with HTTPS!");
// });
// mongoose
//   .connect(
//     "mongodb+srv://thuongdongbmt:XNEiIIa4MEuhSND8@cluster0.aqpxk4y.mongodb.net/"
//   )
//   .then((result) => {
//     const server = app.listen(5000, () => {
//       console.log("Server running on port 5000");
//     });

//     // Khởi tạo socket.io sau khi server chạy
//     initSocket(server);

//     // Middleware xác thực chi tiết
//   })
//   .catch((err) => console.log(err));

// //thuongdongbmt
// //XNEiIIa4MEuhSND8

require("dotenv").config(); // Thêm dòng này ở đầu file để đọc biến môi trường
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const authRouters = require("./routers/auth");
const productRouters = require("./routers/product");
const cartRouters = require("./routers/cart");
const orderRouters = require("./routers/order");
const adminRouters = require("./routers/admin");
const liveChatRouter = require("./routers/liveChat");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const socketio = require("socket.io");
const { initSocket } = require("./socket");
const path = require("path");
const multer = require("multer");
const fs = require("fs"); // Thêm module fs để làm việc với file system

const app = express();

// Tạo thư mục images nếu chưa tồn tại
const imagesDir = path.join(__dirname, "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Cấu hình CORS cho production và development
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        process.env.FRONTEND_URL, // Thay bằng domain production của bạn
        process.env.ADMIN_URL, // Thay bằng admin domain production của bạn
      ]
    : [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
      ];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Cấu hình Multer cho file upload
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array("images", 4)
);

app.use("/images", express.static(imagesDir));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/auth", authRouters);
app.use(productRouters);
app.use(cartRouters);
app.use("/order", orderRouters);
app.use("/admin", adminRouters);
app.use(liveChatRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Kết nối MongoDB với biến môi trường
const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.aqpxk4y.mongodb.net/${process.env.MONGODB_DBNAME}?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Khởi tạo socket.io
    initSocket(server);
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
