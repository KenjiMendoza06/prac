import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    //! Small check for existence

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const {
    username,
    firstname,
    lastname,
    email,
    age,
    birthdate,
    password,
    department,
    role,
  } = req.body;

  //! Validate
  if (
    !username ||
    !firstname ||
    !lastname ||
    !email ||
    !age ||
    !birthdate ||
    !password ||
    !department ||
    !role
  ) {
    res.status(400);
    throw new ApiError(400, "All fields are required");
  }

  //! Check for existing user
  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(400);
    throw new ApiError(400, "User with username already exists");
  }

  //! For Profile Picture Upload
  console.warn("req.file", req.file);
  const profilePicLocalPath = req.file?.path;

  if (!profilePicLocalPath) {
    throw new ApiError(400, "Profile picture file is missing");
  }

  let profilePic;
  try {
    profilePic = await uploadOnCloudinary(profilePicLocalPath);
    console.log("Uploaded profile picture", profilePic);
  } catch (error) {
    console.log("Error uploading profile picture: ", error);
    throw new ApiError(500, "Profile picture upload failed");
  }

  //! Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //! Create User
  try {
    const user = await User.create({
      username,
      firstname,
      lastname,
      email,
      age,
      birthdate,
      password: hashedPassword,
      department,
      role,
      profilePicture: profilePic.url,
    });

    const createdUser = await User.findById(user._id)
      .select("-password")
      .lean()
      .exec();

    if (!createdUser) {
      throw new ApiError(500, "User registration failed");
    }

    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registered successfuly"));
  } catch (error) {
    console.log("User Creation failed");

    if (profilePic) {
      await deleteFromCloudinary(profilePic.public_id);
    }

    throw new ApiError(
      500,
      "User registration failed and image upload were deleted"
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: "" });

  
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(400, "Refresh token is missing");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(404, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(400, "Invalid refresh token");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefresh },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong while refreshing access token");
  }
});

export { registerUser, refreshAccessToken };
