const { User } = require("../DB/model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../services/cloudinary");
const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      next(new Error("cant found thos user", { cause: 404 }));
    } else {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign(
          { id: user._id, email: user.email, img: user.pic, name: user.name },
          process.env.LOGINTOKEN
        );

        res.status(200).json(token);
      } else {
        next(new Error("error in password", { cause: 404 }));
      }
    }
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};
const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { secure_url } = await cloudinary.uploader.upload(req.file.path, {
      folder: "auth",
    });

    const user = await User.findOne({ email });
    if (user) {
      next(new Error("user already exists", { cause: 409 }));
    } else {
      let hashpassword = await bcrypt.hash(
        password,
        parseInt(process.env.saltRound)
      );

      const newUser = new User({
        email,
        name,
        password: hashpassword,
        pic: secure_url,
      });
      await newUser.save();
      res.status(201).json({ message: "added user" });
    }
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};
module.exports = { Login, Register };
