const User = require("../models/User");
const CustomError = require("../errors");
const { createJWT } = require("../utils/index");
const { token } = require("morgan");

const login = async (req, res) => {
  res.send("Login");
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const chkEmailUnique = await User.findOne({ email });

  if (chkEmailUnique) {
    throw new CustomError.BadRequestError("Email already in use");
  }

  const user = await User.create({
    name: name,
    email: email,
    password: password,
  });

  const payload = { name: user.name, id: user._id, role: user.role };
  const token = createJWT({ payload: payload });
  res.json({
    user: user,
    token: token,
  });
};

const logout = async (req, res) => {
  res.send("logout");
};

module.exports = {
  login,
  register,
  logout,
};
