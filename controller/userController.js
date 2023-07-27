const User = require("../models/User");

const { NotFoundError } = require("../errors/index");
const httpCodes = require("http-status-codes");

const getAllUsers = async (req, res) => {
  console.log(req.user);
  const users = await User.find({ role: "user" }).select("-password");

  if (!users) {
    throw new NotFoundError("Nothing found");
  }

  res.status(httpCodes.OK).json({
    users,
  });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({ _id: id }).select("-password");

  if (!user) {
    throw new NotFoundError("Nothing found");
  }

  res.status(httpCodes.OK).json({
    user,
  });
};

const showCurrentUser = async (req, res) => {
  console.log(req.user);
  res.status(httpCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  res.send("Update User");
};

const updateUserPassword = async (req, res) => {
  res.send("Update User Password");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
