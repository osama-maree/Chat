const { Login,Register } = require("../controller/authController.js");
const {myMulter,HME,multerValidation}=require('../services/multer')

const router = require("express").Router();
router.post('/login',Login)
router.post("/register", myMulter(multerValidation.image).single("image"), HME ,Register);
module.exports = router;
