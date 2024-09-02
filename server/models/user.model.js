const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true
  },
  firstname: {
    type: String,
    required: [true, "Please provide a firstname"]
  },
  lastname: {
    type: String,
    required: [true, "Please provide a lastname"]
  },
  age: {
    type: Number,
    required: [true, "Please provide an age"],
    min: [18, "Age must be at least 18 years old"],
  },
  birthdate: {
    type: Date,
    required: [true, "Please provide a birthdate"],
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    match: [
      /^[a-zA-Z0-9._%+-]+@aviormarine\.com$/,
      'Please enter a valid aviormarine email address',
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["Admin", "Employee", "Manager", "Head Manager", "HR"],
    required: [true, "Please provide a role"],
    default: "Employee"
  },
  department: {
    type: String,
    enum: ["Fleet A", "Fleet B", "Fleet C", "Fleet D", "Fleet E", "Fleet F", "Fleet G", "IT", "Training"]
  }
},
{
  timestamps: true
})

const User = mongoose.model("User", UserSchema);

module.exports = User;