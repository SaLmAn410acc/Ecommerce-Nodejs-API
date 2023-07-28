const User = require("../models/User");

const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors/index");
const httpCodes = require("http-status-codes");

const { createTokenUser, attachCookiesToResponse } = require("../utils/index");

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
  // res.status(200).send("hello current user");
  res.json({ user: req.user });
};

const updateUser = async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    throw new UnauthenticatedError("Please provide email and password");
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    { email, name },
    { runValidators: true, new: true }
  );

  const payload = createTokenUser(user);
  attachCookiesToResponse({ res, userData: payload });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new BadRequestError("Please provide password");
  }

  const id = req.user.id;
  const userValid = await User.findOne({ _id: id });

  if (!userValid) {
    throw new UnauthenticatedError(`No user with id: ${userValid}`);
  }

  const userData = await userValid.confirmPassword(oldPassword);

  if (!userData) {
    throw new UnauthenticatedError("Password not match");
  }

  userValid.password = newPassword;
  await userValid.save();

  res.status(httpCodes.OK).json({
    msg: "Updated Password success!!!",
  });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
