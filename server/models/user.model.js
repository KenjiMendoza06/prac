const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  firstname: {
    type: String,
    required: [true, "Firstname is required"],
  },
  lastname: {
    type: String,
    required: [true, "Lastname is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    min: [6, "Password must be at least 6 characters"],
  },
  age: {
    type: Number,
    required: [true, "Age is required"],
  },
  birthdate: {
    type: Date,
    required: [true, "Birthdate is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [
      /^[\w.-]+@aviormarine\.com$/,
      "Please enter a valid email address ending with @aviormarine.com",
    ],
  },
  role: {
    type: String,
    enum: ["Admin", "Employee", "Manager", "Head Manager", "HR"],
    default: "Employee",
    required: [true, "Role is required"],
  },
  department: {
    type: String,
    enum: [
      "Fleet A",
      "Fleet B",
      "Fleet C",
      "Fleet D",
      "Fleet E",
      "Fleet F",
      "Fleet G",
      "IT",
      "Training",
      "HR",
      "Accounting",
    ],
    required: [true, "Department is required"],
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
