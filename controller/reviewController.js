const Review = require("../models/Review");
const Product = require("../models/Product");

const httpCodes = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors/index");

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

const getAllReviews = (req, res) => {
  res.send("getAllReviews");
};

const getSingleReview = async (req, res) => {
  res.send("getSingleReview");
};

const updateReview = async (req, res) => {
  res.send("updateReview");
};

const deleteReview = async (req, res) => {
  res.send("deleteReview");
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
