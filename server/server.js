const express = require("express");
require("dotenv").config();
const app = express();
const userRoute = require("./routes/user.route.js");
const requestRoute = require("./routes/request.route.js");
const connectDB = require("./config/db.js");
const errorHandler = require("./middlewares/error.handler.js");
const PORT = process.env.PORT || 8000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//? Routes
app.use("/users", userRoute);
app.use("/requests", requestRoute);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
