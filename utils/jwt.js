const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = ({ token }) => {
  jwt.verify(token, JWT_SECRET);
};

const attachCookiesToResponse = ({ res, userData }) => {
  console.log(userData);

  const token = createJWT({ payload: userData });

  const onDayTime = 1000 * 60 * 60 * 24;

  res.cookie("tokenCookie", token, {
    httpOnly: true,
    expires: new Date(Date.now() + onDayTime),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });

  res.status(201).json({
    user: {
      name: userData.name,
      id: userData.id,
      role: userData.role,
    },
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
