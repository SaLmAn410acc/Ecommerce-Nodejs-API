const { UnauthenticatedError } = require("../errors");

const checkPermissions = (requestUser, validateUser) => {
  if (requestUser.role === "admin") return;
  if (requestUser.id === validateUser.id) return;
  throw new UnauthenticatedError("you are not allowed to use this route");
};

module.exports = checkPermissions;
