const router = require("express").Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controller/productController");

const { getSingleProductReview } = require("../controller/reviewController");

const {
  userAuthenticate,
  userPermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get(getAllProducts)
  .post(userAuthenticate, userPermissions("admin", "owner"), createProduct);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(userAuthenticate, userPermissions("admin", "owner"), updateProduct)
  .delete(userAuthenticate, userPermissions("admin", "owner"), deleteProduct);
router
  .route("/uploadImage")
  .post(userAuthenticate, userPermissions("admin", "owner"), uploadImage);

router.route("/:id/review").get(getSingleProductReview);
module.exports = router;
