const Order = require("../models/Order");
const Product = require("../models/Product");

const { BadRequestError } = require("../errors/index");
const statusCodes = require("http-status-codes");

const { checkPermissions } = require("../utils/index");

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "someRandomValue";
  return { client_secret, amount };
};

// const createOrder = async (req, res) => {
//   const { items, tax, shippingFee } = req.body;

//   if (!items || items.length < 1) {
//     throw new BadRequestError("No product in cart");
//   }

//   if (!tax || !shippingFee) {
//     throw new BadRequestError("Please provide tax and shippingfee");
//   }

//   let subTotal = 0;
//   let orderItem = {};

//   for (let item of items) {
//     const dbProduct = await Product.findOne({ _id: item.product });

//     if (!dbProduct) {
//       throw new BadRequestError(`No product with this id : ${item.product}`);
//     }

//     const SingleOrderItem = {
//       name: dbProduct.name,
//       image: dbProduct.image,
//       price: dbProduct.price,
//       amount: item.amount,
//       id: dbProduct._id,
//     };

//     orderItem = { ...orderItem, SingleOrderItem };
//     subTotal += item.amount * dbProduct.price;
//   }
//   const total = tax + shippingFee + subTotal;

//   // get client secret
//   const paymentIntent = await fakeStripeAPI({
//     amount: total,
//     currency: "usd",
//   });

//   const order = new Order({
//     tax,
//     shippingFee,
//     subtotal: subTotal,
//     total: total,
//     orderItems: [orderItem],
//     user: req.user.id,
//     clientSecret: paymentIntent.client_secret,
//   });

//   // Save the new order to the database
//   order
//     .save()
//     .then((order) => {
//       console.log("Order saved successfully:", savedOrder);
//     })
//     .catch((error) => {
//       console.error("Error saving order:", error);
//     });

//   console.log(order);
//   res
//     .status(statusCodes.CREATED)
//     .json({ order, clientSecret: order.clientSecret });
// };

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequestError("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequestError(
      "Please provide tax and shipping fee"
    );
  }

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct) {
      throw new CustomError.NotFoundError(
        `No product with id : ${item.product}`
      );
    }
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };
    // add item to order
    orderItems = [...orderItems, singleOrderItem];
    // calculate subtotal
    subtotal += item.amount * price;
  }
  // calculate total
  const total = tax + shippingFee + subtotal;
  // get client secret
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.id,
  });

  res
    .status(statusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({});
  res.status(statusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);
  res.status(statusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id });
  res.status(statusCodes.OK).json({ orders, count: orders.length });
};

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params;
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({ _id: orderId });
  if (!order) {
    throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
  }
  checkPermissions(req.user, order.user);

  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();

  res.status(statusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
