const router = require("express").Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUserPassword,
  updateUser,
} = require("../controller/userController");
const {
  userAuthenticate,
  userPermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get(userAuthenticate, userPermissions("admin", "owner"), getAllUsers);
router.route("/showMe").get(userAuthenticate, showCurrentUser);
router.route("/updateUserPassword").patch(userAuthenticate, updateUserPassword);
router.route("/updateUser").patch(userAuthenticate, updateUser);

router.route("/:id").get(getSingleUser);

module.exports = router;
