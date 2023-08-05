const Product = require("../models/Product");
const httpCodes = require("http-status-codes");
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors/index");

const path = require("path");

const createProduct = async (req, res) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(httpCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const product = await Product.find({});
  if (!product) {
    throw new NotFoundError("No product found is something wrong!");
  }

  res.status(httpCodes.OK).json({ product });
};

const getSingleProduct = async (req, res) => {
  const { id } = req.params.id;

  const product = await Product.findOne({ id: id }).populate("reviews");
  if (!product) {
    throw new NotFoundError("No product found with this id");
  }
  res.status(httpCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id } = req.params.id;

  const product = await Product.findOneAndUpdate({ id: id }, req.body, {
    runValidators: true,
    new: true,
  });

  if (!product) {
    throw new NotFoundError("No product found with this id");
  }

  res.status(httpCodes.CREATED).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params.id;

  const product = await Product.findOne({ id: id });
  if (!product) {
    throw new NotFoundError("No product found with this id");
  }

  await product.remove();

  res.status(httpCodes.OK).json({ product });
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("No file uploaded!!");
  }
  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please provide image type");
  }
  const imageLocation = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );

  await productImage.mv(imageLocation);
  res.status(httpCodes.OK).json({ imagePath: `/uploads/${productImage.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
