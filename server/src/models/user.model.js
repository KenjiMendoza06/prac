import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      min: 3,
      max: 10,
      index: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: 18,
      max: 100,
    },
    birthdate: {
      type: Date,
      required: [true, "Birthdate is required"],
    },
    firstname: {
      type: String,
      required: [true, "Firstname is required"],
    },
    lastname: {
      type: String,
      required: [true, "Lastname is required"],
    },
    profilePicture: {
      type: String,
      required: [true, "Profile picture is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      min: 5,
      max: 15,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /^[a-zA-Z0-9._%+-]+@aviormarine\.com$/,
        "Please enter a valid aviormarine email address",
      ],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: [
        "Fleet A",
        "Fleet B",
        "Fleet C",
        "Fleet D",
        "Fleet E",
        "Fleet F",
        "Fleet G",
        "HR",
        "IT",
        "Training",
        "Manager",
        "President",
        "Recruitment",
      ],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["Employee", "Admin", "Manager", "Head Manager", "HR"],
    },
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.generateAccessToken = function () {
  //! Short lived access token
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      firstname: this.firstname,
      lastname: this.lastname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

UserSchema.methods.generateRefreshToken = function () {
  //! Long lived refresh token
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", UserSchema);

export default User;
