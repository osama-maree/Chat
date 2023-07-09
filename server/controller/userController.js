const { User } = require("../DB/model/userModel");
const getUsers = async (req, res, next) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const users = await User.find(keyword).find({
      _id: { $ne: req.user_id },
    })
    return res.status(200).json(users);
  } catch (err) {
    next(new Error(err.message, { cause: 500 }));
  }
};
module.exports = { getUsers };
