const User = require("../models/User");
const {
  CustomError,
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const { attachCookiesToResponse } = require("../utils/index");
// const { token } = require("morgan");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const chkUser = await User.findOne({ email });
  if (!chkUser) {
    throw new UnauthenticatedError("User not found");
  }

  const passwordChkUser = await chkUser.confirmPassword(password);
  if (!passwordChkUser) {
    throw new UnauthenticatedError("Please provide valid password");
  }

  const payload = { name: chkUser.name, id: chkUser.id, role: chkUser.role };

  attachCookiesToResponse({ res, userData: payload });

  // res.send("Login");
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const chkEmailUnique = await User.findOne({ email });

  if (chkEmailUnique) {
    throw new CustomError.BadRequestError("Email already in use");
  }

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({
    name: name,
    email: email,
    password: password,
    role: role,
  });

  const payload = { name: user.name, id: user._id, role: user.role };

  attachCookiesToResponse({ res, userData: payload });
  // const token = createJWT({ payload: payload });

  // const onDayTime = 1000 * 60 * 60 * 24;

  // res.cookie("tokenCookie", token, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + onDayTime),
  // });

  // res.json({
  //   user: user,
  // });
};

const logout = async (req, res) => {
  res.cookie("tokenCookie", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    msg: "User logged out",
  });
};

module.exports = {
  login,
  register,
  logout,
};
