const { Chat } = require("../DB/model/chatModel");
const { Message } = require("../DB/model/messageModel.js");
const { User } = require("../DB/model/userModel.js");
const createChat = async (req, res, next) => {
  try {
    const { userId } = req.body;
    let isChat = await Chat.find({
      isGroup: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("letestMessage");
    isChat = await User.populate(isChat, {
      path: "letestMessage.sender",
      select: "name pic email",
    });
    if (isChat.length > 0) {
      return res.status(200).json(isChat);
    } else {
      try {
        let chatData = {
          chatName: "Osama-Chat",
          isGroup: false,
          users: [req.user._id, userId],
        };
        const result = await Chat.create(chatData);
        const chat = await Chat.find({ _id: result._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(chat);
      } catch (e) {
        next(new Error(err.message, { cause: 500 }));
      }
    }
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};

const fetchChat = async (req, res, next) => {
  try {
    const chat = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("letestMessage")
      .sort({ updatedAt: -1 });
    const response = await User.populate(chat, {
      path: "letestMessage",
      select: "name pic email",
    });
    res.status(200).json(response);
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};

const createGroup = async (req, res, next) => {
  try {
    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
      next(new Error("not Group", { cause: 400 }));
    }

    const isExit = users.find((user) => user.email === req.user.email);
    if (!isExit) {
      users.push(req.user);
    }

    const groupChat = await Chat.create({
      chatName: req.body.name,
      users,
      isGroup: true,
      groupAdmin: req.user,
    });
    const Group = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(Group);
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};

const reNameGroup = async (req, res, next) => {
  try {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(updatedChat);
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};

const AddToGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $addToSet: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(added);
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};

const removeFromGroup = async (req, res, next) => {
  try {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
      { _id: chatId },
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(added);
  } catch (err) {
    console.log(err.message);
    next(new Error(err.message, { cause: 500 }));
  }
};

const sendMessage = async (req, res, next) => {
  try {
    const { content, chatId } = req.body;
    let newMessage = {
      sender: req.user._id,
      content,
      chat: chatId,
    };
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      letestMessage: message,
    });
    res.status(200).json(message);
  } catch (err) {
    next(new Error(err.stack, { cause: 500 }));
  }
};

const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.status(200).json(messages);
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};
module.exports = {
  getMessages,
  sendMessage,
  createChat,
  removeFromGroup,
  fetchChat,
  createGroup,
  reNameGroup,
  AddToGroup,
};
