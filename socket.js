let io;
const activeRooms = {};
function initSocket(server) {
  const socketio = require("socket.io");
  io = socketio(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3001"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Khi client tạo room
    socket.on("createRoom", (roomId) => {
      activeRooms[roomId] = true;
      socket.join(roomId);
      io.emit("activeRooms", Object.keys(activeRooms));
      console.log(`Socket ${socket.id} created and joined room ${roomId}`);
    });

    // Khi client gửi tin nhắn
    socket.on("sendMessage", ({ roomId, message }) => {
      console.log(`Message in room ${roomId}:`, message);

      // Xử lý cả 2 trường hợp message là string hoặc object
      const messageContent =
        typeof message === "string" ? message : message.text;
      const sender = typeof message === "string" ? "user" : message.sender;

      // if (messageContent === "/end") {
      //   socket.to(roomId).emit("chatEnded");
      //   socket.leave(roomId);
      //   delete activeRooms[roomId];
      //   io.emit("activeRooms", Object.keys(activeRooms));
      // } else {
      //   io.to(roomId).emit("receiveMessage", {
      //     sender,
      //     text: messageContent,
      //     timestamp: Date.now(),
      //   });
      // }
      if (messageContent.trim() === "/end") {
        console.log(`Ending chat for room ${roomId}`);

        // 1. Gửi thông báo kết thúc đến tất cả thành viên trong phòng
        io.to(roomId).emit("chatEnded", {
          roomId,
          sender: "system",
          text: "Cuộc trò chuyện đã kết thúc",
          timestamp: Date.now(),
        });

        // 2. Buộc tất cả client rời phòng
        io.in(roomId).socketsLeave(roomId);

        // 3. Xóa phòng khỏi danh sách active
        delete activeRooms[roomId];

        // 4. Cập nhật danh sách phòng cho tất cả admin
        io.emit("activeRooms", Object.keys(activeRooms));

        console.log(`Room ${roomId} has been closed`);
      } else {
        io.to(roomId).emit("receiveMessage", {
          sender,
          text: messageContent,
          timestamp: Date.now(),
        });
      }
    });

    socket.on("getActiveRooms", () => {
      socket.emit("activeRooms", Object.keys(activeRooms));
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

function getIO() {
  if (!io) throw new Error("Socket.io chưa được khởi tạo");
  return io;
}

module.exports = { initSocket, getIO };
