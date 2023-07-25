const express = require("express");
const app = express();

require("express-async-errors");
require("dotenv").config();

const morgan = require("morgan");
//Database connection import
const connectDB = require("./db/connect");

const authRoutes = require("./routes/authRoute");

//importing middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//PORT
const PORT = process.env.PORT || 5000;

//Midllewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("tiny"));

//Routes

app.get("/", (req, res) => {
  res.json({
    msg: "Homepage",
  });
});

app.use("/api/v1/auth", authRoutes);

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
