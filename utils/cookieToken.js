// const { createJWT } = require("./jwt");

// const attachCookiesToResponse = ({ fullData }) => {
//   const { res, payload } = fullData;

//   const token = createJWT({ payload: payload });

//   const onDayTime = 1000 * 60 * 60 * 24;

//   res.cookie("tokenCookie", token, {
//     httpOnly: true,
//     expires: new Date(Date.now() + onDayTime),
//   });

// };

// module.exports = attachCookiesToResponse;
