const router = require("express").Router();
const { getAllUsers, getSingleUser } = require("../controller/userController");

router.route("/").get(getAllUsers);
router.route("/:id").get(getSingleUser);

module.exports = router;
