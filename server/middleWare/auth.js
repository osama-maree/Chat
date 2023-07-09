const jwt = require("jsonwebtoken");
const { User } = require("../DB/model/userModel");
const auth = () => {
  return async (req, res, next) => {
   
    let { token } = req.headers;
 
    if (!token.startsWith(process.env.authBearerToken)) {
      res.status(400).json({ error: "error token" });
    } else {
      token = token.split("__")[1];
      const decoded = await jwt.verify(token, process.env.LOGINTOKEN);
      const user = await User.findById({ _id: decoded.id }).select("-password");
      // console.log(user)
      req.user = user;
      next();
    }
  };
};
module.exports = { auth };
