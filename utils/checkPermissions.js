const { UnauthenticatedError } = require("../errors");

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === "admin") return;
  if (requestUser.id === resourceUserId.toString()) return;
  throw new UnauthenticatedError("you are not allowed to use this route");
};

module.exports = checkPermissions;
