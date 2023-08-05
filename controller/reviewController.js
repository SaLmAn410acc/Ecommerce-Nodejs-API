const Review = require("../models/Review");
const Product = require("../models/Product");

const httpCodes = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors/index");
const { checkPermissions } = require("../utils/index");

const createReview = async (req, res) => {
  const { productId: productId } = req.body;

  const checkProductValid = await Product.findOne({ id: productId });
  if (!checkProductValid) {
    throw new NotFoundError("No product with this id");
  }

  const productReview = await Review.findOne({
    _id: productId,
    user: req.user.id,
  });
  if (productReview) {
    throw new BadRequestError("Already give review to this product");
  }

  req.body.user = req.user.id;
  const review = await Review.create(req.body);

  res.status(httpCodes.CREATED).json({ review: review });
};

const getAllReviews = async (req, res) => {
  const review = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });
  if (!review) {
    throw new BadRequestError("Something went wrong");
  }
  res.status(httpCodes.OK).json({ review: review });
};

const getSingleReview = async (req, res) => {
  const reviewId = req.params.id;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw new NotFoundError("No review in with this id");
  }
  res.status(httpCodes.OK).json({ review: review });
};

const updateReview = async (req, res) => {
  const reviewId = req.params.id;

  const { rating, title, comment } = req.body;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError("No review in with this id");
  }

  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();

  res.status(httpCodes.OK).json({
    updatedReview: review,
  });
};

const deleteReview = async (req, res) => {
  const reviewId = req.params.id;

  const review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new NotFoundError("No review in with this id");
  }
  checkPermissions(req.user, review.user);

  await review.remove();

  res.status(httpCodes.OK).json({
    success: true,
  });
};

const getSingleProductReview = async (req, res) => {
  const { id: productId } = req.params;
  const review = await Review.find({ product: productId });

  res.status(httpCodes.OK).json({
    review: review,
    count: review.length,
  });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReview,
};
