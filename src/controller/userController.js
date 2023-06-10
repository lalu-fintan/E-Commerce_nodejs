const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const userModel = require("../model/userModel");
const genreateRefreshToken = require("../config/refreshToken");
const sendEmail = require("../middleware/emailControl");

//register user
const register = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, mobile, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    const newUser = await userModel.create({
      firstname,
      lastname,
      email,
      mobile,
      password,
    });
    res.status(200).json(newUser);
  } else {
    throw new Error("user already exist");
  }
});

//login user

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  console.log(email);
  console.log(password === user.password);
  // if (user && (await bcrypt.compare(password, user.password))) {
  //second method
  if (user && (await user.isPasswordMatched(password))) {
    const refreshToken = genreateRefreshToken(user.id);

    const updateUser = await userModel.findByIdAndUpdate(
      user.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    const validUser = jwt.sign(
      {
        id: req.params.id,
        email: user.email,
        password: user.password,
        role: user.role,
      },
      process.env.SECRET_TOKEN,
      { expiresIn: "1d" }
    );
    res.status(200).json({
      message: "login successfull",
      data: user,
      token: validUser,
    });
  } else {
    throw new Error("email or password is invalid");
  }
});

//handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) {
    throw new Error("you don't have a refresh token in cookies");
  }
  const refreshToken = cookie.refreshToken;
  const user = await userModel.findOne({ refreshToken });
  if (!user) {
    throw new Error("this refresh token doesn't matched in the db ");
  } else {
    jwt.verify(refreshToken, process.env.SECRET_TOKEN, (err, decoded) => {
      if (err || decoded.id !== user.id) {
        throw new Error("something wrong in refresh token");
      } else {
        const accessToken = jwt.sign(
          {
            id: req.params.id,
            email: user.email,
            password: user.password,
            role: user.role,
          },
          process.env.SECRET_TOKEN,
          { expiresIn: "1d" }
        );
        res.status(200).json({ accessToken });
      }
    });
  }
});

//logout user

const logOut = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) {
    throw new Error("you don't have a refresh token in cookies");
  }
  const refreshToken = cookie.refreshToken;
  const user = await userModel.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    res.sendStatus(403); //forbitten
  }
  await userModel.findOneAndUpdate(
    { refreshToken },
    {
      refreshToken: "",
    }
  );
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  res.status(200).json({ message: "logout successfully" }); //forbitten
});

//reset password
const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  const user = await userModel.findById(id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.status(200).json(updatedPassword);
  }
  res.json(user);
});

//forget password token

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error("user not found in this email");
  }
  const token = await user.createResetPasswordToken();
  await user.save();
  const resetURL = `Hi ,Follow this link to reset  your password .This link is only valid for 10  min.<a href="http://localhost:5001/api/usr/password/${token}">Click link</a> `;
  const data = {
    to: email,
    text: "Hey user",
    subject: "reset password link",
    html: resetURL,
  };
  sendEmail(data);
  res.status(200).json(token);
});

//  forget password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  console.log({ token });
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  console.log({ hash });
  const user = await userModel.findOne({
    passwordResetToken: hash,
    passwordResetExpires: { $gt: Date.now() },
  });
  console.log(user);

  if (!user) {
    throw new Error("Token Expires");
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json(user);
});

//get all user

const getAllUser = asyncHandler(async (req, res) => {
  const user = await userModel.find();
  res.status(200).json(user);
});

const userGetById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findById(id);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(400).json({ message: "no users found" });
  }
});
const userUpdateById = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);

  if (user) {
    const update = await userModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(update);
  } else {
    res.status(400).json({ message: "no users found" });
  }
});

const userDeleteById = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);

  if (user) {
    const deleteUser = await userModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({ message: "user has been deleted" });
  } else {
    res.status(400).json({ message: "no users found" });
  }
});
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const block = await userModel.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true }
  );
  res.status(200).json({ message: "user blocked" });
});
const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const unBlock = await userModel.findByIdAndUpdate(
    id,
    { isBlocked: false },
    { new: true }
  );
  res.status(200).json({ message: "user unblocked" });
});

module.exports = {
  register,
  login,
  getAllUser,
  userGetById,
  userUpdateById,
  userDeleteById,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logOut,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
};
