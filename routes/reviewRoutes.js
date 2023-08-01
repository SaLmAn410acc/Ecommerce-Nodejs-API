const router = require("express").Router();

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require("../controller/reviewController");

const { userAuthenticate } = require("../middleware/authentication");

router.route("/").get(getAllReviews).post(userAuthenticate, createReview);
router
  .route("/:id")
  .get(getSingleReview)
  .patch(userAuthenticate, updateReview)
  .delete(userAuthenticate, deleteReview);

module.exports = router;
