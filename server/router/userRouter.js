const router = require("express").Router();
const { getUsers } = require("../controller/userController");
const { auth } = require("../middleWare/auth");
router.get("/", auth(), getUsers);
module.exports = router;
