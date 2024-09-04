const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const createUser = asyncHandler(async (req, res) => {
  const {
    username,
    firstname,
    lastname,
    email,
    phone,
    password,
    age,
    birthdate,
    role,
    department,
  } = req.body;

  //! Validate all fields
  if (
    !username ||
    !firstname ||
    !lastname ||
    !email ||
    !phone ||
    !password ||
    !age ||
    !birthdate ||
    !role ||
    !department
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists!");
  }

  //! Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    firstname,
    lastname,
    email,
    phone,
    password: hashedPassword,
    age,
    birthdate,
    role,
    department,
  });

  if (user) {
    res.status(201).json({
      message: `New user ${username} created successfully`,
      _id: user._id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      age: user.age,
      birthdate: user.birthdate,
      role: user.role,
      department: user.department,
    });
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean().exec();

  if (!users.length) {
    res.status(404);
    throw new Error("No users found");
  }

  res.status(200).json(users);
});

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password").lean().exec();

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    username,
    firstname,
    lastname,
    email,
    phone,
    password,
    age,
    birthdate,
    role,
    department,
  } = req.body;

  const user = await User.findByIdAndUpdate(id, req.body);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  //! Check for duplicate username, if it is being updated
  if (username && username !== user.username) {
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate) {
      return res
        .status(400)
        .json({ message: "User already exist, try to use other username" });
    }
  }

  if (username) user.username = username;
  if (firstname) user.firstname = firstname;
  if (lastname) user.lastname = lastname;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (age) user.age = age;
  if (birthdate) user.birthdate = birthdate;
  if (role) user.role = role;
  if (department) user.department = department;

  //! Hash password
  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  const updatedUser = await user.save();

  res.status(200).json({
    message: "User updated successfully",
    _id: updatedUser._id,
    username: updatedUser.username,
    firstname: updatedUser.firstname,
    lastname: updatedUser.lastname,
    email: updatedUser.email,
    phone: updatedUser.phone,
    age: updatedUser.age,
    birthdate: updatedUser.birthdate,
    role: updatedUser.role,
    department: updatedUser.department,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ message: "User deleted successfully" });
});

module.exports = { createUser, getUsers, getUser, updateUser, deleteUser };
