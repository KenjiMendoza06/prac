const asyncHandler = require("express-async-handler");
const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");

const createUser = asyncHandler(async (req, res) => {
  const {
    username,
    firstname,
    lastname,
    age,
    phone,
    email,
    birthdate,
    password,
    role,
    department,
  } = req.body;

  //! Validation
  if (
    !username ||
    !firstname ||
    !lastname ||
    !age ||
    !phone ||
    !email ||
    !birthdate ||
    !password ||
    !role ||
    !department
  ) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  //! Hash password
  const salt = await bcrypt.genSalt(10);
  const HashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    firstname,
    lastname,
    age,
    phone,
    email,
    birthdate,
    password: HashedPassword,
    role,
    department,
  });

  if (user) {
    res.status(201).json({
      message: `New user ${username} has been created successfully`,
      username,
      firstname,
      lastname,
      age,
      phone,
      email,
      birthdate,
      role,
      department,
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
})

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password").lean().exec();

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
})

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { username, firstname, lastname, age, phone, email, birthdate, role, department } = req.body;

  if (!id) {
    res.status(400);
    throw new Error("Please provide a user ID");
  }

  const user = await User.findByIdAndUpdate(id, req.body)

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

   //! Check for existing username, if it is being updated
   if (username && username !== user.username) {
    const existing = await User.findOne({ username }).lean().exec();
    if (existing) {
      return res.status(400).json({ message: "Existing username" });
    }
  }

  //! Update fields if they are provided
  user.username = username || user.username;
  user.firstname = firstname || user.firstname;
  user.lastname = lastname || user.lastname;
  user.age = age || user.age;
  user.phone = phone || user.phone;
  user.email = email || user.email;
  user.birthdate = birthdate || user.birthdate;
  user.role = role || user.role;
  user.department = department || user.department;

  //! Hash password if it is being updated
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  //! Save updated user
  const updatedUser = await user.save();
  res.status(200).json({ message: `${updatedUser.username} has been updated successfully` });
})

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400)
    throw new Error("Please provide a user ID");
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ message: `${user.username} has been deleted successfully` });
})

module.exports = { createUser, getUsers, getUser, updateUser, deleteUser };
