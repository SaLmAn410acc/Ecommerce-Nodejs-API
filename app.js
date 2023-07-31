const express = require("express");
const app = express();

require("express-async-errors");
require("dotenv").config();

const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const fileUpload = require("express-fileupload");

//Database connection import
const connectDB = require("./db/connect");

//Routes
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoutes");

//importing middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//PORT
const PORT = process.env.PORT || 5000;

//Midllewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("./public"));
app.use(fileUpload());

app.use(morgan("tiny"));
app.use(cookieParser(process.env.JWT_SECRET));

//Routes

app.get("/", (req, res) => {
  res.json({
    msg: "Homepage",
  });
});

app.get("/api/v1/", (req, res) => {
  console.log(req.signedCookies);
  res.json({
    msg: "Homepage",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);

//Routes Middleware
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Server is listening in this port ${PORT}...`);
  });
};

start();
