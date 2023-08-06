const router = require("express").Router();
const {
  userAuthenticate,
  userPermissions,
} = require("../middleware/authentication");

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require("../controller/orderController");

router
  .route("/")
  .get([userAuthenticate, userPermissions("admin")], getAllOrders)
  .post(userAuthenticate, createOrder);

router.route("/showAllMyOrders").get(userAuthenticate, getCurrentUserOrders);

router
  .route("/:id")
  .get(userAuthenticate, getSingleOrder)
  .patch(userAuthenticate, updateOrder);

module.exports = router;
