const mongoose = require("mongoose");

const RevviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide title"],
      maxLength: 100,
    },
    comment: {
      type: String,
      required: [true, "Please provide comment"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

RevviewSchema.index({ product: 1, user: 1 }, { unique: true });

// RevviewSchema.statics.calculateAveragerating = async (productId) => {
//   const result = await this.aggregate([
//     {
//       $match: {
//         product: productId,
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         averageRating: {
//           $avg: "$rating",
//         },
//         numOfReviews: {
//           $sum: 1,
//         },
//       },
//     },
//   ]);
//   console.log(result);
// };

// RevviewSchema.post("save", async function () {
//   await this.constructor.calculateAveragerating(this.product);
// });

// RevviewSchema.post("remove", async function () {
//   await this.constructor.calculateAveragerating(this.product);
// });

RevviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

RevviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.product);
});

RevviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model("Review", RevviewSchema);
