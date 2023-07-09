const { auth } = require("../middleWare/auth.js");
const { createChat, fetchChat, createGroup, reNameGroup, AddToGroup, removeFromGroup, sendMessage, getMessages } = require("../controller/chatController");
const router = require("express").Router();

router.post("/", auth(),createChat);
router.get("/", auth(), fetchChat);
router.post("/group", auth(), createGroup);
router.patch("/rename", auth(), reNameGroup);
router.post("/del", auth(), removeFromGroup);
router.patch("/addgroup", auth(), AddToGroup);
router.post("/sendmessage", auth(), sendMessage);
router.get("/getmessages/:chatId", auth(), getMessages);
module.exports = router;