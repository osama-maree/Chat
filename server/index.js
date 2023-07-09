const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./DB/connection.js");
const userRouter = require("./router/userRouter.js");
const authRouter = require("./router/authRouter");
const chatRouter = require("./router/chatRouter");
const cors = require("cors");
app.use(express.json());
app.use(cors());
dotenv.config();
const PORT = process.env.PORT || 5000;
connectDB();
const baseURL = process.env.baseURL;

console.log(baseURL);
app.use(`${baseURL}/user`, userRouter);
app.use(`${baseURL}/auth`, authRouter);

app.use(`${baseURL}/chat`, chatRouter);
// app.use("*", (req, res) => {
//   next(new Error("page is not found", { cause: 404 }));
// });
app.use((err, req, res, next) => {
  if (err) {
    res
      .status(err["cause"])
      .json({ message: "catch error", error: err.message });
  }
});
const server = app.listen(PORT, () => {
  console.log("Server listening on port 5000");
});
const io = require("socket.io")(server, {
  pingTimeout: 6000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user Joind Room" + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessage) => {
    var chat = newMessage.chat;
    if (!chat.users) {
      return console.log("chat users not defined");
    }
    chat.users.forEach((element) => {
      if (element._id == newMessage.sender._id) {
        return;
      }
      socket.in(element._id).emit("message recieved", newMessage);
    });
  });
});
