require("dotenv").config()
const express = require("express")
const PORT = process.env.PORT || 8000
const userRoute = require("./routes/user.route.js")
const requestRoute = require("./routes/request.route.js")
const connectDB = require("./config/db.js")
const errorHandler = require("./middlewares/error.handler.js")
const app = express()

//? Connect to MongoDB
connectDB();

//? Middleware
app.use(express.json())
app.use(express.json({ extended: true }))

//? Routes
app.use("/users", userRoute)
app.use("/requests", requestRoute)

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

