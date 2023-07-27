const router = require("express").Router();
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
} = require("../controller/userController");
const {
  userAuthenticate,
  userPermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get(userAuthenticate, userPermissions("admin", "owner"), getAllUsers);
router.route("/:id").get(getSingleUser);
router.route("/showMe").get(userAuthenticate, showCurrentUser);

module.exports = router;
