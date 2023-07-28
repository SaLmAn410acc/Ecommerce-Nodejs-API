const { isTokenValid } = require("../utils/jwt");
const { UnauthorizedError, UnauthenticatedError } = require("../errors/index");

const userAuthenticate = async (req, res, next) => {
  const token = req.signedCookies.tokenCookie;
  if (!token) {
    throw new UnauthenticatedError("Authentication Invalid");
  }

  try {
    const { name, id, role } = await isTokenValid({ token: token });
    req.user = { name, id, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
};

const userPermissions = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      throw new UnauthorizedError(
        "This user not have permission of this route"
      );
    }
    next();
  };
};

module.exports = { userAuthenticate, userPermissions };
